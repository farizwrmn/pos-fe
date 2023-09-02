import { Form, Input, Select } from 'antd'
import { STATUS_RESOLVED_ARRAY } from './constant'

const FormItem = Form.Item
const Option = Select.Option

const formItemProps = {
  labelCol: {
    xs: 8,
    sm: 8,
    md: 6,
    lg: 6,
    xl: 6
  },
  wrapperCol: {
    xs: 16,
    sm: 16,
    md: 18,
    lg: 18,
    xl: 18
  }
}

const FormResolve = ({
  listAccountCodeLov,
  form: {
    getFieldDecorator
  }
}) => {
  return (
    <Form horizontal>
      <FormItem label="Status Resolve" {...formItemProps}>
        {getFieldDecorator('statusResolved', {
          rules: [
            {
              required: true,
              message: 'Required!'
            }
          ]
        })(
          <Select>
            {STATUS_RESOLVED_ARRAY && Array.isArray(STATUS_RESOLVED_ARRAY)
              ? STATUS_RESOLVED_ARRAY.map(record => <Option value={record.code} key={record.code}>{record.title}</Option>)
              : []}
          </Select>
        )}
      </FormItem>
      <FormItem label="Payment Account" {...formItemProps}>
        {getFieldDecorator('paymentAccountId', {
          rules: [
            {
              required: true,
              message: 'Required!'
            }
          ]
        })(
          <Select
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
          >
            {listAccountCodeLov && Array.isArray(listAccountCodeLov)
              ? listAccountCodeLov.map(record => <Option value={record.id} key={record.id} title={`${record.accountName} (${record.accountCode})`}>{`${record.accountName} (${record.accountCode})`}</Option>)
              : []}
          </Select>
        )}
      </FormItem>
      <FormItem label="Description" {...formItemProps}>
        {getFieldDecorator('description', {
          rules: [
            {
              required: true,
              message: 'Required!'
            }
          ]
        })(
          <Input />
        )}
      </FormItem>
    </Form>
  )
}

export default FormResolve
