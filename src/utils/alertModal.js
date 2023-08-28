import { Modal } from 'antd'
import moment from 'moment'
import styles from './styles.less'
import variables from './variables'
// import { prefix } from './config.main'

const { getSetting } = variables
// const { getPermission } = variables

const stockMinusAlert = (message) => {
  const content = []
  for (let key in message.data[0]) {
    if ({}.hasOwnProperty.call(message.data[0], key)) {
      if (key === 'productId' || key === 'productCode' || key === 'productName' || key === 'count') {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>:  {String(message.data[0][key])}</div>
          </div>
        )
      }
    }
  }

  return (
    Modal.warning({
      title: message.message,
      content: (
        <div className={styles.content}>
          {message.detail}
          {content}
        </div>
      )
    })
  )
}

const checkPermissionDayBeforeTransaction = (transDate) => {
  const restrictDate = moment.utc().subtract(1, 'days')
  if (moment(transDate, 'YYYY-MM-DD').isBefore(restrictDate)) {
    Modal.warning({
      title: 'This transaction is restricted to add or edit',
      content: 'Use adjustment instead'
    })
    return true
  }
  return false
}

const checkPermissionMonthTransaction = (transDate) => {
  const Inventory = getSetting('Inventory')
  let permissionValue = true
  // const permissionValue = getPermission('post_month_transaction')
  if (Inventory) {
    const jsonParse = JSON.parse(Inventory)
    permissionValue = jsonParse.posOrder ? jsonParse.posOrder.post_month_transaction : true
  }

  if (!permissionValue && transDate < moment().startOf('month').format('YYYY-MM-DD')) {
    Modal.warning({
      title: 'This transaction is restricted to add or edit',
      content: 'Use adjustment instead'
    })
    return true
  }
  return false
}

const checkPermissionEditQtyPos = () => {
  const Inventory = getSetting('Inventory')
  let permissionValue = true
  // const permissionValue = getPermission('post_month_transaction')
  if (Inventory) {
    const jsonParse = JSON.parse(Inventory)
    permissionValue = jsonParse.posOrder ? jsonParse.posOrder.disable_qty_pos_edit : true
  }
  return Boolean(permissionValue)
}

const checkPermissionEditPricePos = () => {
  const Inventory = getSetting('Inventory')
  let permissionValue = true
  // const permissionValue = getPermission('post_month_transaction')
  if (Inventory) {
    const jsonParse = JSON.parse(Inventory)
    permissionValue = jsonParse.posOrder ? jsonParse.posOrder.disable_price_pos_edit : true
  }
  return Boolean(permissionValue)
}

module.exports = {
  stockMinusAlert,
  checkPermissionMonthTransaction,
  checkPermissionEditQtyPos,
  checkPermissionEditPricePos,
  checkPermissionDayBeforeTransaction
}
