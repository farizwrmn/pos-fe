import { Modal } from 'antd'
import styles from './styles.less'

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
module.exports = {
  stockMinusAlert
}
