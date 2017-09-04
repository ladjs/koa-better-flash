const test = require('ava');
const request = require('supertest');
const Koa = require('koa');
const session = require('koa-generic-session');
const Router = require('koa-router');

const { beforeEach, afterEach } = require('./helpers');

test.beforeEach(beforeEach);
test.afterEach(afterEach);

test('binds a middleware function', t => {
  t.true(t.context.app.middleware.length === 3);
});

test('koa errors without sessions', async t => {
  const app = new Koa();
  app.context.onerror = function(err) {
    if (!err) return;
    this.status = 500;
    this.body = err.message;
    this.length = Buffer.byteLength(this.body);
    this.res.end(this.body);
  };
  const router = new Router();
  router.get('/', ctx => {
    ctx.flash();
  });
  app.use(t.context.flash());
  app.use(router.routes());
  const res = await request(app.listen()).get('/');
  t.is(res.status, 500);
  t.is(res.text, 'ctx.flash() requires sessions');
});

test('flash is not set twice', t => {
  const ctx = { flash: 1 };
  t.context.flash()(ctx, () => {});
  t.is(ctx.flash, 1);
});

test('koa has empty flash session object after called', async t => {
  const app = new Koa();
  const router = new Router();
  router.get('/', ctx => {
    ctx.flash('info', 'hello world');
    ctx.flash();
    t.deepEqual(ctx.session.flash, {});
    ctx.status = 200;
  });
  app.keys = ['keys'];
  app.use(session());
  app.use(t.context.flash());
  app.use(router.routes());
  const res = await request(app.listen()).get('/');
  t.is(res.status, 200);
});

test('flash message', async t => {
  const { app } = t.context;
  const agent = request.agent(app.listen());
  await agent.post('/');
  const res = await agent.get('/').set('Accept', 'application/json');
  t.deepEqual(res.body, ['hello world']);
});

test('flash message with format', async t => {
  const { app } = t.context;
  const agent = request.agent(app.listen());
  await agent.post('/?name=koa');
  const res = await agent.get('/').set('Accept', 'application/json');
  t.deepEqual(res.body, ['hello koa world']);
});

test('flash an array of messages', async t => {
  const { app } = t.context;
  const agent = request.agent(app.listen());
  await agent.post('/?multiple=true');
  const res = await agent.get('/').set('Accept', 'application/json');
  t.deepEqual(res.body, ['hi', 'world', 'hello']);
});

test('return all messages', async t => {
  const { app } = t.context;
  const res = await request(app.listen())
    .get('/')
    .set('Accept', 'application/json');
  t.deepEqual(res.body, []);
});
