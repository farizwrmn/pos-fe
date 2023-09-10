import { Button, Form, Input, Modal, Select } from 'antd'
import { lstorage } from 'utils'

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
    xs: 16,
    sm: 16,
    md: 20,
    lg: 20,
    xl: 22
  }
}

const tailFormItemLayout = {
  wrapperCol: {
    // span: 24,
    xs: {
      offset: 15
    },
    sm: {
      offset: 15
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

const BalanceCurrentForm = ({
  loading,
  listShift,
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    validateFields((error) => {
      if (error) return error

      const data = {
        ...getFieldsValue(),
        storeId: lstorage.getCurrentUserStore()
      }

      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk: () => {
          onSubmit(data)
        }
      })
    })
  }

  return (
    <Form horizontal>
      <FormItem label="Shift" {...formItemLayout} hasFeedback>
        {getFieldDecorator('shiftId', {
          rules: [
            {
              required: true,
              message: 'Required'
            }
          ]
        })(
          <Select
            placeholder="Choose Shift"
            style={{
              maxWidth: '250px'
            }}
          >
            {listShift && listShift.map(record => (<Option value={record.id} key={record.id}>{record.shiftName}</Option>))}
          </Select>
        )}
      </FormItem>
      <FormItem label="Memo" {...formItemLayout} hasFeedback>
        {getFieldDecorator('description')(
          <Input
            placeholder="Balance Memo (Optional)"
            style={{
              maxWidth: '250px'
            }}
          />
        )}
      </FormItem>
      <FormItem {...tailFormItemLayout}>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={loading.effects['deposit/openBalance']}
          disabled={loading.effects['deposit/openBalance']}
          style={{ maxWidth: '100px' }}
        >
          Open
        </Button>
      </FormItem>
    </Form>
  )
}

export default Form.create()(BalanceCurrentForm)
