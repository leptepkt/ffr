const config = {
  ms: {},
  fb: {},
  app: {}
}

config.app.db = {}
config.app.db.databaseName = 'postgres'  // default
config.app.db.host = 'localhost'
config.app.db.port = '5432'
config.app.db.username = 'postgres'
config.app.db.password = '123456'

config.ms.personGroupId = 'ffr'
config.ms.apiKey = '00a6d9e88d7547439c621af219e95d5f'
config.ms.baseUrl = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0'

config.fb.appId = '2006664906218812'
config.fb.appSecret = 'e5280e896f291d75080943782fd332b7'
config.fb.baseUrl = 'https://graph.facebook.com/v2.11'

module.exports = config