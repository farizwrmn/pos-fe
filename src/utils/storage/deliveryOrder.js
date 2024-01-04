import { deliveryOrderDB, destroyDeliveryOrderDB } from './pouchdb'

const defaultLocalDeliveryOrder = {
  _id: '_local/deliveryOrder',
  collapsedSections: []
}
const defaultDeliveryOrder = {
  _id: 'deliveryOrder'
}

function destroy () {
  return destroyDeliveryOrderDB()
}

async function save (deliveryOrder) {
  return deliveryOrderDB()
    .get('deliveryOrder')
    .then(local => local, () => defaultDeliveryOrder)
    .then(doc => deliveryOrderDB().put({ ...doc, ...deliveryOrder }))
}

function saveLocal (deliveryOrder) {
  return deliveryOrderDB()
    .get('_local/deliveryOrder')
    .then(doc => doc, () => defaultLocalDeliveryOrder)
    .then(doc => deliveryOrderDB().put({ ...doc, ...deliveryOrder }))
}

async function mergeLocalWithSyncedDeliveryOrder (local) {
  return deliveryOrderDB()
    .get('deliveryOrder')
    .then(deliveryOrder => deliveryOrder, () => defaultDeliveryOrder)
    .then(deliveryOrder => ({ ...deliveryOrder, ...local }))
}

function load () {
  return deliveryOrderDB()
    .get('_local/deliveryOrder')
    .then(local => local, () => defaultLocalDeliveryOrder)
    .then(local => mergeLocalWithSyncedDeliveryOrder(local))
}


export default {
  load,
  save,
  saveLocal,
  destroy
}
