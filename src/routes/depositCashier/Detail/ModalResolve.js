import { Modal, Form, Select, Button } from 'antd'

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

const ModalResolve = ({
  loading,
  onSubmit,
  onCancel,
  listResolveOption,
  selectedResolve,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  },
  ...modalProps
}) => {
  const handleSubmit = () => {
    validateFields((error) => {
      if (error) return error

      const data = {
        ...getFieldsValue(),
        id: selectedResolve.id
      }

      onSubmit(data)
    })
  }

  return (
    <Modal
      {...modalProps}
      title="Resolve Conflict"
      footer={[
        <Button type="ghost" onClick={onCancel} loading={loading.effects['depositCashier/queryUpdateStatus']} disabled={loading.effects['depositCashier/queryUpdateStatus']}>Cancel</Button>,
        <Button type="primary" onClick={handleSubmit} loading={loading.effects['depositCashier/queryUpdateStatus']} disabled={loading.effects['depositCashier/queryUpdateStatus']}>Submit</Button>
      ]}
    >
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
            <Select
              placeholder="Select Status Resolve"
            >
              {listResolveOption && listResolveOption.length > 0 && listResolveOption.map(record => <Option title={record} value={record} key={record}>{record}</Option>)}
            </Select>
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(ModalResolve)
