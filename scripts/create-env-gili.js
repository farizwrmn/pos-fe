const fs = require('fs')

fs.writeFileSync('./.env', `
API_ENDPOINT=${process.env.API_ENDPOINT || 'gili.k3mart.id'}
API_ENDPOINT_ALT=${process.env.API_ENDPOINT || 'gili.k3mart.id'}
API_CONSIGNMENT_ENDPOINT=${process.env.API_CONSIGNMENT_ENDPOINT || 'training-consignment-api.k3mart.id'}
MAIN_WEBSITE=${process.env.MAIN_WEBSITE || 'gili.k3mart.id'}
APP_NAME=${process.env.APP_NAME || 'k3mart'}
API_ELECTRON_ENDPOINT=${process.env.API_ELECTRON_ENDPOINT || 'http://localhost:3300'}
`)
