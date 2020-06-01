import React, { Component } from 'react'
import {
  LocaleProvider,
  Form,
  Modal
} from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import FormItemFingerprint from 'components/Form/FormItemFingerprint'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
}

class Fingerprint extends Component {
  render () {
    const {
      item = {},
      form: {
        getFieldDecorator
      },
      registerFingerprint,
      dispatch,
      ...modalProps
    } = this.props

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalProps}>
          <FormItemFingerprint
            getFieldDecorator={getFieldDecorator}
            formItemLayout={formItemLayout}
            registerFingerprint={registerFingerprint}
            item={item}
            dispatch={dispatch}
            validationType="login"
            routing="verification"
          />
        </Modal>
      </LocaleProvider>
    )
  }
}

export default Form.create()(Fingerprint)
