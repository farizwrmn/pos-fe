import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Button,
  Row,
  Modal
} from 'antd'
import List from './List'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: {
      span: 13
    },
    sm: {
      span: 8
    },
    md: {
      span: 7
    }
  },
  wrapperCol: {
    xs: {
      span: 11
    },
    sm: {
      span: 14
    },
    md: {
      span: 14
    }
  }
}

const formPayment = ({
  item = {},
  listAmount,
  curPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.paid), 0),
  data,
  onSubmit,
  onEdit,
  cancelPayment,
  editItem,
  modalType,
  openModal,
  form: {
    validateFields,
    getFieldsValue,
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
        data.id = listAmount.length + 1
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
    dataSource: listAmount,
    cancelPayment,
    editList (data) {
      editItem(data)
      resetFields()
    }
  }

  const showModal = (e) => {
    openModal(e)
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
        <FormItem style={{ margin: '5px 10px', float: 'right' }} {...formItemLayout}>
          <Button onClick={() => showModal('modalVisible')} disabled={curPayment >= (data.length > 0 ? data[0].nettoTotal : 0)}>Add</Button>
        </FormItem>
      </Row>
      <List {...listProps} />
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
