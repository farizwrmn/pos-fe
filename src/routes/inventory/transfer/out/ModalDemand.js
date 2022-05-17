import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button } from 'antd'

const modal = ({
  onOk,
  data,
  form: { validateFields, getFieldsValue, resetFields },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) return
      const record = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: `Void ${data.transNo}'s payment`,
        content: 'Are you sure ?',
        onOk () {
          onOk(record)
        }
      })
      resetFields()
    })
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk
  }
  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="submit" onClick={() => handleOk()} type="primary" >Process</Button>
      ]}
    >
      Total
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  onOk: PropTypes.func,
  invoiceCancel: PropTypes.object
}

export default Form.create()(modal)
