import { deliveryOrderDB } from './pouchdb'

const defaultLocalDeliveryOrder = {
  type: 'deliveryOrder',
  collapsedSections: []
}

function saveLocal (deliveryOrder) {
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

export default {
  load,
  saveLocal
}
