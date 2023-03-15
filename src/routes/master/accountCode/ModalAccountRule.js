import React from 'react'
import { Modal, Button, Spin } from 'antd'

const ModalAccountRule = ({ onEdit, onCancel, onEditRole, loading, ...modalProps }) => {
  return (
    <Modal
      {...modalProps}
      onCancel={onCancel}
      footer={[
        (<Button id="buttonCancel" type="default" onClick={onCancel} disabled={loading.effects['payment/create']}>Cancel</Button>),
        (<Button id="buttonEdit" type="default" style={{ float: 'left' }} onClick={onEdit} disabled={loading.effects['payment/create']}>Edit Account</Button>),
        (<Button id="button" type="primary" onClick={onEditRole} disabled={loading.effects['payment/create']}>Submit Role</Button>)
      ]}
    >
      {loading.effects['accountRule/queryId'] || loading.effects['accountRule/edit'] ? <Spin /> : (
        <div>Modal</div>
      )}
    </Modal>
  )
}

export default ModalAccountRule
