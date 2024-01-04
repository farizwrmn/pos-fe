import { deliveryOrderDB, destroyDeliveryOrderDB } from './pouchdb'

const defaultLocalDeliveryOrder = {
  type: 'deliveryOrder',
  collapsedSections: []
}
const defaultDeliveryOrder = {
  type: 'deliveryOrder'
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
  console.log('deliveryOrder', deliveryOrder)
  return deliveryOrderDB()
    .get(deliveryOrder.transNo)
    .then(doc => doc, () => ({ _id: deliveryOrder.transNo, ...defaultLocalDeliveryOrder }))
    .then(doc => deliveryOrderDB().put({ ...doc, _id: deliveryOrder.transNo, ...deliveryOrder }))
}

function load ({ transNo }) {
  return deliveryOrderDB()
    .get(transNo)
    .then(local => local, () => defaultLocalDeliveryOrder)
}

function loadAll () {
  return deliveryOrderDB()
    .allDocs({
      include_docs: true,
      conflicts: true
    })
    .then(response => response.rows.map(row => row.doc))
}


export default {
  loadAll,
  load,
  save,
  saveLocal,
  destroy
}
