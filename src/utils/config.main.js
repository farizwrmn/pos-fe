import { listVersion } from './version'
import { setVersionInfo, getVersionInfoCache } from './lstorage'

export const VERSION = '2022.02.001'

export const getVersionInfo = (version) => {
  if (listVersion && listVersion.length > 0) {
    for (let key in listVersion) {
      const item = listVersion[key]
      if (item.version === version) {
        setVersionInfo(item.info)
        return item.info
      }
    }
    if (listVersion[0] && listVersion[0].info) {
      setVersionInfo(listVersion[0].info)
      return listVersion[0].info
    }
  }
}

const configMain = {
  name: 'www.k3mart.id',
  version: VERSION,
  versionInfo: getVersionInfoCache(),
  prefix: 'smiPos',
  footerText: 'K3MART',
  footerSubText: 'K3MART © 2022',
  openPages: [
    '/login',
    '/nps/01',
    '/nps/02',
    '/nps/03',
    '/transaction/pos/customer-view',
    '/transaction/pos/admin-invoice/:id',
    '/transaction/pos/invoice/:id',
    '/balance/invoice/:id'
  ],
  disableMultiSelect: true
}

export default configMain
