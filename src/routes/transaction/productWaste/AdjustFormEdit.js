import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Input, Row, Button, DatePicker, Cascader, Select } from 'antd'
import moment from 'moment'
import { alertModal } from 'utils'
import {
  RBB,
  RJJ
} from 'utils/variable'
import Browse from './Browse'

const { checkPermissionMonthTransaction } = alertModal
const dateFormat = 'YYYY/MM/DD'
const FormItem = Form.Item
const { TextArea } = Input
const { Option } = Select
// const { Search } = Input
const formItemLayout1 = {
  labelCol: { xs: { span: 24 }, sm: { span: 9 }, md: { span: 9 }, lg: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 14 }, md: { span: 14 }, lg: { span: 15 } },
  style: { marginBottom: 3 }
}
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 }
}

const AdjustForm = ({ listAccountCode, onChooseItem, onResetAll, disableItem, onGetEmployee, itemEmployee, listType, listEmployee, onSearchProduct, onGetProduct, item,
  popoverVisible, dataBrowse, onHidePopover, onEdit, onChangeSearch, dataSource, form: { getFieldDecorator, resetFields, getFieldsValue, validateFields }, ...adjustProps }) => {
  if (item) {
    itemEmployee.employeeId = item.picId
    itemEmployee.employeeName = item.pic
  }
  const handleButtonSaveClick = () => {
    Modal.confirm({
      title: `Update ${item.transNo} ?`,
      content: 'Action cannot be undone',
      onOk () {
        validateFields((errors) => {
          if (errors) {
            return
          }
          const data = {
            ...getFieldsValue(),
            id: item.id,
            transNo: item.transNo,
            transType: item.transType,
            pic: itemEmployee !== null ? itemEmployee.employeeName : '',
            picId: itemEmployee !== null ? itemEmployee.employeeId : ''
          }
          const checkPermission = checkPermissionMonthTransaction(moment(item.transDate).format('YYYY-MM-DD'))
          if (checkPermission) {
            return
          }
          data.accountId = data.accountId && data.accountId.key ? data.accountId.key : null
          onEdit(data, resetFields)
        })
      },
      onCancel () {
        console.log('cancel')
      }
    })
  }

  const adjustOpts = {
    item,
    dataBrowse,
    ...adjustProps
  }

  const totalQtyIn = dataBrowse.reduce((prev, next) => prev + (next.In || 0), 0)
  const totalQtyOut = dataBrowse.reduce((prev, next) => prev + (next.Out || 0), 0)
  const totalPrice = dataBrowse.reduce((prev, next) => {
    if (next.In > 0) {
      return prev + (parseFloat(next.price) * parseFloat(next.In) || 0)
    }
    if (next.Out > 0) {
      return prev + (parseFloat(next.price) * parseFloat(next.Out) || 0)
    }
    return prev + 0
  }, 0)
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const listAccountOpt = (listAccountCode || []).length > 0
    ? listAccountCode.map(c => <Option value={c.id} key={c.id} title={`${c.accountName} (${c.accountCode})`}>{`${c.accountName} (${c.accountCode})`}</Option>)
    : []
  return (
    <Form style={{ padding: 3 }}>
      <FormItem label="Trans No" {...formItemLayout}>
        <Input value={item.transNo} maxLength={25} />
      </FormItem>
      <FormItem label="Type" {...formItemLayout}>
        {getFieldDecorator('transType', {
          initialValue: item ? [item.transType] : '',
          rules: [{
            required: true
          }]
        })(<Cascader
          size="large"
          disabled
          style={{ width: '100%' }}
          options={listType}
          placeholder="Pick a Type"
        />)}
      </FormItem>
      <FormItem {...formItemLayout} label="Account Code">
        {getFieldDecorator('accountId', {
          initialValue: item.accountId && item.accountCode && item.accountCode.accountCode ? {
            key: item.accountId,
            name: `${item.accountCode.accountName} (${item.accountCode.accountCode})`
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
      <FormItem label="Date" {...formItemLayout}>
        <DatePicker disabled value={moment.utc(item.transDate, 'YYYY/MM/DD')} format={dateFormat} />
      </FormItem>
      <FormItem label="Reference" {...formItemLayout}>
        <Input maxLength={40} value={item.reference} />
      </FormItem>
      <FormItem label="Memo" {...formItemLayout}>
        <TextArea maxLength={100} autosize={{ minRows: 2, maxRows: 4 }} value={item.memo} />
      </FormItem>
      <FormItem label="PIC" {...formItemLayout}>
        <Input value={itemEmployee !== null ? itemEmployee.employeeName : ''} />
      </FormItem>
      <FormItem label="PIC ID" {...formItemLayout}>
        <Input value={itemEmployee !== null ? itemEmployee.employeeId : ''} />
      </FormItem>
      <FormItem>
        <Browse {...adjustOpts} />
      </FormItem>
      <Form>
        <div style={{ float: 'right' }}>
          <Row>
            <FormItem label="Total In" {...formItemLayout1}>
              <Input value={totalQtyIn.toLocaleString()} style={{ fontSize: 20 }} />
            </FormItem>
          </Row>
          <Row>
            <FormItem label="Total Out" {...formItemLayout1}>
              <Input value={totalQtyOut.toLocaleString()} style={{ fontSize: 20 }} />
            </FormItem>
          </Row>
          <Row>
            <FormItem label="Total Price" {...formItemLayout1}>
              <Input value={totalPrice.toLocaleString()} style={{ fontSize: 20 }} />
            </FormItem>
          </Row>
        </div>
      </Form>
      <FormItem {...formItemLayout}>
        <Button disabled={item && (item.transType === RBB || item.transType === RJJ)} type="primary" style={{ height: 50, width: 200, visibility: 'visible' }} onClick={() => handleButtonSaveClick()}>PROCESS</Button>
        {/* <Button type="danger" style={{ height: 50, width: 200, visibility: 'visible' }} onClick={() => handleButtonDeleteClick()}>Delete All</Button> */}
      </FormItem>
    </Form>
  )
}

AdjustForm.propTyps = {
  form: PropTypes.object.isRequired,
  location: PropTypes.object,
  item: PropTypes.object,
  onGetEmployee: PropTypes.func,
  dispatch: PropTypes.func
}

export default Form.create()(AdjustForm)
