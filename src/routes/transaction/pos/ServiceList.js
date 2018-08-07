import React from 'react'
import PropTypes from 'prop-types'
import { Button, Input, InputNumber, Form, Modal, Select } from 'antd'

const FormItem = Form.Item
const confirm = Modal.confirm
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
}

const PaymentList = ({
  DeleteItem,
  onChooseItem,
  onChangeTotalItem,
  itemService,
  listMechanic,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  },
  ...modalProps }) => {
  const handleTotalChange = () => {
    const data = getFieldsValue()
    let H1 = ((parseFloat(data.price) * parseFloat(data.qty))) * (1 - (data.disc1 / 100))
    let H2 = H1 * (1 - (data.disc2 / 100))
    let H3 = H2 * (1 - (data.disc3 / 100))
    let TOTAL = H3 - data.discount
    data.total = TOTAL
    data.typeCode = itemService.typeCode
    data.productId = itemService.productId
    data.code = itemService.code
    data.name = itemService.name
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
      data.typeCode = itemService.typeCode
      data.productId = itemService.productId
      if (data.employee) {
        data.employeeId = data.employee.key
        data.employeeName = data.employee.label.reduce((cnt, o) => cnt + o, '')
      }
      data.code = itemService.code
      data.name = itemService.name
      const { employee, ...other } = data
      onChooseItem(other)
    })
  }

  const handleDelete = () => {
    const data = {
      Record: itemService.no,
      Payment: 'Delete',
      VALUE: 0
    }
    confirm({
      title: `Remove Record ${data.Record} ?`,
      content: `Record ${data.Record} will remove from list !`,
      onOk () {
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
        (<Button type="danger" onClick={handleDelete} disabled={!(itemService.bundleId !== undefined && itemService.bundleId !== null)}>Void</Button>),
        (<Button type="danger" onClick={handleDelete} disabled={(itemService.bundleId !== undefined && itemService.bundleId !== null)}>Delete</Button>),
        (<Button type="primary" onClick={handleClick}>Submit</Button>)
      ]}
      {...modalProps}
    >
      <Form>
        <FormItem {...formItemLayout} label="Employee">
          {getFieldDecorator('employee', {
            initialValue: itemService.employeeId ? {
              key: itemService.employeeId,
              name: itemService.employeeName
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
            initialValue: itemService.no,
            rules: [{
              required: true,
              message: 'Required'
            }]
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Price">
          {getFieldDecorator('price', {
            initialValue: itemService.price,
            rules: [{
              required: true,
              message: 'Required',
              pattern: /^([0-9.]{0,13})$/i
            }]
          })(
            <InputNumber
              min={0}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Qty">
          {getFieldDecorator('qty', {
            initialValue: itemService.qty,
            rules: [{
              required: true,
              message: 'Required',
              pattern: /^([0-9]{0,13})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              min={0}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Disc1(%)">
          {getFieldDecorator('disc1', {
            initialValue: itemService.disc1,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,5})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              min={0}
              max={100}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Disc2(%)">
          {getFieldDecorator('disc2', {
            initialValue: itemService.disc2,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,5})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              min={0}
              max={100}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Disc3(%)">
          {getFieldDecorator('disc3', {
            initialValue: itemService.disc3,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,5})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              min={0}
              max={100}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Discount Nominal" help="Total - Diskon Nominal">
          {getFieldDecorator('discount', {
            initialValue: itemService.discount,
            rules: [{
              required: true,
              message: 'Invalid',
              pattern: /^([0-9.]{0,13})$/i
            }]
          })(
            <InputNumber
              defaultValue={0}
              min={0}
              max={itemService.total}
              onBlur={value => handleTotalChange(value)}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Total">
          {getFieldDecorator('total', {
            initialValue: itemService.total,
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
  itemService: PropTypes.object,
  totalItem: PropTypes.string,
  onChooseItem: PropTypes.func,
  DeleteItem: PropTypes.func,
  onChangeTotalItem: PropTypes.func
}
export default Form.create()(PaymentList)
