import React, { Component } from 'react'
import { Form, Row, Col, Input, Button, message } from 'antd'
import { HELP_NOTIFICATION_COPY, HELP_NOTIFICATION_ERROR } from 'utils/variable'
import { encrypt, generateId } from 'utils/crypt'
import io from 'socket.io-client'
import { APISOCKET } from 'utils/config.company'

const FormItem = Form.Item

const options = {
  upgrade: true,
  transports: ['websocket'],
  pingTimeout: 100,
  pingInterval: 100
}

const socket = io(APISOCKET, options)

class FormItemFingerprint extends Component {
  state = {
    endpoint: null
  }

  componentDidMount () {
    this.setEndpoint()
  }

  componentWillUnmount () {
    const { validationType } = this.props
    const { endpoint } = this.state
    console.log('componentWillUnmount validationType', validationType)
    console.log('componentWillUnmount endpoint', endpoint)
    if (endpoint && validationType === 'login') {
      socket.off(`fingerprint/${endpoint}`)
    }
  }

  onCopy = (endpoint) => {
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
      this.onCopy(endpoint)
    }
    this.setSocket(endpoint)
  }

  setSocket = (endpoint) => {
    const { validationType } = this.props
    if (validationType === 'login' && endpoint) {
      socket.on(`fingerprint/${endpoint}`, this.handleData)
    }
  }

  handleData = (data) => {
    const { dispatch, routing } = this.props

    console.log('handleData', data, routing)
    if (dispatch && data && data.success && routing === 'verification') {
      dispatch({
        type: 'login/successVerify',
        payload: {
          data
        }
      })
      return
    }
    if (dispatch && data && data.success) {
      dispatch({
        type: 'login/loginSuccess',
        payload: {
          data
        }
      })
      console.log('data', data)
      if (data.profile.storeTargetId && data.profile.storeTargetId.length > 0) {
        const encryptedStoreTargetId = encrypt(JSON.stringify(data.profile.storeTargetId))
        localStorage.setItem('tStoreUser', String(encryptedStoreTargetId))
      } else {
        // Clear it if not exists
        localStorage.removeItem('tStoreUser')
      }
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
                onClick={() => this.onCopy(endpoint)}
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
