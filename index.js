const { format, isArray } = require('util');

module.exports = function() {
  return function(ctx, next) {
    if (ctx.flash) return next();
    ctx.flash = flash.bind(ctx);
    return next();
  };
};

function flash(type, msg) {
  if (typeof this.session !== 'object')
    throw new Error('ctx.flash() requires sessions');
  this.session.flash = this.session.flash || {};
  const msgs = this.session.flash;
  if (type && msg) {
    if (arguments.length > 2) {
      const args = Array.prototype.slice.call(arguments, 1);
      msg = format.apply(undefined, args);
    } else if (isArray(msg)) {
      msg.forEach(val => {
        msgs[type] = msgs[type] || [];
        msgs[type].push(val);
      });
      return msgs[type];
    }
    msgs[type] = msgs[type] || [];
    msgs[type].push(msg);
    return msgs[type];
  } else if (type) {
    const arr = msgs[type];
    delete msgs[type];
    return arr || [];
  }
  this.session.flash = {};
  return msgs;
}
