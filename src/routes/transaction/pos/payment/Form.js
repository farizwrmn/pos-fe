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
  TreeSelect
} from 'antd'
import { arrayToTree } from 'utils'
import moment from 'moment'
import List from './List'

const FormItem = Form.Item
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

const formPayment = ({
  item = {},
  paymentModalVisible,
  onSubmit,
  onEdit,
  options,
  editItem,
  cancelEdit,
  dineInTax,
  curTotal,
  modalType,
  // curTotalDiscount,
  memberInformation,
  curRounding,
  listAmount,
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
}) => {
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
    } else {
      setFieldsValue({
        printDate: moment()
      })
    }
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col md={12} sm={24}>
          <FormItem label="Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typeCode', {
              initialValue: item.typeCode ? item.typeCode : 'C'
            })(
              // <Select onChange={() => changeMethod()} style={{ width: '100%', fontSize: '14pt' }}>
              //   {options.map(list => <Option value={list.typeCode}>{`${list.typeName} (${list.typeCode})`}</Option>)}
              // </Select>

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
        </Col>
        <Col md={12} sm={24}>
          <FormItem label="Print Date" hasFeedback {...formItemLayout}>
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
        </Col>
        <Col lg={8} md={12} sm={24} />
      </Row>
      <FormItem {...formItemLayout}>
        <Button type="primary" onClick={handleSubmit}>{`${modalType === 'add' ? 'Add' : 'Edit'} Payment Method (Ctrl + B)`}</Button>
        {modalType === 'edit' && <Button type="dashed" onClick={() => onCancelEdit()}>Cancel edit</Button>}
      </FormItem>
      <List {...listProps} />
      <Row>
        <Col md={12} sm={24} style={{ float: 'right' }}>
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
        </Col>
      </Row>
    </Form>
  )
}

formPayment.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(formPayment)
