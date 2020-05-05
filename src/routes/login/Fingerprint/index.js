import React, { Component } from 'react'
import {
  LocaleProvider,
  Form,
  Modal,
  Input,
  Row,
  Button,
  Col
} from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import FormItemFingerprint from 'components/Form/FormItemFingerprint'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
}

const FormItem = Form.Item

class Fingerprint extends Component {
  render () {
    const {
      item = {},
      form: {
        getFieldDecorator
      },
      ...modalProps
    } = this.props

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalProps}>
          <FormItemFingerprint
            getFieldDecorator={getFieldDecorator}
          />
          <FormItem label="Username" hasFeedback {...formItemLayout}>
            {getFieldDecorator('userId', {
              initialValue: item.userId
            })(
              <Row gutter={12}>
                <Col span={20}>
                  <Input autoFocus id="userId" size="large" placeholder="Username" />
                </Col>
                <Col span={4}><Button type="primary" shape="circle" icon="search" /></Col>
              </Row>
            )}
          </FormItem>
        </Modal>
      </LocaleProvider>
    )
  }
}

export default Form.create()(Fingerprint)
