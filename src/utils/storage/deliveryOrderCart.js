import { deliveryOrderCartDB } from './pouchdb'

const defaultLocalDeliveryOrder = {
  type: 'deliveryOrderCart',
  collapsedSections: []
}

function saveLocal ({ transNo, ...deliveryOrder }) {
  return deliveryOrderCartDB()
    .get(transNo)
    .then(doc => doc, () => ({ _id: transNo, ...defaultLocalDeliveryOrder }))
    .then(doc => deliveryOrderCartDB().put({ ...doc, _id: transNo, ...deliveryOrder }))
}

function load ({ transNo }) {
  return deliveryOrderCartDB()
    .get(transNo)
    .then(local => local, () => defaultLocalDeliveryOrder)
}

export default {
  load,
  saveLocal
}
