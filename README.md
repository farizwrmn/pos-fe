{"success":true,"user":{"permissions":{"role":"admin"},"username":"admin","id":0}}
{"success":true,"user":{"permissions":{"visit":["1","2","21","7","5","51","52","53"],"role":"guest"},"username":"guest","id":1}}
{"success":true,"user":{"permissions":{"role":"developer"},"username":"吴彦祖","id":2}}

{"success":true,"user":{"permissions":{"role":"MGR"},"username":"member02","userid":"000002"}}
{"success":true,"user":{"permissions":{"visit":["1","2","21","7","5","51","52","53"],"role":"guest"},"username":"member01","userid":"000001"}}


import { request, config, crypt } from '../utils'
const apiHeaderToken = crypt.apiheader()
headers: apiHeaderToken
