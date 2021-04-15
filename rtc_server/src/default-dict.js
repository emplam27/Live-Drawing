// module.exports = class defaultDict {
//   constructor(defaultInit) {
//     return new Proxy(
//       {},
//       {
//         get: (target, name) =>
//           name in target
//             ? target[name]
//             : (target[name] =
//                 typeof defaultInit === 'function'
//                   ? new defaultInit().valueOf()
//                   : defaultInit),
//       }
//     )
//   }
// }

module.exports = function defaultDict() {
  let dict = {}
  return {
    push: function (roomId, message) {
      if (!dict[roomId]) {
        dict[roomId] = []
      }
      dict[roomId].push(message)
    },
    dict: dict,
  }
}
