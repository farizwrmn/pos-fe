import PouchDB from 'pouchdb'

const instancePool = {}

function instance (name) {
  if (instancePool[name] === undefined) {
    instancePool[name] = new PouchDB(name, { auto_compaction: true })
  }

  return instancePool[name]
}

function destroyInstance (name) {
  if (instancePool[name] !== undefined) {
    const instance = instancePool[name]
    delete instancePool[name]
    delete instancePool[`remote_${name}`]

    return instance.destroy()
  }
}

export const deliveryOrderDB = () => instance('deliveryOrder')
export const destroyDeliveryOrderDB = () => destroyInstance('deliveryOrder')
