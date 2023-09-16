import { Button, Modal } from 'antd'
import ListDetail from './ListDetail'

const ModalDetail = ({
  loading,
  currentItem,
  onCancel,
  onApprove,
  ...modalProps
}) => {
  const listDetailProps = {
    dataSource: currentItem.detail
  }

  return (
    <Modal
      {...modalProps}
      title="Transaction Detail"
      closable={false}
      maskClosable={false}
      footer={[
        <Button
          type="ghost"
          onClick={onCancel}
          loading={loading.effects['requestCancelPos/approve']}
        >
          Cancel
        </Button>,
        <Button
          type="primary"
          icon="check"
          onClick={() => onApprove(currentItem)}
          loading={loading.effects['requestCancelPos/approve']}
        >
          Approve
        </Button>
      ]}
      width="70%"
      style={{ minWidth: '400px' }}
    >
      <ListDetail {...listDetailProps} />
    </Modal>
  )
}

export default ModalDetail
