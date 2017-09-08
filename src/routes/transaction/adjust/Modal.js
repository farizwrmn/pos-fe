import React from 'react'
import PropTypes from 'prop-types'
import {Form, Modal} from 'antd'

const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 10},
}

const modal = ({
                 modalButtonSaveClick,
                 form: {getFieldDecorator, validateFields, getFieldsValue},
                 ...modalProps
               }) => {

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      data.customerRole = data.customerRole.join(' ')
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const hdlButtonSaveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      modalButtonSaveClick(data.memberCode, data)
    })
  }


  return (
    <Modal {...modalOpts} width='40%' height="60%" footer={[]}>
      {/* (modalType == 'modalPayment') && <PaymentList {...listProps}/> */}
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  loading: PropTypes.func,
}

export default Form.create()(modal)
