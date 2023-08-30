import { Button, Col, Form, Input, Modal, Select } from 'antd'
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
        storeId: lstorage.getCurrentUserStore(),
        ...getFieldsValue()
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
    <Col span={24}>
      <Form layout="horizontal">
        <FormItem label="Shift" {...formItemLayout} hasFeedback>
          {getFieldDecorator('shiftId', {
            rules: [
              {
                required: true,
                message: 'Required'
              }
            ]
          })(
            <Select placeholder="Choose Shift">
              {listShift && listShift.map(record => (<Option value={record.id} key={record.id}>{record.shiftName}</Option>))}
            </Select>
          )}
        </FormItem>
        <FormItem label="Memo" {...formItemLayout} hasFeedback>
          {getFieldDecorator('description')(
            <Input placeholder="Balance Memo (Optional)" />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading.effects['setoran/openBalance']}
            disabled={loading.effects['setoran/openBalance']}
          >
            Open
          </Button>
        </FormItem>
      </Form>
    </Col>
  )
}

export default Form.create()(BalanceCurrentForm)
