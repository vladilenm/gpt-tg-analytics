const { StringSession } = require('telegram/sessions')

const session = new StringSession(process.env.TG_SESSION)
const apiId = process.env.API_ID
const apiHash = process.env.API_HASH
const gigaClientId = process.env.CLIENT_ID
const gigaClientSecret = process.env.CLIENT_SECRET
const gigaAuth = process.env.GIGA_AUTH
const gigaScope = 'GIGACHAT_API_PERS'
const botToken = process.env.TG_BOT_KEY

module.exports = {
  session,
  apiHash,
  apiId,
  botToken,
  gigaClientId,
  gigaClientSecret,
  gigaAuth,
  gigaScope,
}
