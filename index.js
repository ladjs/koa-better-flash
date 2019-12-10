const { format } = require('util');

module.exports = function() {
  return function(ctx, next) {
    if (ctx.flash) return next();
    ctx.flash = flash.bind(ctx);
    return next();
  };
};

function flash(type, msg, ...args) {
  if (typeof this.session !== 'object')
    throw new Error('ctx.flash() requires sessions');
  this.session.flash = this.session.flash || {};
  const msgs = this.session.flash;
  if (type && msg) {
    if (args.length > 0) {
      msg = format(...[msg, ...args]);
    } else if (Array.isArray(msg)) {
      for (const element of msg) {
        msgs[type] = msgs[type] || [];
        msgs[type].push(element);
      }

      return [...new Set(msgs[type])];
    }

    msgs[type] = msgs[type] || [];
    msgs[type].push(msg);
    return [...new Set(msgs[type])];
  }

  if (type) {
    const arr = msgs[type];
    delete msgs[type];
    return [...new Set(arr)] || [];
  }

  this.session.flash = {};
  return msgs;
}
