import { Col, Row, Tag } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'
import ModalList from './ModalList'

const LatestQrisTransaction = ({ currentItem, loading, modalVisible, list, latestTransaction, handleClickLatestTransaction }) => {
  const modalListProps = {
    loading,
    visible: modalVisible,
    title: 'Latest Dynamic Qris Transaction',
    list,
    onOk: handleClickLatestTransaction,
    onCancel: handleClickLatestTransaction
  }

  return (
    <Row>
      {
        Boolean(latestTransaction) && (
          <Col span={24}>
            <h1>{currentItem.refrence} {currentItem.seqValue}</h1>
            <Tag
              color="green"
              style={{ width: '100%' }}
              onClick={handleClickLatestTransaction}
            >
              {`Latest Dynamic Qris Transaction | Invoice Number: ${latestTransaction.transNo}; Trans Date: ${moment(latestTransaction.transDate).format('DD MMM YYYY, HH:mm:ss')}; Total Amount: ${currencyFormatter(latestTransaction.amount)}; (click to show more)`}
            </Tag>
          </Col>
        )
      }
      {modalVisible && <ModalList {...modalListProps} />}
    </Row>
  )
}

export default LatestQrisTransaction
