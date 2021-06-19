const fs = require('fs')

fs.writeFileSync('./.env', `
API_ENDPOINT=${process.env.API_ENDPOINT || 'localhost'}
CLOUDANT_NAME=${process.env.CLOUDANT_NAME || 'k3mart'}
APP_NAME=${process.env.APP_NAME || 'k3mart'}
CLOUDANT_URL=${process.env.CLOUDANT_URL || 'http://k3mart:password@localhost:5984/k3mart'}
`)
