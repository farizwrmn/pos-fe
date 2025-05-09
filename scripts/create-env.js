const fs = require('fs')

fs.writeFileSync('./.env', `
API_ENDPOINT=${process.env.API_ENDPOINT || 'pos.k3mart.id'}
API_ENDPOINT_ALT=${process.env.API_ENDPOINT || 'api-pos.k3mart.id'}
API_CONSIGNMENT_ENDPOINT=${process.env.API_CONSIGNMENT_ENDPOINT || 'consignment-api.k3mart.id'}
MAIN_WEBSITE=${process.env.MAIN_WEBSITE || 'k3mart.id'}
APP_NAME=${process.env.APP_NAME || 'k3mart'}
API_ELECTRON_ENDPOINT=${process.env.API_ELECTRON_ENDPOINT || 'localhost'}
`)

