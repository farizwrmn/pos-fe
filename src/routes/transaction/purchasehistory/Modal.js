import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const modal = ({
  ...modalProps,
  purchaseHistory
}) => {
  return (
    <Modal {...modalProps}>
      <Form>
        <FormItem label="No" {...formItemLayout}>
          <Input value={purchaseHistory ? purchaseHistory.transNo : ''} />
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  onChooseItem: PropTypes.func,
  enablePopover: PropTypes.func,
  modalIsEmployeeChange: PropTypes.func,
  listPaymentDetail: PropTypes.func,
  listPayment: PropTypes.object,
  memberPrint: PropTypes.object,
  mechanicPrint: PropTypes.object,
  posData: PropTypes.array,
  company: PropTypes.object
}

export default Form.create()(modal)
