import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Row, Col, Modal, Select } from 'antd'
import { Link } from 'dva/router'
import { lstorage } from 'utils'
import ListDetail from './ListDetail'
import ModalList from './Modal'

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
  showLov,
  onSubmit,
  modalShow,
  modalShowList,
  resetListItem,
  // onCancel,
  listItem,
  // modalType,
  modalVisible,
  modalProps,
  listBank,
  listDetailProps,
  listOpts,
  listCustomer,
  listSupplier,
  updateCurrentItem,
  bankOpt = (listBank || []).length > 0 ? listBank.map(c => <Option value={c.id} key={c.id}>{`${c.bankName} (${c.bankCode})`}</Option>) : [],
  paymentOpt = (listOpts || []).length > 0 ? listOpts.map(c => <Option value={c.id} key={c.id}>{`${c.typeName} (${c.typeCode})`}</Option>) : [],
  customerOpt = (listCustomer || []).length > 0 ? listCustomer.map(c => <Option value={c.id} key={c.id}>{`${c.memberName} (${c.memberCode})`}</Option>) : [],
  supplierOpt = (listSupplier || []).length > 0 ? listSupplier.map(c => <Option value={c.id} key={c.id}>{`${c.supplierName} (${c.supplierCode})`}</Option>) : [],
  form: {
    getFieldDecorator,
    getFieldValue,
    validateFields,
    getFieldsValue,
    setFieldsValue,
    resetFields
  },
  inputType = getFieldValue('type')
}) => {
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
      data.memberId = data.memberId ? data.memberId.key : null
      data.supplierId = data.supplierId ? data.supplierId.key : null
      data.bankId = data.bankId ? data.bankId.key : null
      data.transType = data.transType ? data.transType.key : null
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, listItem, getFieldsValue())
          resetFields()
        },
        onCancel () { }
      })
    })
  }
  const hdlModalShow = () => {
    validateFields(['type'], (errors) => {
      if (errors) {
        return
      }
      const type = getFieldValue('type')
      modalShow(type)
    })
  }

  const hdlModalReset = () => {
    const oldType = getFieldValue('type')
    const oldSupplierId = getFieldValue('supplierId')
    const oldMemberId = getFieldValue('memberId')
    validateFields(['type', 'supplierId', 'memberId'], (errors) => {
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
          if (oldType === 'I') {
            setFieldsValue({
              type: oldType
            })
            updateCurrentItem({
              memberId: {
                key: oldMemberId ? oldMemberId.key : null,
                label: oldMemberId ? oldMemberId.label : null
              },
              supplierId: {
                key: null,
                label: null
              },
              ...item
            })
          } else if (oldType === 'E') {
            setFieldsValue({
              type: oldType
            })
            updateCurrentItem({
              supplierId: {
                key: oldSupplierId ? oldSupplierId.key : null,
                label: oldSupplierId ? oldSupplierId.label : null
              },
              memberId: {
                key: null,
                label: null
              },
              ...item
            })
          }
        }
      })
    })
  }

  const modalOpts = {
    showLov,
    inputType: getFieldValue('type'),
    ...modalProps
  }

  const handleModalShowList = (record) => {
    validateFields(['type', 'supplierId', 'memberId'], (errors) => {
      if (errors) {
        return
      }
      record.accountId = {
        key: record.accountId,
        label: record.accountName
      }
      modalShowList(record)
    })
  }

  const listDetailOpts = {
    handleModalShowList,
    ...listDetailProps
  }

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...column}>
            <FormItem label="transNo" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transNo', {
                initialValue: item.transNo,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input disabled maxLength={30} />)}
            </FormItem>
            <FormItem label="Reference" hasFeedback {...formItemLayout}>
              {getFieldDecorator('reference', {
                initialValue: item.reference
              })(<Input maxLength={40} autoFocus />)}
            </FormItem>
            <FormItem label="Description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description')(<Input />)}
            </FormItem>
          </Col>
          <Col {...column}>
            <FormItem label="Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('type', {
                initialValue: item.type,
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  allowClear
                  onChange={() => hdlModalReset()}
                >
                  <Option value="E">Out</Option>
                  <Option value="I">In</Option>
                </Select>)}
            </FormItem>
            {getFieldValue('type') === 'I' && <FormItem label={(<Link target="_blank" to={'/master/customer'}>Member</Link>)} hasFeedback {...formItemLayout}>
              {getFieldDecorator('memberId', {
                initialValue: item.memberId,
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Select
                showSearch
                allowClear
                onFocus={() => showLov('customer')}
                onSearch={value => showLov('customer', { q: value })}
                optionFilterProp="children"
                labelInValue
                filterOption={filterOption}
              >{customerOpt}
              </Select>)}
            </FormItem>}
            {getFieldValue('type') === 'E' && <FormItem label={(<Link target="_blank" to={'/master/supplier'}>Supplier</Link>)} hasFeedback {...formItemLayout}>
              {getFieldDecorator('supplierId', {
                initialValue: item.supplierId,
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Select
                showSearch
                allowClear
                onFocus={() => showLov('supplier')}
                onSearch={value => showLov('supplier', { q: value })}
                optionFilterProp="children"
                labelInValue
                filterOption={filterOption}
              >{supplierOpt}
              </Select>)}
            </FormItem>}
            <FormItem label="Payment Method" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transType', {
                initialValue: item.transType,
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
                initialValue: item.bankId,
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
            <Button type="primary" size="large" onClick={() => hdlModalShow()} style={{ marginBottom: '8px' }}>Add</Button>
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
      {modalVisible && (inputType === 'I' || inputType === 'E') && <ModalList {...modalOpts} />}
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
