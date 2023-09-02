import { Button, Modal, Form } from 'antd'
import FormResolve from './FormResolve'

const ModalResolve = ({ listAccountCodeLov, onCancel, form, ...modalProps }) => {
  const formResolveProps = {
    listAccountCodeLov,
    form
  }

  return (
    <Modal
      {...modalProps}
      maskClosable={false}
      closable={false}
      width="40%"
      style={{ minWidth: '400px' }}
      footer={[
        <Button type="ghost" onClick={onCancel}>Cancel</Button>,
        <Button type="primary">Resolve</Button>
      ]}
    >
      <FormResolve {...formResolveProps} />
    </Modal>
  )
}

export default Form.create()(ModalResolve)
