import { Col, Row, Tag } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'
import ModalList from './ModalList'

const LatestQrisTransaction = ({ loading, modalVisible, list, latestTransaction, handleClickLatestTransaction }) => {
  const modalListProps = {
    loading,
    visible: modalVisible,
    title: 'Latest Transaction',
    list,
    onOk: handleClickLatestTransaction,
    onCancel: handleClickLatestTransaction
  }

  return (
    <Row>
      {
        Boolean(latestTransaction) && (
          <Col span={24}>
            <Tag
              color="green"
              onClick={handleClickLatestTransaction}
            >
              Riwayat Transaksi (Klik Disini)
            </Tag>
          </Col>
        )
      }
      {modalVisible && <ModalList {...modalListProps} />}
    </Row>
  )
}

export default LatestQrisTransaction
