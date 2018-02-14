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
  Select
} from 'antd'
import moment from 'moment'
import List from './List'

const FormItem = Form.Item
const Option = Select.Option

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
  onSubmit,
  onEdit,
  options,
  editItem,
  cancelEdit,
  curTotal,
  modalType,
  curTotalDiscount,
  curRounding,
  listAmount,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
    resetFields,
    setFieldsValue
  }
}) => {
  // const { show } = filterProps
  // const { onShowHideSearch } = tabProps
  // const handleReset = () => {
  //   resetFields()
  // }

  // const change = (key) => {
  //   changeTab(key)
  //   handleReset()
  // }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
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

  // const browse = () => {
  //   clickBrowse()
  // }

  // const menu = (
  //   <Menu>
  //     <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
  //     <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
  //   </Menu>
  // )

  // const moreButtonTab = activeKey === '0' ? <Button onClick={() => browse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button><Dropdown overlay={menu}>
  //   <Button style={{ marginLeft: 8 }}>
  //     <Icon type="printer" /> Print
  //   </Button>
  // </Dropdown> </div>)
  const listProps = {
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
    if (e.which === 66 && isCtrl === true) { // ctrl + b
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

  const curNetto = (parseFloat(curTotal) + parseFloat(curRounding))
  const curPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)

  return (
    <Form layout="horizontal">
      <Row>
        <Col lg={8} md={12} sm={24}>
          <FormItem label="Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('typeCode', {
              initialValue: item.typeCode ? item.typeCode : 'C'
            })(
              <Select style={{ width: '100%', fontSize: '14pt' }} min={0} maxLength={10}>
                {options.map(list => <Option value={list.typeCode}>{`${list.typeName} (${list.typeCode})`}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem label="Amount" hasFeedback {...formItemLayout}>
            {getFieldDecorator('amount', {
              initialValue: item.amount ? item.amount : (parseInt(curTotal, 10) + parseInt(curRounding, 10)) - curPayment > 0 ? (parseInt(curTotal, 10) + parseInt(curRounding, 10)) - curPayment : 0,
              rules: [
                {
                  required: true,
                  pattern: /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/,
                  message: '0-9 please insert the value'
                }
              ]
            })(<Input style={{ width: '100%', fontSize: '14pt' }} onChange={value => changeToNumber(value)} addonBefore={(<Button size="small" onClick={() => useNetto(parseInt(curTotal, 10) + parseInt(curRounding, 10))}>Netto</Button>)} autoFocus maxLength={10} />)}
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
        <Col lg={8} md={12} sm={24}>
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
          <FormItem label="Card No." hasFeedback {...formItemLayout}>
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
        <Col lg={8} md={12} sm={24}>
          {/* <FormItem style={{ fontSize: '20px', marginBottom: 2, marginTop: 2 }} label="Total Cash" {...formItemLayout}>
            <Input value={curNetto} style={{ width: '100%', fontSize: '17pt' }} size="large" />
          </FormItem> */}

        </Col>
      </Row>
      <FormItem {...formItemLayout}>
        <Button type="primary" onClick={handleSubmit}>{`${modalType === 'add' ? 'Add' : 'Edit'} Payment Method (Ctrl + B)`}</Button>
        {modalType === 'edit' && <Button type="dashed" onClick={() => onCancelEdit()}>Cancel edit</Button>}
      </FormItem>
      <List {...listProps} />
      <Row>
        <Col lg={8} md={12} sm={24} />
        <Col lg={8} md={12} sm={24} />
        <Col lg={8} md={12} sm={24}>
          <FormItem style={{ fontSize: '20px', marginBottom: 2, marginTop: 2 }} label="Discount" {...formItemLayout}>
            <Input value={curTotalDiscount} defaultValue="0" style={{ width: '100%', fontSize: '17pt' }} size="large" />
          </FormItem>
          <FormItem style={{ fontSize: '20px', marginBottom: 2, marginTop: 2 }} label="Rounding" {...formItemLayout}>
            <Input value={curRounding} defaultValue="0" style={{ width: '100%', fontSize: '17pt' }} size="large" />
          </FormItem>
          <FormItem style={{ fontSize: '20px', marginBottom: 2, marginTop: 2 }} label="Change" {...formItemLayout}>
            <Input value={curPayment - curNetto} style={{ width: '100%', fontSize: '17pt' }} size="large" />
          </FormItem>
          <FormItem style={{ fontSize: '20px', marginBottom: 2, marginTop: 2 }} label="Netto" {...formItemLayout}>
            <Input value={parseInt(curTotal, 10) + parseInt(curRounding, 10)} style={{ width: '100%', fontSize: '17pt' }} size="large" />
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
