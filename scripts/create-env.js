const fs = require('fs')

fs.writeFileSync('./.env', `
API_ENDPOINT=${process.env.API_ENDPOINT || 'localhost'},
CLOUDANT_URL=${process.env.CLOUDANT_URL || 'https://user:password@localhost:5984/k3mart'}
`)
