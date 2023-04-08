import { Form, Input, Modal } from 'antd'

const FormItem = Form.Item
const TextArea = Input.TextArea

const FormResolve = ({
  handleResolveModal,
  loading,
  resolveModalVisible,
  onSubmit,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    validateFields((error) => {
      if (error) {
        return error
      }

      const fields = getFieldsValue()
      onSubmit(fields.description)
    })
  }

  const modalProps = {
    visible: resolveModalVisible,
    onOk: handleSubmit,
    confirmLoading: loading.effects['autorecon/resolve'] || loading.effects['autorecon/queryDetail'],
    okText: 'Resolve',
    onCancel: handleResolveModal,
    closeable: false
  }

  return (
    <Modal
      {...modalProps}
    >
      <Form>
        <FormItem label="Keterangan">
          {getFieldDecorator('description', {
            rules: [
              {
                required: true,
                message: '* Required'
              }
            ]
          })(
            <TextArea />
          )}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create()(FormResolve)
