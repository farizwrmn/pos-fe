import React, { Component } from 'react'
import {
  LocaleProvider,
  Form,
  Modal,
  Input,
  Row,
  Button,
  Col,
  message
} from 'antd'
import enUS from 'antd/lib/locale-provider/en_US'
import {
  getSubscription
} from 'utils/notification'

const PERMISSION_GRANTED = 'granted'

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 }
}

const FormItem = Form.Item

class Fingerprint extends Component {
  constructor (props) {
    super(props)

    let supported = false
    let granted = false
    if (('Notification' in window) && window.Notification) {
      supported = true
      if (window.Notification.permission === PERMISSION_GRANTED) {
        granted = true
      }
    }

    this.state = {
      supported,
      granted
    }
    // Do not save Notification instance in state
    this.notifications = {}
    this.homeNotification = {}
    this.windowFocus = true
    this.onWindowFocus = this._onWindowFocus.bind(this)
    this.onWindowBlur = this._onWindowBlur.bind(this)
  }

  state = {
    endpoint: null
  }

  componentWillMount () {
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

  setEndpoint = async () => {
    const { granted } = this.state
    if (!granted) {
      await this.askPermission()
    }
    try {
      const subscribe = await getSubscription()
      this.setState({
        endpoint: subscribe && subscribe.endpoint
      })
    } catch (error) {
      message.warning(error)
    }
  }

  _onWindowFocus () {
    this.windowFocus = true
  }

  _onWindowBlur () {
    this.windowFocus = false
  }

  askPermission = () => {
    window.Notification.requestPermission((permission) => {
      let result = permission === PERMISSION_GRANTED
      this.setState({
        granted: result
      }, () => {
        if (!result) {
          Modal.warning({
            title: 'Permission Denied',
            content: 'To use this fingerprint feature, please allow notification'
          })
        }
      })
    })
  }

  render () {
    const {
      item = {},
      form: {
        getFieldDecorator
      },
      ...modalProps
    } = this.props
    const {
      endpoint
    } = this.state

    return (
      <LocaleProvider locale={enUS}>
        <Modal {...modalProps}>
          <FormItem label="Endpoint" {...formItemLayout}>
            {getFieldDecorator('endpoint', {
              initialValue: endpoint,
              valuePropName: 'value'
            })(
              <Row gutter={12}>
                <Col span={20}>
                  <Input disabled value={endpoint} />
                </Col>
                <Col span={4}><Button type="default" shape="circle" icon="copy" onClick={() => this.onCopy()} /></Col>
              </Row>
            )}
          </FormItem>
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
