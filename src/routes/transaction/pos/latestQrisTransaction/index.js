import { Row, Tag } from 'antd'
import ModalList from './ModalList'

const LatestQrisTransaction = ({ loading, modalVisible, list, onOk, onNotValid, onCancel }) => {
  const modalListProps = {
    loading,
    visible: modalVisible,
    title: 'History',
    list,
    onOk,
    onCancel
  }

  return (
    <Row>
      <Tag
        color="green"
        onClick={onOk}
      >
        Riwayat Transaksi (Klik Disini)
      </Tag>
      <Tag
        color="red"
        onClick={onNotValid}
      >
        History Payment
      </Tag>
      {modalVisible && <ModalList {...modalListProps} />}
    </Row>
  )
}

export default LatestQrisTransaction
