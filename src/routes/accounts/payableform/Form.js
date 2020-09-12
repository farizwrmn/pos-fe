import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Modal, Select, Spin, DatePicker } from 'antd'
import { Link } from 'dva/router'
import { lstorage } from 'utils'
import moment from 'moment'
import ListDetail from './ListDetail'
import ModalList from './Modal'
import ModalBrowse from './ModalBrowse'

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
  modalProps,
  listBank,
  listDetailProps,
  listOpts,
  listSupplier,
  bankOpt = (listBank || []).length > 0 ? listBank.map(c => <Option value={c.id} key={c.id}>{`${c.bankName} (${c.bankCode})`}</Option>) : [],
  paymentOpt = (listOpts || []).length > 0 ? listOpts.map(c => <Option value={c.typeCode} key={c.typeCode}>{`${c.typeName} (${c.typeCode})`}</Option>) : [],
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
  const { handleBrowseInvoice, onInvoiceHeader, onChooseInvoice, purchase } = purchaseProps
  const { modalProductVisible } = purchase
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
  // const hdlModalShow = () => {
  //   validateFields(['type'], (errors) => {
  //     if (errors) {
  //       return
  //     }
  //     const type = getFieldValue('type')
  //     modalShow(type)
  //   })
  // }

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
      modalShowList(record)
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
      let startPeriod = moment().startOf('month').format('YYYY-MM-DD')
      let endPeriod = moment().endOf('month').format('YYYY-MM-DD')
      const period = {
        startPeriod,
        endPeriod
      }
      onInvoiceHeader(period)
    })
  }

  const purchaseOpts = {
    onChooseInvoice (item) {
      resetFields()
      onChooseInvoice(item)
    },
    dispatch,
    visible: modalProductVisible,
    ...purchaseProps
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
            <FormItem label="Description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description')(<Input />)}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem label={(<Link target="_blank" to={'/master/supplier'}>Supplier</Link>)} hasFeedback {...formItemLayout}>
              {getFieldDecorator('supplierId', {
                initialValue: modalType === 'edit' && item.supplierId ? {
                  key: item.supplierId,
                  label: `${item.supplierName} (${item.supplierCode})`
                }
                  : {
                    key: null,
                    label: null
                  },
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
            <FormItem label="Payment Method" hasFeedback {...formItemLayout}>
              {getFieldDecorator('typeCode', {
                initialValue: modalType === 'edit' && item.typeCode ? {
                  key: item.typeCode,
                  label: `${item.typeName} (${item.typeCode})`
                }
                  : {
                    key: null,
                    label: null
                  },
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                allowClear
                onFocus={() => showLov('paymentOpts')}
                optionFilterProp="children"
                labelInValue
                filterOption={filterOption}
              >{paymentOpt}
              </Select>)}
            </FormItem>
            <FormItem label="Bank" hasFeedback {...formItemLayout}>
              {getFieldDecorator('bankId', {
                initialValue: modalType === 'edit' && item.bankId ? {
                  key: item.bankId,
                  label: `${item.bankName} (${item.bankCode})`
                }
                  : {
                    key: null,
                    label: null
                  },
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                // <AutoComplete {...autoCompleteProps} />
                <Select
                  showSearch
                  allowClear
                  onFocus={() => showLov('bank')}
                  onSearch={value => showLov('bank', { q: value })}
                  optionFilterProp="children"
                  labelInValue
                  filterOption={filterOption}
                >{bankOpt}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col {...column}>
            {/* <Button type="primary" size="large" onClick={() => hdlModalShow()} style={{ marginBottom: '8px' }}>Add</Button> */}
            <Button type="primary" size="large" icon="plus-square-o" onClick={() => hdlBrowseInvoice()} style={{ marginRight: '5px', marginBottom: '5px' }}>INVOICE</Button>
            {modalProductVisible && <ModalBrowse {...purchaseOpts} />}
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
