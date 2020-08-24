import { Modal } from 'antd'
import moment from 'moment'
import styles from './styles.less'
import variables from './variables'
// import configMain from './config.main'

// const { prefix } = configMain

const { getSetting } = variables
// const { getPermission } = variables

const stockMinusAlert = (data) => {
  const content = []
  for (let key in data.data[0]) {
    if ({}.hasOwnProperty.call(data.data[0], key)) {
      if (key === 'productId' || key === 'productCode' || key === 'productName' || key === 'count') {
        content.push(
          <div key={key} className={styles.item}>
            <div>{key}</div>
            <div>:  {String(data.data[0][key])}</div>
          </div>
        )
      }
    }
  }

  return (
    Modal.warning({
      title: data.message,
      content: (
        <div className={styles.content}>
          {data.detail}
          {content}
        </div>
      )
    })
  )
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

module.exports = {
  stockMinusAlert,
  checkPermissionMonthTransaction,
  checkPermissionEditQtyPos
}
