const defaultOptions = {
  catch: ['unhandledRejection'],
  send: {
    private: [],
    group: []
  }
}
const handler = (err, send) => send(err)

let installed = false

module.exports.name = 'blame'
module.exports.v1 = {
  name: 'blame-koishi-v1',
  apply(ctx, options){
    if(installed) return
    
    options = { ...defaultOptions, ...options }
    if (!options.send.private) options.send.private = []
    if (!options.send.group) options.send.group = []

    const sendPrivate = (message) =>  options.send.private.map(id => meta.$bot.sendPrivateMsg(id, message.toString()))
    const sendGroup = (message) =>  options.send.group.map(id => meta.$bot.sendGroupMsg(id, message.toString()))

    if (options.catch.includes('unhandledRejection')) process.on('unhandledRejection', (reason, promise) => {
      handler(`${reason}\n${promise}`, sendPrivate)
      handler(`${reason}\n${promise}`, sendGroup)
    })
    if (options.catch.includes('uncaughtException')) process.on('uncaughtException', (err, origin) => {
      handler(`${err}`, sendPrivate)
      handler(`${err}`, sendGroup)
    })
    installed = true
  }
}
module.exports.v2 = {
  name: 'blame-koishi-v2',
  apply(ctx, options){
    if(installed) return

    options = { ...defaultOptions, ...options }
    if (!options.send.private) options.send.private = []
    if (!options.send.group) options.send.group = []

    const bot = ctx.bots.find(bot => bot)

    const sendPrivate = (message) =>  options.send.private.map(id => bot.sendPrivateMsg(id, message.toString()))
    const sendGroup = (message) =>  options.send.group.map(id => bot.sendGroupMsg(id, message.toString()))

    if (options.catch.includes('unhandledRejection')) process.on('unhandledRejection', (reason, promise) => {
      handler(`${reason.stack}`, sendPrivate)
      handler(`${reason.stack}`, sendGroup)
    })
    if (options.catch.includes('uncaughtException')) process.on('uncaughtException', (err, origin) => {
      handler(`${err.stack}`, sendPrivate)
      handler(`${err.stack}`, sendGroup)
    })
    installed = true
  }
}