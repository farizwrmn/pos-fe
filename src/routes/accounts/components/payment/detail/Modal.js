import React from 'react'
import PropTypes from 'prop-types'
import { arrayToTree, lstorage } from 'utils'
import {
  Form,
  TreeSelect,
  DatePicker,
  Row,
  Col,
  Button,
  Input,
  Modal,
  Select
} from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const TreeNode = TreeSelect.TreeNode
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const modal = ({
  onOk,
  onCancel,
  item = {},
  data,
  listAmount,
  cashierInformation,
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
      console.log('data', data)
      const item = {
        reference: data[0].id,
        transNo: data[0].transNo,
        storeId: data[0].storeId,
        storeIdPayment: lstorage.getCurrentUserStore(),
        cashierTransId: cashierInformation.id,
        ...getFieldsValue()
      }
      onOk(item)
    })
  }

  const handleCancel = () => {
    resetFields()
    onCancel()
  }

  const useNetto = (e) => {
    setFieldsValue({
      amount: e
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
    onCancel: handleCancel
  }

  const menuTree = arrayToTree(options.filter(_ => _.parentId !== '-1').sort((x, y) => x.id - y.id), 'id', 'parentId')
  const getMenus = (menuTreeN) => {
    return menuTreeN.map((item) => {
      if (item.children && item.children.length) {
        return <TreeNode value={item.typeCode} key={item.typeCode} title={item.typeName}>{getMenus(item.children)}</TreeNode>
      }
      return <TreeNode value={item.typeCode} key={item.typeCode} title={item.typeName} />
    })
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
      <Form layout="horizontal">
        <Row>
          <Col md={12} sm={24}>
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
                initialValue: item.amount ? item.amount : parseFloat(data.length > 0 ? data[0].nettoTotal - curPayment : 0).toFixed(0),
                rules: [
                  {
                    required: true,
                    pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                    message: '0-9 please insert the value'
                  }
                ]
              })(<Input style={{ width: '100%', fontSize: '14pt' }} addonBefore={(<Button size="small" onClick={() => useNetto(parseFloat(data[0].nettoTotal - curPayment))}>Netto</Button>)} autoFocus maxLength={10} />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
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
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  onCancel: PropTypes.func
}

export default Form.create()(modal)
