const { TelegramClient } = require('telegram')
const { Telegraf } = require('telegraf')
const { NewMessage } = require('telegram/events')
const { session, apiId, apiHash, botToken } = require('./config')
const { giga } = require('./giga')

const bot = new Telegraf(botToken)

bot.command('watch', (ctx) => {
  const channelId = ctx.message.text.split(' ')[1]
  ctx.reply(`Channel ID: ${channelId}`)
})

const client = new TelegramClient(session, apiId, apiHash, {})

function watchNewMessages(channelId) {
  client.addEventHandler((event) => {
    console.log('new message', event.message.message)
  }, new NewMessage({ fromUsers: [channelId] }))
}

async function getUnreadMessages(channelId, limit = 10) {
  const dialogs = await client.getDialogs({})
  const channel = dialogs.find((d) => d.entity.username === channelId)
  if (channel) {
    const messages = await client.getMessages(channel.entity, {
      // limit: channel.unreadCount,
      limit,
    })
    return messages.map((m) => m.message).join(' ')
  } else {
    console.log('Канал не найден')
  }
}

;(async function run() {
  // const channel = 'whale_alert_io' // for_demo_api

  // watchNewMessages(channel)

  await client.connect()

  bot.command('sum', async (ctx) => {
    const [, channelId, ...task] = ctx.message.text.split(' ')
    if (!channelId) {
      return ctx.reply(`Вы не указали канал`)
    }

    const messagesString = await getUnreadMessages(channelId, 10)
    const gigaResponse = await giga(messagesString, task.join(' '))
    await ctx.reply(gigaResponse)
  })

  bot.launch()
})()
