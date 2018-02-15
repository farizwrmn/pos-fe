import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row,
  Modal
} from 'antd'
import List from './ListDetail'

const formPayment = ({
  dataSource,
  item = {},
  onEdit,
  onSubmit,
  modalType,
  form: {
    // getFieldDecorator,
    getFieldsValue,
    validateFields,
    resetFields
  }
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      if (modalType === 'add') {
        Modal.confirm({
          title: 'Accept this payment ?',
          onOk () {
            onSubmit(data)
            resetFields()
          },
          onCancel () { }
        })
      } else {
        data.id = item.id
        Modal.confirm({
          title: 'Change this payment ?',
          onOk () {
            onEdit(data)
            resetFields()
          },
          onCancel () { }
        })
      }
    })
  }

  const listProps = {
    dataSource,
    editList () {
      // editItem(data)
      resetFields()
    }
  }


  let isCtrl = false
  const perfect = () => {
    handleSubmit()
  }
  document.onkeyup = function (e) {
    if (e.which === 17) isCtrl = false
  }
  document.onkeydown = function (e) {
    if (e.which === 17) isCtrl = true
    if (e.which === 66 && isCtrl === true) { // ctrl + b
      perfect()
      return false
    }
  }

  return (
    <Form layout="horizontal">
      <Row>
        <List {...listProps} />
      </Row>
    </Form>
  )
}

formPayment.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(formPayment)
