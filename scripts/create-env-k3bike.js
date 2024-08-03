const fs = require('fs')

fs.writeFileSync('./.env', `
API_ENDPOINT=${process.env.API_ENDPOINT || 'pos.k3bike.com'}
API_ENDPOINT_ALT=${process.env.API_ENDPOINT || 'pos.k3bike.com'}
API_CONSIGNMENT_ENDPOINT=${process.env.API_CONSIGNMENT_ENDPOINT || 'consignment-api.k3bike.com'}
MAIN_WEBSITE=${process.env.MAIN_WEBSITE || 'k3bike.com'}
APP_NAME=${process.env.APP_NAME || 'k3bike'}
`)
