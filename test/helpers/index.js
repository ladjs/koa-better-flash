const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-generic-session');

const flash = require('../../');

function beforeEach(t) {
  const app = new Koa();
  const router = new Router();
  router.post('/', ctx => {
    if (ctx.query.name) ctx.flash('info', 'hello %s world', ctx.query.name);
    else if (ctx.query.multiple) ctx.flash('info', ['hi', 'world', 'hello']);
    else ctx.flash('info', 'hello world');
    ctx.status = 200;
  });
  router.get('/', ctx => {
    ctx.body = ctx.flash('info');
  });
  app.keys = ['keys'];
  app.use(session());
  app.use(flash());
  app.use(router.routes());
  Object.assign(t.context, { app, flash });
}

function afterEach() {}

module.exports = { beforeEach, afterEach };
