import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Form, Modal, DatePicker } from 'antd'

const FormItem = Form.Item
const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

const ModalFilter = ({
  date,
  onDateChange,
  fields,
  onSubmitFilter,
  addOn,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  },
  ...modalProps
}) => {
  let modalOpts = {
    ...modalProps,
    onOk () {
      validateFields((errors) => {
        if (errors) {
          return
        }
        let data = { ...getFieldsValue() }
        onSubmitFilter(data)
      })
    }
  }

  return (
    <Modal {...modalOpts} className="modal-browse-fix-size">
      <Form layout="vertical">
        <FormItem label="Trans Date" {...formItemLayout}>
          {getFieldDecorator('date', {
            initialValue: date,
            rules: [
              { required: true }
            ]
          })(
            <RangePicker onChange={onDateChange} size="large" format="DD-MMM-YYYY" />
          )}
        </FormItem>
        {fields}
        {addOn.map(data =>
          (<FormItem label={data.label} {...formItemLayout}>
            {getFieldDecorator(data.decorator)(data.component)}
          </FormItem>))}
      </Form>
    </Modal>
  )
}

ModalFilter.propTypes = {
  addOn: PropTypes.array
}

ModalFilter.defaultProps = {
  addOn: []
}

export default connect(({ cashier, loading }) => ({ cashier, loading }))(Form.create()(ModalFilter))

