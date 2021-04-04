module.exports = class defaultDict {
  constructor(defaultInit) {
    return new Proxy(
      {},
      {
        get: (target, name) =>
          name in target
            ? target[name]
            : (target[name] =
                typeof defaultInit === 'function'
                  ? new defaultInit().valueOf()
                  : defaultInit),
      }
    )
  }
}
