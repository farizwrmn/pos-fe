import React from 'react'
import PropTypes from 'prop-types'
import { posTotal } from 'utils'
import { Button, Input, InputNumber, Form, Modal, Select } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
}

const PaymentList = ({
  onChooseItem,
  DeleteItem,
  onChangeTotalItem,
  loading,
  item,
  listMechanic,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  },
  ...modalProps
}) => {
  const handleTotalChange = () => {
    const data = getFieldsValue()
    data.sellingPrice = data.price
    data.total = posTotal(data)
    data.productId = item.productId
    data.code = item.code
    data.name = item.name
    data.sellPrice = item.sellPrice
    data.typeCode = item.typeCode
    if (data.employee) {
      data.employeeId = data.employee.key
      data.employeeName = data.employee.label.reduce((cnt, o) => cnt + o, '')
    }
    const { employee, ...other } = data
    onChangeTotalItem(other)
    return data
  }
  const listOptions = listMechanic.map(x => (<Option key={x.id} value={x.id}>{x.employeeName} ({x.employeeId})</Option>))
  const handleClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...handleTotalChange()
      }
      data.typeCode = item.typeCode
      data.productId = item.productId
      if (data.employee) {
        data.employeeId = data.employee.key
        data.employeeName = data.employee.label.reduce((cnt, o) => cnt + o, '')
      }
      data.code = item.code
      data.name = item.name
      data.sellPrice = item.sellPrice
      const { employee, ...other } = data
      onChooseItem(other)
    })
  }
  const handleDelete = () => {
    const data = {
      Record: item.no,
      Payment: 'Delete',
      VALUE: 0
    }
    confirm({
      title: `Remove Record ${data.Record} ?`,
      content: `Record ${data.Record} will remove from list !`,
      onOk () {
        console.log('Ok')
        DeleteItem(data)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }
  return (
    <Modal
      footer={[
        (<Button type="danger" onClick={handleDelete} disabled={!(item.bundleId !== undefined && item.bundleId !== null)}>Void</Button>),
        // (<Button type="danger" onClick={handleDelete} disabled={(item.bundleId !== undefined && item.bundleId !== null)}>Delete</Button>),
        (<Button type="primary" disabled={loading.effects['pos/checkQuantityEditProduct']} onClick={handleClick}>Submit</Button>)
      ]}
      {...modalProps}
    >
      <Form>
        <FormItem {...formItemLayout} label="Employee">
          {getFieldDecorator('employee', {
            initialValue: item.employeeId ? {
              key: item.employeeId,
              name: item.employeeName
            } :
              {
                key: null,
                name: null
              },
            rules: [{
              required: false,
              message: 'Required'
            }]
          })(
            <Select
              showSearch
              allowClear
              optionFilterProp="children"
              placeholder="Choose an employee"
              labelInValue
              filterOption={(input, option) => (option.props.children[0].toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.props.children[2].toLowerCase().indexOf(input.toLowerCase()) >= 0)}
            >{listOptions}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="no">
          {getFieldDecorator('no', {
            initialValue: item.no,
            rules: [{
              required: true,
              message: 'Required'
            }]
          })(
            <Input disabled />
          )
          }
        </FormItem>
        <FormItem {...formItemLayout} label="Price">
          {getFieldDecorator('price', {
            initialValue: item.price,
            rules: [{
              required: true,
              message: 'Required',
              pattern: /^([0-9.]{0,13})$/i
            }]
          })(
            <InputNumber
              disabled
              min={0}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Qty">
          {getFieldDecorator('qty', {
            initialValue: item.qty,
            rules: [{
              required: true,
              message: 'Required',
              pattern: /^([0-9]{0,13})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              min={0}
              disabled={!!item.bundleId}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Disc1(%)">
          {getFieldDecorator('disc1', {
            initialValue: item.disc1,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,5})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              disabled
              min={0}
              max={100}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Disc2(%)">
          {getFieldDecorator('disc2', {
            initialValue: item.disc2,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,5})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              disabled
              min={0}
              max={100}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Disc3(%)">
          {getFieldDecorator('disc3', {
            initialValue: item.disc3,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,5})$/i
            }]
          })(
            <InputNumber
              disabled
              defaultValue={0}
              min={0}
              max={100}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Discount Nominal" help="Total - Diskon Nominal">
          {getFieldDecorator('discount', {
            initialValue: item.discount,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,13})$/i
            }]
          })(
            <InputNumber
              disabled
              defaultValue={0}
              min={0}
              max={item.price * item.qty}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Total">
          {getFieldDecorator('total', {
            initialValue: item.total,
            rules: [{
              required: true,
              message: 'Required'
            }]
          })(
            <Input disabled />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

PaymentList.propTypes = {
  form: PropTypes.object.isRequired,
  pos: PropTypes.object,
  item: PropTypes.object,
  DeleteItem: PropTypes.func,
  totalItem: PropTypes.string,
  onChooseItem: PropTypes.func,
  onChangeTotalItem: PropTypes.func
}
export default Form.create()(PaymentList)
