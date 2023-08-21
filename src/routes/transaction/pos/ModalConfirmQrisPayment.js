import { Button, Modal } from 'antd'
import { currencyFormatter } from 'utils/string'

const ModalConfirmQrisPayment = ({ loading, paymentValue, onOk, onCancel, ...modalProps }) => {
  return (
    <Modal
      {...modalProps}
      footer={[
        <Button type="ghost" onClick={onCancel} disabled={loading.effects['payment/createDynamicQrisPayment']} loading={loading.effects['payment/createDynamicQrisPayment']}>Close</Button>,
        <Button type="primary" onClick={onOk} disabled={loading.effects['payment/createDynamicQrisPayment']} loading={loading.effects['payment/createDynamicQrisPayment']}>Payment</Button>
      ]}
    >
      {`Confirm payment with total amount ${currencyFormatter(paymentValue)}`}
    </Modal>
  )
}

export default ModalConfirmQrisPayment
