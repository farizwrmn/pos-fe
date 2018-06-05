import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, Button, Row, Col, Select } from 'antd'
import ListItem from './ListItem'
// import ModalConfirm from './ModalConfirm'
import Product from './ModalProduct'

const { Option } = Select
const FormItem = Form.Item
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 9
  }
}

const col = {
  lg: {
    span: 12,
    offset: 0
  }
}

const FormAdd = ({
  item = {},
  onSubmit,
  modalProductVisible,
  listItem,
  listEmployee,
  getEmployee,
  hideEmployee,
  disableSave,
  ...listProps,
  // modalConfirmVisible,
  modalProductProps,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const { handleProductBrowse, handleModalEdit, selectedRowKeys } = modalProductProps
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.employeeId
      Modal.confirm({
        title: 'Submit and save data',
        content: 'This action cannot be undone',
        onOk () {
          onSubmit(getFieldsValue(), data, listItem)
          resetFields()
        }
      })
    })
  }
  // const formConfirmOpts = {
  //   listItem,
  //   itemHeader: {
  //     storeId: {
  //       label: lstorage.getCurrentUserStoreName()
  //     },
  //     ...getFieldsValue()
  //   },
  //   ...formConfirmProps
  // }
  const childrenEmployee = (listEmployee || []).length > 0 ? listEmployee.map(list => <Option value={list.id}>{list.employeeName}</Option>) : []
  const modalProductOpts = {
    isModal: false,
    modalProductProps,
    modalProductVisible,
    ...modalProductProps
  }

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...col}>
            <FormItem label="No. Transfer" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transNo', {
                initialValue: item.transNo,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input disabled maxLength={20} />)}
            </FormItem>
            <FormItem label="PIC" hasFeedback {...formItemLayout}>
              {getFieldDecorator('employeeId', {
                initialValue: item.employeeId,
                valuePropName: 'value',
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select allowClear onFocus={getEmployee} onBlur={hideEmployee} >{childrenEmployee}</Select>)}
            </FormItem>
          </Col>
          <Col {...col}>
            <FormItem label="Description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: false
                  }
                ]
              })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 3 }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Button type="dashed" size="large" icon="edit" className="bgcolor-lightgrey" style={{ marginRight: '8px' }} onClick={handleModalEdit}>Edit</Button>
          <Button type="primary" size="large" icon="barcode" style={{ marginRight: '8px' }} onClick={handleProductBrowse}>Product</Button>
          <Button size="large" type="primary" icon="save" disabled={!((listItem || []).length > 0) || disableSave} onClick={handleSubmit} style={{ float: 'right' }}>Save</Button>
        </Row>
        {(selectedRowKeys || []).length === 1 && <text>{(selectedRowKeys || []).length} item selected</text>}
        {(selectedRowKeys || []).length > 1 && <text>{(selectedRowKeys || []).length} items selected</text>}
        <ListItem {...listProps} style={{ marginTop: '10px' }} />
        {modalProductVisible && <Product {...modalProductOpts} />}
        {/* {modalConfirmVisible && <ModalConfirm {...formConfirmOpts} />} */}
      </Form>
    </div>
  )
}

FormAdd.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  resetItem: PropTypes.func,
  // changeTab: PropTypes.func,
  // activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(FormAdd)
