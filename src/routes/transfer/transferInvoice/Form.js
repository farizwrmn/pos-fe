import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, DatePicker, Modal, Select, message } from 'antd'
import { lstorage } from 'utils'
import moment from 'moment'
import { FooterToolbar } from 'components'
import ListDetail from './ListDetail'
import ListTransferOut from './ListTransferOut'
import ModalList from './Modal'
import PrintPDFInvoice from './PrintPDFInvoice'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 7 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  showLov,
  onSubmit,
  user,
  storeInfo,
  listLovProps,
  modalShow,
  modalType,
  modalItemType,
  modalShowList,
  listTransGroup,
  listItem,
  modalVisible,
  modalProps,
  listDetailProps,
  loading,
  onCancel,
  listStore,
  button,
  resetListItem,
  loadingEffect,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldValue,
    getFieldsValue,
    resetFields
  }
}) => {
  const { visible, changePeriod } = listLovProps

  const handleChangePeriod = (start, end) => {
    validateFields(['storeIdReceiver'], (errors) => {
      if (errors) {
        return
      }
      const storeIdReceiver = getFieldValue('storeIdReceiver')
      if (storeIdReceiver) {
        changePeriod(storeIdReceiver, start, end)
      }
    })
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.storeId = lstorage.getCurrentUserStore()
      data.storeIdReceiver = data.storeIdReceiver
      data.total = listItem.reduce((cnt, item) => cnt + (parseFloat(item.amount) || 0), 0)
      data.chargeTotal = listItem.reduce((cnt, item) => cnt + (parseFloat(item.amount) * (parseFloat(item.chargePercent) / 100)) + parseFloat(item.chargeNominal) || 0, 0)
      data.netto = listItem.reduce((cnt, item) => cnt + (parseFloat(item.amount) * (1 + (parseFloat(item.chargePercent) / 100))) + parseFloat(item.chargeNominal) || 0, 0)
      data.paymentTotal = listItem.reduce((cnt, item) => cnt + (parseFloat(item.amount) * (1 + (parseFloat(item.chargePercent) / 100))) + parseFloat(item.chargeNominal) || 0, 0)
      data.paid = 0
      const newListItem = listItem.map(item => ({
        ...item,
        transferId: item.id
      }))
      if (newListItem.length > 0) {
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data, newListItem, getFieldsValue(), resetFields)
          },
          onCancel () { }
        })
      } else {
        message.warning('List Item is empty')
      }
    })
  }
  const hdlModalShow = () => {
    validateFields(['storeIdReceiver'], (errors) => {
      if (errors) {
        return
      }
      const storeIdReceiver = getFieldValue('storeIdReceiver')
      if (item && item.storeId) {
        if (storeIdReceiver && storeIdReceiver) {
          modalShow(
            storeIdReceiver,
            moment().startOf('month').format('YYYY-MM-DD'),
            moment().endOf('month').format('YYYY-MM-DD')
          )
        }
        if (parseFloat(item.storeIdReceiver) !== parseFloat(storeIdReceiver)) {
          resetListItem()
        }
      } else {
        message.error('Store ID not found')
      }
    })
  }

  const modalOpts = {
    showLov,
    modalItemType,
    modalType,
    ...modalProps
  }

  const handleModalShowList = (record) => {
    modalShowList(record)
  }

  const listDetailOpts = {
    handleModalShowList,
    listItem,
    ...listDetailProps
  }

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  let childrenStoreReceived = []
  if (listStore.length > 0) {
    if (item.storeId) {
      let groupStore = []
      for (let id = 0; id < listStore.length; id += 1) {
        groupStore.push(
          <Option title={listStore[id].label} disabled={item.storeId === listStore[id].value} value={listStore[id].value}>
            {listStore[id].label}
          </Option>
        )
      }
      childrenStoreReceived.push(groupStore)
    }
  }


  const printProps = {
    // listItem: listProducts,
    // itemPrint: transHeader,
    // itemHeader: transHeader,
    listItem: listTransGroup,
    itemPrint: item,
    itemHeader: item,
    storeInfo,
    user,
    printNo: 1
  }

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...column}>
            <FormItem label="Trans No" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transNo', {
                initialValue: item.transNo,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input disabled maxLength={30} />)}
            </FormItem>
            <FormItem label="To Store" hasFeedback {...formItemLayout}>
              {getFieldDecorator('storeIdReceiver', {
                initialValue: item.storeIdReceiver,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                disabled={modalType === 'edit'}
              >
                {childrenStoreReceived}
              </Select>)}
            </FormItem>
            <FormItem label="Trans Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transDate', {
                initialValue: item.transDate ? moment(item.transDate) : moment(),
                rules: [
                  {
                    required: true
                  }
                ]
              })(<DatePicker />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...column}>
            {modalType === 'edit' && <PrintPDFInvoice {...printProps} />}
            <Button
              loading={loadingEffect['transferInvoice/addItem']
                || loadingEffect['transferInvoice/addItemNormal']
                || loadingEffect['transferInvoice/groupListItem']}
              disabled={modalType === 'edit' || loadingEffect['transferInvoice/addItem']
                || loadingEffect['transferInvoice/addItemNormal']
                || loadingEffect['transferInvoice/groupListItem']}
              type="primary"
              size="large"
              onClick={() => hdlModalShow()}
              style={{ marginBottom: '8px' }}
            >Transfer Out</Button>
          </Col>
          <Col {...column} />
        </Row>
        <Row style={{ marginBottom: '8px' }}>
          <ListDetail {...listDetailOpts} />
        </Row>
        <FooterToolbar>
          <FormItem>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button disabled={loading} type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </FooterToolbar>
      </Form>
      {visible && <ListTransferOut {...listLovProps} changePeriod={handleChangePeriod} />}
      {modalVisible && <ModalList {...modalOpts} />}
    </div>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
