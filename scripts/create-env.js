const fs = require('fs')

fs.writeFileSync('./.env', `
API_ENDPOINT=${process.env.API_ENDPOINT || 'localhost'}
CLOUDANT_NAME=${process.env.CLOUDANT_NAME || 'localhost'}
APP_NAME=${process.env.APP_NAME || 'k3mart'}
CLOUDANT_URL=${process.env.CLOUDANT_URL || 'localhost'}
`)
