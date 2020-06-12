import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Modal,
  DatePicker,
  // Select,
  TreeSelect,
  Select
} from 'antd'
import { arrayToTree } from 'utils'
import moment from 'moment'
import List from './List'

const FormItem = Form.Item
const Option = Select.Option
const TreeNode = TreeSelect.TreeNode
// const Option = Select.Option

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

class FormPayment extends React.Component {
  state = {
    taxInvoiceNo: undefined,
    taxDate: undefined
  }

  onChangeTaxInvoiceNo (e) {
    const { value } = e.target
    this.setState({ taxInvoiceNo: value })
  }

  onChangeTaxDate (e) {
    this.setState({ taxDate: e })
  }

  render () {
    const {
      item = {},
      paymentModalVisible,
      onSubmit,
      onEdit,
      options,
      editItem,
      cancelEdit,
      dineInTax,
      onGetMachine,
      onGetCost,
      onResetMachine,
      curTotal,
      listEdc,
      listCost,
      modalType,
      // curTotalDiscount,
      memberInformation,
      curRounding,
      listAmount,
      confirmPayment,
      cancelPayment,
      loading,
      // cashierInformation,
      cashierBalance,
      form: {
        getFieldDecorator,
        validateFields,
        getFieldsValue,
        getFieldValue,
        resetFields,
        setFieldsValue
      }
    } = this.props
    const {
      taxInvoiceNo,
      taxDate
    } = this.state

    const handleSubmit = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          // cashierTransId: cashierInformation.id,
          // cashierName: cashierInformation.cashierName,
          ...getFieldsValue()
        }
        data.amount = parseFloat(data.amount)
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
      cashierBalance,
      // cashierInformation,
      dataSource: listAmount,
      editList (data) {
        editItem(data)
        resetFields()
      }
    }

    const changeToNumber = (e) => {
      const { value } = e.target
      const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
      if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
        setFieldsValue({
          amount: value
        })
      }
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
      if (e.which === 66 && isCtrl === true && (paymentModalVisible || window.location.pathname === '/transaction/pos/payment')) { // ctrl + b
        perfect()
        return false
      }
    }

    const useNetto = (e) => {
      setFieldsValue({
        amount: e
      })
    }

    const onCancelEdit = () => {
      cancelEdit()
      resetFields()
    }

    // const changeMethod = () => {
    //   setFieldsValue({
    //     cardName: null,
    //     cardNo: null
    //   })
    // }
    const usageLoyalty = memberInformation.useLoyalty || 0
    const totalDiscount = usageLoyalty
    const curNetto = ((parseFloat(curTotal) - parseFloat(totalDiscount)) + parseFloat(curRounding)) || 0
    const curPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)
    const dineIn = curNetto * (dineInTax / 100)
    const curChange = curPayment - curNetto > 0 ? curPayment - (curNetto + dineIn) : 0
    const paymentValue = (parseFloat(curTotal) - parseFloat(totalDiscount) - parseFloat(curPayment)) + parseFloat(curRounding) + parseFloat(dineIn)


    const menuTree = arrayToTree(options.filter(_ => _.parentId !== '-1').sort((x, y) => x.id - y.id), 'id', 'parentId')

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

    const onConfirm = () => {
      const { taxInvoiceNo, taxDate } = this.state
      confirmPayment({
        taxInvoiceNo, taxDate
      })
    }


    return (
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
                  onChange={onChangePaymentType}
                >
                  {getMenus(menuTree)}
                </TreeSelect>
              )}
            </FormItem>
            <FormItem label="Amount" hasFeedback {...formItemLayout}>
              {getFieldDecorator('amount', {
                initialValue: item.amount ? item.amount : paymentValue > 0 ? paymentValue : 0,
                rules: [
                  {
                    required: true,
                    pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                    message: '0-9 please insert the value'
                  }
                ]
              })(<Input style={{ width: '100%', fontSize: '14pt' }} onChange={value => changeToNumber(value)} addonBefore={(<Button size="small" onClick={() => useNetto(parseFloat(curTotal) + parseFloat(curRounding))}>Netto</Button>)} autoFocus maxLength={10} />)}
            </FormItem>
            <FormItem label="Tax Invoice" hasFeedback {...formItemLayout}>
              <Input maxLength={25} value={taxInvoiceNo} onChange={e => this.onChangeTaxInvoiceNo(e)} placeholder="Tax Invoice No" />
            </FormItem>
            <FormItem label="Tax Date" hasFeedback {...formItemLayout}>
              <DatePicker value={taxDate} onChange={e => this.onChangeTaxDate(e)} placeholder="Tax Date" />
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
              <FormItem label="Machine" hasFeedback {...formItemLayout}>
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
              <FormItem label="Bank" hasFeedback {...formItemLayout}>
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
          <Col lg={8} md={12} sm={24} />
        </Row>
        <FormItem {...formItemLayout}>
          <Button type="primary" onClick={handleSubmit}>{`${modalType === 'add' ? 'Add' : 'Edit'} Payment Method (Ctrl + B)`}</Button>
          {modalType === 'edit' && <Button type="dashed" onClick={() => onCancelEdit()}>Cancel edit</Button>}
        </FormItem>
        <List {...listProps} />
        <Row>
          <Col md={12} sm={24} style={{ float: 'right', textAlign: 'right' }}>
            <FormItem style={{ fontSize: '20px', marginBottom: 2, marginTop: 2 }} label="Total" {...formItemLayout}>
              <Input value={curTotal.toLocaleString()} defaultValue="0" style={{ width: '100%', fontSize: '20', textAlign: 'right' }} size="large" />
            </FormItem>
            <FormItem style={{ fontSize: '20px', marginBottom: 2, marginTop: 2 }} label="Rounding" {...formItemLayout}>
              <Input value={curRounding.toLocaleString()} defaultValue="0" style={{ width: '100%', fontSize: '20', textAlign: 'right' }} size="large" />
            </FormItem>
            <FormItem style={{ fontSize: '20px', marginBottom: 2, marginTop: 2 }} label="Dine In Tax" {...formItemLayout}>
              <Input value={dineIn.toLocaleString()} style={{ width: '100%', fontSize: '20', textAlign: 'right' }} size="large" />
            </FormItem>
            <FormItem style={{ fontSize: '20px', marginBottom: 2, marginTop: 2 }} label="Netto" {...formItemLayout}>
              <Input value={(parseFloat(curNetto) + parseFloat(dineIn)).toLocaleString()} style={{ width: '100%', fontSize: '20', textAlign: 'right' }} size="large" />
            </FormItem>
            <FormItem style={{ fontSize: '20px', marginBottom: 2, marginTop: 2 }} label="Change" {...formItemLayout}>
              <Input value={curChange.toLocaleString()} style={{ width: '100%', fontSize: '20', textAlign: 'right' }} size="large" />
            </FormItem>
            <Form layout="vertical">
              <FormItem>
                <Button type="default" size="large" onEnter={cancelPayment} onClick={cancelPayment} disabled={loading && loading.effects['payment/create']} className="margin-right" width="100%" >Back To Transaction Detail</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" size="large" onClick={() => onConfirm()} disabled={loading && loading.effects['payment/create']} className="margin-right" width="100%" > Confirm Payment </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </Form>
    )
  }
}

FormPayment.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(FormPayment)
