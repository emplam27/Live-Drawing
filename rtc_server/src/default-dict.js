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
    push: function (roomId, userId, message) {
      if (!dict[roomId]) {
        dict[roomId] = {}
      }
      if (!dict[roomId][userId]) {
        dict[roomId][userId] = []
      }
      dict[roomId][userId].push(message)
    },
    dict: dict,
  }
}
