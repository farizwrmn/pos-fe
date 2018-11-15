import { Modal } from 'antd'
import moment from 'moment'
import styles from './styles.less'
import variables from './variables'

const { getPermission } = variables

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
  const permissionValue = getPermission('post_month_transaction')
  if (!permissionValue && transDate < moment().startOf('month').format('YYYY-MM-DD')) {
    Modal.warning({
      title: 'This transaction is restricted to add or edit',
      content: 'Use adjustment instead'
    })
    return true
  }
  return false
}

module.exports = {
  stockMinusAlert,
  checkPermissionMonthTransaction
}
