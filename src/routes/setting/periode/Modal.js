/**
 * Created by Veirry on 22/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button, DatePicker } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const dateFormat = 'YYYY/MM/DD'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}

const modal = ({
  item = {},
  onOk,
  modalButtonCancelClick,
  modalButtonSaveClick,
  form: { getFieldDecorator, validateFields, getFieldsValue },
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
        key: item.key,
      }
      data.userRole = data.userRole.join(' ')
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

  const hdlButtonCancelClick = () => {
    modalButtonCancelClick()
  }
  const hdlButtonSaveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }

      modalButtonSaveClick(data.miscCode, data.miscName, data)
    })

  }


  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="StartDate" {...formItemLayout}>
          {getFieldDecorator('birthDate', {
            initialValue: moment.utc(moment().format(dateFormat), dateFormat),
            rules: [
              {
                required: false,
              },
            ],
          })(<DatePicker format="YYYY-MM-DD" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  modalButtonSaveClick: PropTypes.func,
  modalButtonCancelClick: PropTypes.func,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
