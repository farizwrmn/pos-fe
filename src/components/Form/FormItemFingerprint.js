import React, { Component } from 'react'
import { Form, Row, Col, Input, Button, message } from 'antd'
import { HELP_NOTIFICATION_COPY, HELP_NOTIFICATION_ERROR } from 'utils/variable'
import { generateId } from 'utils/crypt'

const FormItem = Form.Item

class FormItemFingerprint extends Component {
  state = {
    endpoint: null
  }

  componentDidMount () {
    this.setEndpoint()
  }

  onCopy = () => {
    const {
      endpoint
    } = this.state
    let textarea = document.createElement('textarea')
    textarea.id = 'temp_element'
    textarea.style.height = 0
    document.body.appendChild(textarea)
    textarea.value = endpoint
    let selector = document.querySelector('#temp_element')
    selector.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    message.success('Success to key to clipboard')
  }

  setEndpoint = () => {
    const {
      registerFingerprint,
      validationType = 'hris',
      item
    } = this.props
    const endpoint = generateId(16)
    this.setState({
      endpoint
    })
    if (registerFingerprint) {
      registerFingerprint({
        employeeId: item.id,
        endpoint,
        validationType,
        applicationSource: 'web'
      })
    }
  }

  render () {
    const {
      getFieldDecorator,
      formItemLayout
    } = this.props
    const {
      endpoint
    } = this.state

    return (
      <FormItem
        label="Endpoint"
        help={endpoint ? HELP_NOTIFICATION_COPY : HELP_NOTIFICATION_ERROR}
        validateStatus={endpoint ? 'success' : 'error'}
        {...formItemLayout}
      >
        {getFieldDecorator('endpoint', {
          initialValue: endpoint,
          valuePropName: 'value'
        })(
          <Row gutter={12}>
            <Col span={20}>
              <Input disabled value={endpoint} />
            </Col>
            <Col span={4}>
              <Button
                disabled={!endpoint}
                type="default"
                shape="circle"
                icon="copy"
                onClick={() => this.onCopy()}
              />
            </Col>
          </Row>
        )}
      </FormItem>
    )
  }
}

FormItemFingerprint.defaultProps = {
  formItemLayout: {
    labelCol: {
      xs: { span: 11 },
      sm: { span: 8 },
      md: { span: 7 }
    },
    wrapperCol: {
      xs: { span: 13 },
      sm: { span: 14 },
      md: { span: 14 }
    }
  }
}

export default FormItemFingerprint
