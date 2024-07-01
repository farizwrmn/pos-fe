import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Input, message, InputNumber, Button, Row, Col, Checkbox, Select } from 'antd'
import { Link } from 'dva/router'
import { lstorage } from 'utils'
import ModalDemand from './ModalDemand'
import ListItem from './ListItem'
import Browse from './Browse'
import ModalConfirm from './ModalConfirm'
import ModalItem from './Modal'
import ModalImportProduct from './ModalImportProduct'

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
  // disabled,
  // resetItem,
  modalProductVisible,
  modalInvoiceVisible,
  formEditProps,
  button,
  loadingButton,
  resetListItem,
  // handleCancel,
  listItem,
  listEmployee,
  listStore,
  getEmployee,
  hideEmployee,
  modalImportProductProps,
  modalProductDemandProps,
  ...listProps,
  // ...filterProps,
  // ...formProps,
  ...formConfirmProps,
  modalConfirmVisible,
  modalProductProps,
  form: {
    resetFields,
    getFieldDecorator,
    validateFields,
    getFieldValue,
    getFieldsValue,
    setFieldsValue
  }
}) => {
  const { pagination, onChange, ...otherListProps } = listProps
  const { handleProductBrowse, handleImportedBrowse, handleInvoiceBrowse, handleProductDemandBrowse, loading } = modalProductProps
  let qtyTotal = listItem.length > 0 ? listItem.reduce((cnt, o) => cnt + parseFloat(o.qty), 0) : 0

  const onClickDemand = () => {
    if (getFieldValue('storeIdReceiver')) {
      handleProductDemandBrowse(getFieldValue('storeIdReceiver'))
    } else {
      message.warning('Choose destination store')
      validateFields(['storeIdReceiver'])
    }
  }

  const onGetAllDemand = () => {
    console.log('onGetAll1')
    if (getFieldValue('storeIdReceiver')) {
      console.log('onGetAll', getFieldValue('storeIdReceiver'))
      modalProductDemandProps.handleGetAll(getFieldValue('storeIdReceiver'))
    } else {
      message.warning('Choose destination store')
      validateFields(['storeIdReceiver'])
    }
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.employeeId = data.employeeId.key
      data.storeId = item.storeId
      data.reference = item.reference
      onSubmit(data, listItem, resetFields)
      // handleReset()
    })
  }
  const formConfirmOpts = {
    listItem,
    itemHeader: formConfirmProps.itemPrint,
    ...formConfirmProps
  }
  const childrenEmployee = listEmployee.length > 0 ? listEmployee.map(list => <Option value={list.id}>{list.employeeName}</Option>) : []

  let childrenStoreReceived = []
  if (listStore.length > 0) {
    if (item.storeId) {
      let groupStore = []
      for (let id = 0; id < listStore.length; id += 1) {
        groupStore.push(
          <Option disabled={item.storeId === listStore[id].value || getFieldValue('storeIdReceiver') === listStore[id].value} value={listStore[id].value}>
            {listStore[id].label}
          </Option>
        )
      }
      childrenStoreReceived.push(groupStore)
    }
  }
  // const resetFieldsOnly = (value) => {
  //   resetFields([value])
  // }
  const modalPurchaseOpts = {
    modalInvoiceVisible,
    ...modalProductProps
  }
  const modalProductOpts = {
    modalProductProps,
    ...modalProductProps
  }

  const onChangeStoreIdReceiver = () => {
    const storeIdReceiver = getFieldValue('storeIdReceiver')
    Modal.confirm({
      title: 'Reset unsaved process',
      content: 'this action will reset your current process',
      onOk () {
        modalProductDemandProps.updateSelectedKey([])
        resetListItem()
      },
      onCancel () {
        setFieldsValue({
          storeIdReceiver
        })
      }
    })
  }

  let defaultRole = (lstorage.getStorageKey('udi')[2] || '')

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
            <FormItem label="Delivery Order" {...formItemLayout}>
              {getFieldDecorator('deliveryOrder', {
                valuePropName: 'checked'
              })(<Checkbox>Delivery Order</Checkbox>)}
            </FormItem>
            <FormItem label="reference" hasFeedback {...formItemLayout}>
              {getFieldDecorator('referenceNo', {
                initialValue: item.referenceNo,
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input disabled />)}
            </FormItem>
            <FormItem label="Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transType', {
                initialValue: 'MUOUT',
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input disabled />)}
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
              })(
                <Select
                  labelInValue
                  onFocus={getEmployee}
                  onBlur={hideEmployee}
                  showSearch
                  allowClear
                  optionFilterProp="children"
                  placeholder="Choose Employee"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                >
                  {childrenEmployee}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col {...col}>
            <FormItem label="To Store" hasFeedback {...formItemLayout}>
              {getFieldDecorator('storeIdReceiver', {
                initialValue: item.storeIdReceiver,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                onChange={value => onChangeStoreIdReceiver(value)}
              >
                {childrenStoreReceived}
              </Select>)}
            </FormItem>
            <FormItem label="Car Number" hasFeedback {...formItemLayout}>
              {getFieldDecorator('carNumber', {
                initialValue: item.carNumber,
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="Total Pack" hasFeedback {...formItemLayout}>
              {getFieldDecorator('totalColly', {
                initialValue: item.totalColly,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<InputNumber min={0} max={qtyTotal} />)}
            </FormItem>
            <FormItem label="Description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 3 }} />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Button type="default" size="large" onClick={() => handleInvoiceBrowse()} style={{ marginRight: '10px' }}>Purchase</Button>
          <Button disabled={loading.effects['transferOut/showModalDemand']} type="default" size="large" onClick={() => onClickDemand()} style={{ marginRight: '10px' }}>Demand</Button>
          <Button type="default" size="large" style={{ marginRight: '10px' }} onClick={handleImportedBrowse}>Excel</Button>
          <Button type="primary" size="large" onClick={handleProductBrowse}>Product</Button>
          {modalProductVisible && <Browse {...modalProductOpts} />}
          {modalInvoiceVisible && <Browse {...modalPurchaseOpts} />}
          <Link target="_blank" to={'/inventory/transfer/out-import'}><Button className="button-add-items-right" style={{ margin: '0px' }} icon="plus" type="default" size="large">Import</Button></Link>
          <Link target="_blank" to={'/inventory/transfer/auto-replenish'}><Button className="button-add-items-right" style={{ margin: '0px 10px' }} type="default" size="large">Auto Replenish</Button></Link>
        </Row>

        <ListItem {...otherListProps} style={{ marginTop: '10px' }} />
        {defaultRole !== 'CSH' && <FormItem>
          <Button disabled={loadingButton.effects['transferOut/add']} size="large" type="primary" onClick={handleSubmit} style={{ marginTop: '8px', float: 'right' }}>{button}</Button>
        </FormItem>}
        {modalProductDemandProps.visible && (
          <ModalDemand
            onGetAll={() => {
              onGetAllDemand()
            }}
            {...modalProductDemandProps}
          />
        )}
        {modalImportProductProps.visible && (<ModalImportProduct {...modalImportProductProps} />)}
        {formEditProps.visible && <ModalItem {...formEditProps} />}
        {modalConfirmVisible && <ModalConfirm {...formConfirmOpts} />}
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
