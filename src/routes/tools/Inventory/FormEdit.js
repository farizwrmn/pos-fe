import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Input, Form, Row, Col, DatePicker, message } from 'antd'
import ModalBrowse from './ModalBrowse'
import ListInvoiceDetail from './ListInvoiceDetail'

const { MonthPicker } = DatePicker

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 10 },
  style: {
    marginBottom: '5px',
    marginTop: '5px'
  }
}

const FormEdit = ({
  onOk,
  listProduct,
  loading,
  item,
  listHeader,
  listChangeTransferOut,
  listChangeTransferIn,
  changeModal,
  modalType,
  onChangePeriod,
  setFormItem,
  setItem,
  onShowModal,
  onHideModal,
  optionPos,
  period,
  year,
  modalVisible,
  form: { getFieldDecorator, validateFields, getFieldValue, getFieldsValue, setFieldsValue },
  ...formEditProps
}) => {
  const setItemForForm = (e) => {
    setFieldsValue({
      ...e
    })
    // setItem()
  }
  const modalProps = {
    visible: modalVisible,
    listProduct,
    listHeader,
    loading,
    onHideModal,
    modalType,
    setItemForForm,
    width: '1000px',
    ...formEditProps,
    wrapClassName: 'vertical-center-modal',
    onChange (e) {
      changeModal(e)
    },
    onCancel () {
      onHideModal()
    }
  }
  const listInvoiceDetailProps = {
    dataSource: listHeader,
    loading: loading.effects['transferOut/queryHeader']
  }
  const listChangeTransferOutProps = {
    dataSource: listChangeTransferOut,
    loading: loading.effects['transferOut/queryChangeHpokokTransferOut']
  }
  const listChangeTransferInProps = {
    dataSource: listChangeTransferIn,
    loading: loading.effects['transferOut/queryChangeHpokokTransferIn']
  }
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Warning',
        content: 'Action cannot be undone',
        onOk () {
          onOk(data)
        },
        onCancel () {
          console.log('cancel')
        }
      })
    })
  }
  const resetTransfer = () => {
    setFieldsValue({
      transferOutId: null,
      transNo: null
    })
  }
  const resetProduct = () => {
    setFieldsValue({
      productId: null,
      productName: null
    })
  }

  const handleShowModal = (e) => {
    const productId = !!getFieldValue('productId')
    const period = !!getFieldValue('productId')
    if ((e === 'transfer' && !productId) || (e === 'transfer' && !period)) {
      message.warning('Choose product and period')
      return
    }
    if (e === 'product') {
      resetTransfer()
    }
    const data = getFieldsValue()
    onShowModal(e, data)
  }

  const changeMonthPicker = () => {
    resetTransfer()
    resetProduct()
  }

  return (
    <Form {...formEditProps}>
      <Row>
        <Col md={12}>
          <FormItem label="Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('period', {
              rules: [
                {
                  required: true
                }
              ]
            })(<MonthPicker onChange={() => changeMonthPicker()} style={{ width: '189px' }} placeholder="Select Period" />)}
          </FormItem>
          <FormItem label="Product" hasFeedback {...formItemLayout}>
            <Row>
              <Col span={12}>
                {getFieldDecorator('productId', {
                  initialValue: item.productId,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<Input style={{ width: '100%' }} disabled />)}
              </Col>
              <Col span={8}>
                {getFieldDecorator('productName', {
                  initialValue: item.productName,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<Input style={{ width: '100%' }} disabled />)}
              </Col>
              <Col span={4}>
                <Button type="dashed" className="bgcolor-green" icon="edit" onClick={() => handleShowModal('product')} style={{ width: '100%', height: '32px' }} />
              </Col>
            </Row>
          </FormItem>
          <FormItem label="Transfer Out" hasFeedback {...formItemLayout}>
            <Row>
              <Col span={12}>
                {getFieldDecorator('transferOutId', {
                  initialValue: item.id,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<Input style={{ width: '100%' }} disabled />)}
              </Col>
              <Col span={8}>
                {getFieldDecorator('transNo', {
                  initialValue: item.transNo,
                  rules: [{
                    required: true,
                    message: 'Required'
                  }]
                })(<Input style={{ width: '100%' }} disabled />)}
              </Col>
              <Col span={4}>
                <Button type="dashed" className="bgcolor-green" icon="edit" onClick={() => handleShowModal('transfer')} style={{ width: '100%', height: '32px' }} />
              </Col>
            </Row>
          </FormItem>
        </Col>
        <Col md={12}>
          <Row>
            <h1>Current Transfer Out</h1>
            <ListInvoiceDetail {...listInvoiceDetailProps} />
            <h1>Current Transfer In</h1>
            <ListInvoiceDetail {...listChangeTransferInProps} />
            <h1>Update to</h1>
            <ListInvoiceDetail {...listChangeTransferOutProps} />
          </Row>
        </Col>
      </Row>
      {modalVisible && <ModalBrowse {...modalProps} />}
      <Button style={{ float: 'right' }} type="primary" size="large" onClick={() => handleOk()}>Submit</Button>
    </Form >
  )
}

FormEdit.propTypes = {
  form: PropTypes.object,
  onOk: PropTypes.func,
  setFormItem: PropTypes.func,
  onChangePeriod: PropTypes.func,
  onShowModal: PropTypes.func
}

export default Form.create()(FormEdit)
