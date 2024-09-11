import React from 'react'
import PropTypes from 'prop-types'
import { arrayToTree, lstorage } from 'utils'
import {
  Form,
  TreeSelect,
  Select,
  DatePicker,
  Row,
  Col,
  Button,
  Input,
  Modal
} from 'antd'
import moment from 'moment'

const Option = Select.Option
const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const ModalEntry = ({
  user,
  onOk,
  onCancel,
  item = {},
  valueNumber,
  data,
  listAmount,
  visibleTooltip,
  changeVisibleTooltip,
  changeValueNumber,
  listSupplierBank,
  showAddBank,
  listEdc,
  listCost,
  onResetMachine,
  onGetMachine,
  onGetCost,
  curPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.paid), 0),
  options,
  form: {
    getFieldDecorator,
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
    resetFields,
    validateFields
  },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const item = {
        reference: data.id,
        transNo: data.transNo,
        storeId: data.storeId,
        storeIdPayment: lstorage.getCurrentUserStore(),
        ...getFieldsValue()
      }
      // console.log('item', item)
      onOk(item)
    })
  }

  const handleClickAddBank = () => {
    showAddBank()
  }

  const handleCancel = () => {
    resetFields()
    onCancel()
  }
  const modalOpts = {
    ...modalProps,
    title: 'Add Payment',
    onOk: handleOk,
    onCancel: handleCancel
  }

  const useNetto = (e) => {
    setFieldsValue({
      amount: e
    })
  }

  const hdlChangeTooltip = () => {
    const value = getFieldValue('amount')
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      changeValueNumber(value)
    }
    changeVisibleTooltip(true)
  }

  const changeNumber = (e) => {
    const { value } = e.target
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      valueNumber = value
    }
    changeValueNumber(value)
  }

  const changeSelectTypeCode = (value) => {
    if (value === 'C') {
      setFieldsValue({
        bankAccountId: null,
        cardNo: null,
        cardName: null,
        checkNo: null
      })
    } else if (value === 'G') {
      setFieldsValue({
        cardNo: null,
        cardName: null,
        checkNo: null
      })
    } else {
      setFieldsValue({
        bankAccountId: null,
        checkNo: null
      })
    }
  }
  const menuTree = arrayToTree(options.filter(filtered => filtered.parentId !== '-1').sort((x, y) => x.id - y.id), 'id', 'parentId')
  const getMenus = (menuTreeN) => {
    return menuTreeN.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode value={item.typeCode} key={item.typeCode} title={item.typeName}>{getMenus(item.children)}</TreeNode>
      }
      return <TreeNode value={item.typeCode} key={item.typeCode} title={item.typeName} />
    })
  }

  const onChangePaymentType = (value) => {
    if (value === 'C') {
      resetFields()
      onResetMachine()
    } else {
      setFieldsValue({
        printDate: moment(),
        machine: undefined,
        bank: undefined
      })
      validateFields()
      onResetMachine()
      onGetMachine(value)
    }
  }

  const onChangeMachine = (machineId) => {
    setFieldsValue({
      bank: undefined
    })
    validateFields()
    onGetCost(machineId)
  }

  return (
    <Modal {...modalOpts}>
      <Form>
        <Row>
          <Col lg={12} md={12} sm={24}>
            <FormItem label="Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('typeCode', {
                initialValue: item.typeCode ? item.typeCode : 'C',
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <TreeSelect
                  showSearch
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeNodeFilterProp="title"
                  filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
                  treeDefaultExpandAll
                  onChange={(e) => {
                    changeSelectTypeCode(e)
                    onChangePaymentType(e)
                  }}
                >
                  {getMenus(menuTree)}
                </TreeSelect>
              )}
            </FormItem>
            <FormItem label="Amount" hasFeedback {...formItemLayout}>
              {getFieldDecorator('amount', {
                initialValue: parseFloat(data.nettoTotal - curPayment) || item.amount,
                rules: [
                  {
                    required: true,
                    pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                    message: '0-9 please insert the value'
                  }
                ]
              })(
                <Input onFocus={hdlChangeTooltip} onChange={changeNumber} style={{ width: '100%' }} addonBefore={(<Button size="small" onClick={() => useNetto(parseFloat(data.nettoTotal - curPayment))}>Netto</Button>)} autoFocus maxLength={12} />
              )}
            </FormItem>
            <FormItem label="Card" hasFeedback labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('bankAccountId', {
                rules: [
                  {
                    required: getFieldValue('typeCode') === 'G',
                    pattern: /^[a-z0-9 -.,_]+$/i,
                    message: 'please insert the value'
                  }
                ]
              })(
                <Select style={{ width: '100%' }} min={0} disabled={getFieldValue('typeCode') !== 'G'} maxLength={10}>
                  {listSupplierBank.map(list => <Option value={list.id}>{`${list.accountName} (${list.accountNo})`}</Option>)}
                </Select>
              )}
              <Button disabled={getFieldValue('typeCode') === 'C'} type="primary" icon="plus" onClick={handleClickAddBank}>Add Bank</Button>
            </FormItem>
          </Col>
          <Col lg={12} md={12} sm={24}>
            <FormItem label="Note" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: false,
                    pattern: /^[a-z0-9 -.%#@${}?!/()_]+$/i,
                    message: 'please insert the value'
                  }
                ]
              })(<Input maxLength={250} style={{ width: '100%', fontSize: '14pt' }} />)}
            </FormItem>
            {getFieldValue('typeCode') !== 'C' && listEdc && (
              <FormItem label="EDC" hasFeedback {...formItemLayout}>
                {getFieldDecorator('machine', {
                  initialValue: item.machine,
                  rules: [
                    {
                      required: getFieldValue('typeCode') !== 'C'
                    }
                  ]
                })(
                  <Select onChange={onChangeMachine} style={{ width: '100%' }} min={0} maxLength={10}>
                    {listEdc.map(list => <Option value={list.id}>{list.name}</Option>)}
                  </Select>
                )}
              </FormItem>
            )}
            {getFieldValue('typeCode') !== 'C' && (
              <FormItem label="Card" hasFeedback {...formItemLayout}>
                {getFieldDecorator('bank', {
                  initialValue: item.bank,
                  rules: [
                    {
                      required: getFieldValue('typeCode') !== 'C'
                    }
                  ]
                })(
                  <Select style={{ width: '100%' }} min={0} maxLength={10}>
                    {listCost.map(list => <Option value={list.id}>{`${list.bank ? list.bank.bankName : ''} (${list.bank ? list.bank.bankCode : ''})`}</Option>)}
                  </Select>
                )}
              </FormItem>
            )}
            <FormItem
              label="Trans Date"
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('transDate', {
                initialValue: item.transDate ? moment.utc(item.transDate, 'YYYY-MM-DD') : moment(),
                rules: [
                  {
                    required: getFieldValue('typeCode') !== 'C',
                    message: 'please insert the value'
                  }
                ]
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Select Date"
                  disabled={!(
                    user.permissions.role === 'SPR'
                    || user.permissions.role === 'OWN'
                    || user.permissions.role === 'ITS'
                    || user.permissions.role === 'PCS'
                    || user.permissions.role === 'HPC'
                    || user.permissions.role === 'SPC'
                    || user.permissions.role === 'HFC'
                    || user.permissions.role === 'SFC')}
                  style={{ width: '100%', fontSize: '14pt' }}
                />
              )}
            </FormItem>
            <FormItem
              label="Print Date"
              hasFeedback
              style={{
                display: getFieldValue('typeCode') === 'C' ? 'none' : ''
              }}
              {...formItemLayout}
            >
              {getFieldDecorator('printDate', {
                initialValue: item.printDate ? moment.utc(item.printDate, 'YYYY-MM-DD HH:mm:ss') : null,
                rules: [
                  {
                    required: getFieldValue('typeCode') !== 'C',
                    message: 'please insert the value'
                  }
                ]
              })(
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="Select Time"
                  disabled
                  style={{ width: '100%', fontSize: '14pt' }}
                />
              )}
            </FormItem>
            {getFieldValue('typeCode') !== 'C' && (
              <FormItem label="Card Name" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cardName', {
                  initialValue: item.cardName,
                  rules: [
                    {
                      required: getFieldValue('typeCode') !== 'C',
                      pattern: /^[a-z0-9 -.,_]+$/i,
                      message: 'please insert the value'
                    }
                  ]
                })(<Input disabled={getFieldValue('typeCode') === 'C'} maxLength={250} style={{ width: '100%', fontSize: '14pt' }} />)}
              </FormItem>
            )}
            {getFieldValue('typeCode') !== 'C' && (
              <FormItem label="Card/Phone No" hasFeedback {...formItemLayout}>
                {getFieldDecorator('cardNo', {
                  initialValue: item.cardNo,
                  rules: [
                    {
                      required: getFieldValue('typeCode') !== 'C',
                      pattern: /^[a-z0-9-/.,_]+$/i,
                      message: 'please insert the value'
                    }
                  ]
                })(<Input disabled={getFieldValue('typeCode') === 'C'} maxLength={30} style={{ width: '100%', fontSize: '14pt' }} />)}
              </FormItem>
            )}
          </Col>
        </Row>
      </Form>
    </Modal >
  )
}

ModalEntry.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}

export default Form.create()(ModalEntry)
