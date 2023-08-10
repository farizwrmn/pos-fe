import { Button, Col, Form, Input, Select } from 'antd'
import TableClose from './TableClose'

const FormItem = Form.Item
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: 8,
    sm: 8,
    md: 4,
    lg: 4,
    xl: 2
  },
  wrapperCol: {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
    xl: 3
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      offset: 19
    },
    sm: {
      offset: 19
    },
    md: {
      offset: 9
    },
    lg: {
      offset: 9
    },
    xl: {
      offset: 4
    }
  }
}

const FormClose = ({
  currentBalance,
  listShift,
  listUser,
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const currentShift = listShift.find(item => item.id === currentBalance.shiftId)

  const tableCloseProps = {
    getFieldDecorator
  }

  const handleSubmit = () => {
    validateFields((error) => {
      if (error) return error

      const data = {
        ...getFieldsValue()
      }

      onSubmit(data)
    })
  }

  return (
    <Col span={24}>
      <Form>
        <FormItem label="Shift" {...formItemLayout} hasFeedback>
          {getFieldDecorator('shift', {
            initialValue: currentShift ? currentShift.id : undefined
          })(
            <Input placeholder="No Shift Detected" disabled />
          )}
        </FormItem>
        <FormItem label="Memo" {...formItemLayout} hasFeedback>
          {getFieldDecorator('memo', {
            initialValue: currentBalance ? currentBalance.memo : undefined
          })(
            <Input placeholder="No Memo Detected" disabled />
          )}
        </FormItem>
        <FormItem label="PIC" {...formItemLayout} hasFeedback>
          {getFieldDecorator('pic')(
            <Select
              placeholder="Select PIC for this shift"
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {listUser && listUser.map(item => (<Option value={item.id} key={item.id}>{item.userName}</Option>))}
            </Select>
          )}
        </FormItem>
        <TableClose {...tableCloseProps} />
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={handleSubmit}>Close</Button>
        </FormItem>
      </Form>
    </Col>
  )
}

export default Form.create()(FormClose)
