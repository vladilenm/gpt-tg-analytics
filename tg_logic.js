const { TelegramClient } = require('telegram')
const { NewMessage } = require('telegram/events')
const { session, apiId, apiHash } = require('./config')

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
    console.log(`Непрочитанные сообщения в канале "${channel.name}":`)
    return messages.map((m) => m.message).join(' ')
  } else {
    console.log('Канал не найден')
  }
}

;(async function run() {
  const channel = 'whale_alert_io' // for_demo_api

  watchNewMessages(channel)

  await client.connect()

  const messagesString = await getUnreadMessages(channel, 10)
  console.log(messagesString)
})()

// export NODE_TLS_REJECT_UNAUTHORIZED='0'
