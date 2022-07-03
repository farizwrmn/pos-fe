const fs = require('fs')

fs.writeFileSync('./.env', `
API_ENDPOINT=${process.env.API_ENDPOINT || 'pos.k3bike.com'}
API_CONSIGNMENT_ENDPOINT=${process.env.API_CONSIGNMENT_ENDPOINT || 'consignment-api.k3bike.com'}
MAIN_WEBSITE=${process.env.MAIN_WEBSITE || 'k3bike.com'}
CLOUDANT_NAME=${process.env.CLOUDANT_NAME || 'k3bike'}
APP_NAME=${process.env.APP_NAME || 'k3bike'}
CLOUDANT_URL=${process.env.CLOUDANT_URL || 'http://k3bike:password@localhost:5984/k3bike'}
`)
