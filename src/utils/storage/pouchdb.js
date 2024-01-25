import PouchDB from 'pouchdb'

const instancePool = {}

function instance (name) {
  if (instancePool[name] === undefined) {
    instancePool[name] = new PouchDB(name, { auto_compaction: true })
  }

  return instancePool[name]
}

export const deliveryOrderDB = () => instance('deliveryOrder')
export const deliveryOrderCartDB = () => instance('deliveryOrderCart')
