# koa-better-flash

[![build status](https://semaphoreci.com/api/v1/niftylettuce/koa-better-flash/branches/master/shields_badge.svg)](https://semaphoreci.com/niftylettuce/koa-better-flash)
[![code coverage](https://img.shields.io/codecov/c/github/niftylettuce/koa-better-flash.svg)](https://codecov.io/gh/niftylettuce/koa-better-flash)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://github.com/lassjs/lass)
[![license](https://img.shields.io/github/license/niftylettuce/koa-better-flash.svg)](<>)

> Flash message middleware for Koa and Passport


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install koa-better-flash
```

[yarn][]:

```sh
yarn add koa-better-flash
```


## Usage

```js
const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-generic-session');
const flash = require('koa-better-flash');

const app = new Koa();
const router = new Router();

router.post('/', (ctx, next) => {
  // you can also pass an array of messages:
  // ctx.flash('info', [ 'hi', 'hello', 'good morning' ]);
  ctx.flash('info', 'hello world');
  ctx.status = 200;
});

router.get('/', ctx => {
  // to get all messages by type simply call `ctx.flash()`
  ctx.body = ctx.flash('info');
  // outputs: [ 'hello world ']
});

app.keys = [ 'keys' ];
app.use(session());
app.use(flash());
app.use(router.routes());
app.listen();
```


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/
