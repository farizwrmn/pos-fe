const fs = require('fs')

fs.writeFileSync('./.env', `API_ENDPOINT=${process.env.API_ENDPOINT || 'localhost'}`)
