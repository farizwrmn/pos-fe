import React from 'react'
import PropTypes from 'prop-types'
import { Form, message, Input, Button, Row, Col, Modal, Select, Spin, DatePicker } from 'antd'
import { Link } from 'dva/router'
import { lstorage } from 'utils'
import moment from 'moment'
import ListDetail from './ListDetail'
import ModalList from './Modal'
import ModalBrowse from './ModalBrowse'
import ModalReturn from './ModalReturn'

const Option = Select.Option
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  item = {},
  loading,
  showLov,
  onSubmit,
  dispatch,
  // modalShow,
  modalShowList,
  modalType,
  // onCancel,
  listItem,
  resetListItem,
  // modalType,
  modalVisible,
  listAccountCode,
  listAccountOpt = (listAccountCode || []).length > 0 ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>) : [],
  listAccountCodeAll,
  modalProps,
  // listPayment,
  listDetailProps,
  // listOpts,
  listSupplier,
  // bankOpt = (listPayment || []).length > 0 ? listPayment.map(c => <Option value={c.id} key={c.id}>{`${c.name} ${c.accountCode && c.accountCode.accountCode ? `(${c.accountCode.accountCode})` : ''}`}</Option>) : [],
  // paymentOpt = (listOpts || []).length > 0 ? listOpts.map(c => <Option value={c.typeCode} key={c.typeCode}>{`${c.typeName} (${c.typeCode})`}</Option>) : [],
  supplierOpt = (listSupplier || []).length > 0 ? listSupplier.map(c => <Option value={c.id} key={c.id}>{`${c.supplierName} (${c.supplierCode})`}</Option>) : [],
  purchaseProps,
  updateCurrentItem,
  form: {
    getFieldDecorator,
    getFieldValue,
    validateFields,
    getFieldsValue,
    resetFields,
    setFieldsValue
  }
}) => {
  const {
    handleBrowseInvoice,
    onInvoiceHeader,
    onChooseInvoice,
    purchase,
    returnPurchase
  } = purchaseProps
  const { modalProductVisible } = purchase
  const { modalReturnVisible } = returnPurchase
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  // const handleCancel = () => {
  //   onCancel()
  //   resetFields()
  // }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      data.storeId = lstorage.getCurrentUserStore()
      data.supplierId = data.supplierId ? data.supplierId.key : null
      data.discountAccountId = data.discountAccountId ? data.discountAccountId.key : null
      data.accountId = data.accountId && data.accountId.key ? data.accountId.key : null
      data.typeCode = data.typeCode ? data.typeCode.key : null
      data.bankId = data.bankId ? data.bankId.key : null
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, listItem, getFieldsValue(), resetFields)
        },
        onCancel () { }
      })
    })
  }

  const modalOpts = {
    showLov,
    inputType: getFieldValue('type'),
    ...modalProps
  }

  const handleModalShowList = (record) => {
    validateFields(['supplierId'], (errors) => {
      if (errors) {
        return
      }
      if (record.amount >= 0) {
        modalShowList(record)
      } else {
        message.warning('Return cannot be edit')
      }
    })
  }

  const listDetailOpts = {
    handleModalShowList,
    ...listDetailProps
  }

  const hdlBrowseInvoice = () => {
    validateFields(['supplierId'], (errors) => {
      if (errors) {
        return
      }
      handleBrowseInvoice()
      const supplierId = getFieldValue('supplierId')
      if (supplierId && supplierId.key) {
        onInvoiceHeader(supplierId.key)
      }
    })
  }

  const hdlBrowseReturn = () => {
    validateFields(['supplierId'], (errors) => {
      if (errors) {
        return
      }
      const supplierId = getFieldValue('supplierId')
      if (supplierId && supplierId.key) {
        dispatch({
          type: 'returnPurchase/queryReturnDetailInvoice',
          payload: {
            supplierId: supplierId.key
          }
        })

        dispatch({
          type: 'purchase/updateState',
          payload: {
            modalType: 'browseReturn'
          }
        })

        dispatch({
          type: 'returnPurchase/updateState',
          payload: {
            modalReturnVisible: true
          }
        })
      }
    })
  }

  const purchaseOpts = {
    onChooseInvoice (item) {
      resetFields()
      console.log('item', item)
      onChooseInvoice(item)
    },
    dispatch,
    visible: modalProductVisible,
    ...purchaseProps,
    onInvoiceHeader (period) {
      validateFields(['supplierId'], (errors) => {
        if (errors) {
          return
        }
        handleBrowseInvoice()
        const supplierId = getFieldValue('supplierId')
        if (supplierId && supplierId.key) {
          onInvoiceHeader(period, supplierId.key)
        }
      })
    }
  }

  const returnOpts = {
    loading,
    onChooseInvoice (item) {
      console.log('item', item)
      onChooseInvoice(item)
    },
    listInvoice: returnPurchase.listInvoice,
    listItem: returnPurchase.listItem,
    dispatch,
    modalType: purchase.modalType,
    visible: modalReturnVisible,
    location,
    onInvoiceHeader () { }
  }

  const hdlModalReset = () => {
    const oldSupplierId = getFieldValue('supplierId')
    validateFields(['supplierId'], (errors) => {
      if (errors) {
        return
      }
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          const type = getFieldValue('type')
          resetListItem(type)
        },
        onCancel () {
          setFieldsValue({
            supplierId: {
              key: oldSupplierId ? oldSupplierId.key : null,
              label: oldSupplierId ? oldSupplierId.label : null
            }
          })
          updateCurrentItem({
            supplierId: {
              key: oldSupplierId ? oldSupplierId.key : null,
              label: oldSupplierId ? oldSupplierId.label : null
            },
            ...item
          })
        }
      })
    })
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
            <FormItem label="Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transDate', {
                initialValue: item.transDate ? moment.utc(item.transDate) : moment(),
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(<DatePicker />)}
            </FormItem>
            <FormItem label={(<Link target="_blank" to={'/master/supplier'}>Supplier</Link>)} hasFeedback {...formItemLayout}>
              {getFieldDecorator('supplierId', {
                initialValue: modalType === 'edit' && item.supplierId ? {
                  key: item.supplierId,
                  label: `${item.supplierName} (${item.supplierCode})`
                }
                  : undefined,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                onChange={() => hdlModalReset()}
                showSearch
                allowClear
                notFoundContent={loading.effects['supplier/query'] ? <Spin size="small" /> : null}
                onSearch={value => showLov('supplier', { q: value })}
                optionFilterProp="children"
                labelInValue
                filterOption={filterOption}
              >{supplierOpt}
              </Select>)}
            </FormItem>
            <FormItem label="Description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description')(<Input />)}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem label="Payment Method" hasFeedback {...formItemLayout}>
              {getFieldDecorator('accountId', {
                initialValue: item && item.accountCode ? {
                  key: item.accountId,
                  label: `${item.accountCode.accountName} (${item.accountCode.accountCode})`
                } : undefined,
                rules: [{
                  required: true,
                  message: 'Required'
                }]
              })(<Select
                showSearch
                allowClear
                optionFilterProp="children"
                labelInValue
                filterOption={filterOption}
              >{listAccountOpt}
              </Select>)}
            </FormItem>
            {/* <FormItem label="Disc Invoice(N)" hasFeedback {...formItemLayout}>
              {getFieldDecorator('discount', {
                initialValue: 0,
                rules: [{
                  required: true,
                  pattern: /^([0-9.-]{0,19})$/i,
                  message: 'Required'
                }]
              })(
                <InputNumber
                  defaultValue={0}
                  step={10000}
                  max={listItem ? listItem.reduce((prev, next) => prev + next.paymentTotal, 0) : 0}
                  min={0}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="Discount Account">
              {getFieldDecorator('discountAccountId', {
                initialValue: item.discountAccountId,
                rules: [{
                  required: getFieldValue('discount') > 0,
                  message: 'Required'
                }]
              })(<Select
                showSearch
                allowClear
                optionFilterProp="children"
                labelInValue
                filterOption={filterOption}
              >{listAccountOpt}
              </Select>)}
            </FormItem> */}
          </Col>
        </Row>
        <Row>
          <Col {...column}>
            {/* <Button type="primary" size="large" onClick={() => hdlModalShow()} style={{ marginBottom: '8px' }}>Add</Button> */}
            <Button type="primary" size="large" icon="plus-square-o" onClick={() => hdlBrowseInvoice()} style={{ marginRight: '5px', marginBottom: '5px' }}>INVOICE</Button>
            <Button type="default" size="large" icon="minus-square-o" onClick={() => hdlBrowseReturn()} style={{ marginRight: '5px', marginBottom: '5px' }}>RETURN</Button>
            {modalProductVisible && <ModalBrowse {...purchaseOpts} />}
            {modalReturnVisible && <ModalReturn {...returnOpts} />}
          </Col>
          <Col {...column} />
        </Row>
        <Row style={{ marginBottom: '8px' }}>
          <ListDetail {...listDetailOpts} />
        </Row>
        <Row>
          <Col {...column} />
          <Col {...column}>
            <FormItem>
              {/* {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>} */}
              <Button type="primary" onClick={handleSubmit} style={{ float: 'right' }}>Save</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      {modalVisible && <ModalList listAccountCode={listAccountCodeAll} {...modalOpts} />}
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
