import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Spin, Select, Input, Steps, InputNumber, Row, Col, DatePicker, Form } from 'antd'
import moment from 'moment'

const { TextArea } = Input
const { Option } = Select
const FormItem = Form.Item
const Step = Steps.Step

const formItemLayout = {
  labelCol: {
    xs: { span: 8 },
    sm: { span: 8 },
    md: { span: 7 }
  },
  wrapperCol: {
    xs: { span: 16 },
    sm: { span: 14 },
    md: { span: 14 }
  }
}

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

class FormCounter extends Component {
  state = {
    endOpen: false,
    endOpenWorking: false,
    currentStep: 0,
    firstStep: 'process',
    secondStep: 'wait',
    thirdStep: 'wait',
    finalStep: 'wait'
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open })
  }

  handleStartWorkingOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpenWorking: true })
    }
  }

  handleEndWorkingOpenChange = (open) => {
    this.setState({ endOpenWorking: open })
  }

  goToStepTwo = () => {
    this.setState({
      currentStep: 1,
      firstStep: 'finish',
      secondStep: 'process',
      thirdStep: 'wait',
      finalStep: 'wait'
    })
  }

  goToStepThree = () => {
    this.setState({
      currentStep: 2,
      firstStep: 'finish',
      secondStep: 'finish',
      thirdStep: 'process',
      finalStep: 'wait'
    })
  }

  goToStepFour = () => {
    this.setState({
      currentStep: 3,
      firstStep: 'finish',
      secondStep: 'finish',
      thirdStep: 'finish',
      finalStep: 'process'
    })
  }

  backToStepOne = () => {
    this.setState({
      currentStep: 0,
      firstStep: 'process',
      secondStep: 'wait',
      thirdStep: 'wait',
      finalStep: 'wait'
    })
  }

  backToStepTwo = () => {
    this.setState({
      currentStep: 1,
      firstStep: 'finish',
      secondStep: 'process',
      thirdStep: 'wait',
      finalStep: 'wait'
    })
  }

  backToStepThree = () => {
    this.setState({
      currentStep: 2,
      firstStep: 'finish',
      secondStep: 'finish',
      thirdStep: 'process',
      finalStep: 'wait'
    })
  }

  render () {
    const {
      item = {},
      onSubmit,
      modalType,
      listProduct,
      fetching,
      button,
      form: { getFieldDecorator, getFieldValue, validateFields, getFieldsValue, resetFields },
      listAllStores
    } = this.props
    const tailFormItemLayout = {
      wrapperCol: {
        span: 24,
        xs: {
          offset: modalType === 'edit' ? 10 : 19
        },
        sm: {
          offset: modalType === 'edit' ? 15 : 20
        },
        md: {
          offset: modalType === 'edit' ? 15 : 19
        },
        lg: {
          offset: modalType === 'edit' ? 13 : 18
        }
      }
    }

    const handleSubmit = () => {
      validateFields((errors) => {
        if (errors) {
          return
        }
        const data = {
          ...getFieldsValue()
        }
        data.productType = 'PRODUCT'
        data.availableDate = data.availableDate && data.availableDate.length > 0 ? data.availableDate.toString() : null
        data.availableStore = data.availableStore && data.availableStore.length > 0 ? data.availableStore.toString() : null
        Modal.confirm({
          title: 'Do you want to save this item?',
          onOk () {
            onSubmit(data, resetFields)
          },
          onCancel () { }
        })
      })
    }

    const handleFirstStep = () => {
      validateFields(['name', 'item'], {}, (errors) => {
        if (errors) {
          return
        }
        this.goToStepTwo()
      })
    }

    const handleSecondStep = () => {
      validateFields(['discountType', 'discountCap', 'discountValue'], {}, (errors) => {
        if (errors) {
          return
        }
        this.goToStepThree()
      })
    }

    const handleThirdStep = () => {
      validateFields([
        'availableStore',
        'availableDate',
        'conditionsStartTime',
        'conditionsEndTime',
        'quotasTotalCount',
        'quotasTotalCountPerUser'
      ], {}, (errors) => {
        if (errors) {
          return
        }
        this.goToStepFour()
      })
    }

    const childrenProduct = listProduct.length > 0 ? listProduct.map(x => (<Option key={x.productId}>{`${x.product.productName} (${x.product.productCode})`}</Option>)) : []
    let childrenStore = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.id}>{x.storeName}</Option>)) : []
    const {
      endOpen,
      endOpenWorking,
      currentStep,
      firstStep,
      secondStep,
      thirdStep,
      finalStep
    } = this.state

    return (
      <Form layout="horizontal">
        <Row>
          <Col {...column}>
            <Steps current={currentStep} style={{ marginBottom: '10px' }}>
              <Step status={firstStep} title="Set discount target" />
              <Step status={secondStep} title="Set discount value" />
              <Step status={thirdStep} title="Set conditions" />
              <Step status={finalStep} title="Finish and Memo" />
            </Steps>
            <div style={{ display: currentStep === 0 ? 'initial' : 'none' }}>
              <FormItem label="Campaign Name" hasFeedback={currentStep === 0} {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: item.name,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input maxLength={255} />)}
              </FormItem>
              <FormItem label="Item" hasFeedback={currentStep === 0} {...formItemLayout}>
                {getFieldDecorator('productId', {
                  initialValue: item.productId,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <Select
                    allowClear
                    showSearch
                    size="large"
                    style={{ width: '100%' }}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    placeholder="Choose Product"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {childrenProduct}
                  </Select>
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" onClick={handleFirstStep}>Next</Button>
              </FormItem>
            </div>
            <div style={{ display: currentStep === 1 ? 'initial' : 'none' }}>
              <FormItem label="Discount Type" hasFeedback={currentStep === 1} {...formItemLayout}>
                {getFieldDecorator('discountType', {
                  initialValue: item.discountType || 'net',
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <Select style={{ width: '100%' }} allowClear size="large">
                    <Option value="net">Fixed Value</Option>
                    <Option value="percentage">Percentage</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem label="Discount Value" hasFeedback={currentStep === 1} {...formItemLayout}>
                {getFieldDecorator('discountValue', {
                  initialValue: item.discountValue || 1,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} min={1} />)}
              </FormItem>
              <FormItem label="Discount Limit" hasFeedback={currentStep === 1} {...formItemLayout}>
                {getFieldDecorator('discountCap', {
                  initialValue: item.discountCap || 0,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} min={0} />)}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="default" style={{ marginRight: '10px' }} onClick={this.backToStepOne}>Back</Button>
                <Button type="primary" onClick={handleSecondStep}>Next</Button>
              </FormItem>
            </div>
            <div style={{ display: currentStep === 2 ? 'initial' : 'none' }}>
              <FormItem
                label="Store"
                hasFeedback={currentStep === 2}
                help={(getFieldValue('availableStore') || '').length > 0 ? `${(getFieldValue('availableStore') || '').length} ${(getFieldValue('availableStore') || '').length === 1 ? 'store' : 'stores'}` : 'clear it if available all stores'}
                {...formItemLayout}
              >
                {getFieldDecorator('availableStore', {
                  initialValue: item.availableStore ? (item.availableStore || '').split(',') : []
                })(
                  <Select
                    mode="multiple"
                    allowClear
                    size="large"
                    style={{ width: '100%' }}
                    placeholder="Choose Store"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {childrenStore}
                  </Select>
                )}
              </FormItem>
              <FormItem
                label="Available Days"
                hasFeedback={currentStep === 2}
                help={(getFieldValue('availableDate') || '').length > 0 ? `${(getFieldValue('availableDate') || '').length} ${(getFieldValue('availableDate') || '').length === 1 ? 'day' : 'days'}` : 'clear it if available every day'}
                {...formItemLayout}
              >
                {getFieldDecorator('availableDate', {
                  initialValue: item.availableDate ? (item.availableDate || '').split(',') : [],
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<Select style={{ width: '100%' }} mode="multiple" allowClear size="large">
                  <Option value="1">Monday</Option>
                  <Option value="2">Tuesday</Option>
                  <Option value="3">Wednesday</Option>
                  <Option value="4">Thursday</Option>
                  <Option value="5">Friday</Option>
                  <Option value="6">Saturday</Option>
                  <Option value="7">Sunday</Option>
                </Select>)}
              </FormItem>
              <FormItem label="Start Period" hasFeedback={currentStep === 2} {...formItemLayout}>
                {getFieldDecorator('conditionsStartTime', {
                  initialValue: item.conditionsStartTime,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <DatePicker
                    disabledDate={(startValue) => {
                      const endValue = getFieldValue('conditionsEndTime')
                      if (!startValue || !endValue) {
                        return startValue < moment().startOf('day')
                      }
                      return startValue < moment().startOf('day') || startValue.valueOf() > endValue.valueOf()
                    }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Start"
                    onOpenChange={this.handleStartOpenChange}
                  />
                )}
              </FormItem>
              <FormItem label="End Period" hasFeedback={currentStep === 2} {...formItemLayout}>
                {getFieldDecorator('conditionsEndTime', {
                  initialValue: item.conditionsEndTime,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <DatePicker
                    disabledDate={(endValue) => {
                      const startValue = getFieldValue('conditionsStartTime')
                      if (!endValue || !startValue) {
                        return endValue < moment().startOf('day')
                      }
                      return endValue < moment().startOf('day') || endValue.valueOf() <= startValue.valueOf()
                    }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="End"
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                  />
                )}
              </FormItem>

              <FormItem label="Start Working Hour" hasFeedback={currentStep === 2} {...formItemLayout}>
                {getFieldDecorator('conditionsWorkingHourStartTime', {
                  initialValue: item.conditionsWorkingHourStartTime,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <DatePicker
                    disabledDate={(startValue) => {
                      const endValue = getFieldValue('conditionsWorkingHourEndTime')
                      if (!startValue || !endValue) {
                        return startValue < moment().startOf('day')
                      }
                      return startValue < moment().startOf('day') || startValue.valueOf() > endValue.valueOf()
                    }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="Start"
                    onOpenChange={this.handleStartWorkingOpenChange}
                  />
                )}
              </FormItem>
              <FormItem label="End Working Hour" hasFeedback={currentStep === 2} {...formItemLayout}>
                {getFieldDecorator('conditionsWorkingHourEndTime', {
                  initialValue: item.conditionsWorkingHourEndTime,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(
                  <DatePicker
                    disabledDate={(endValue) => {
                      const startValue = getFieldValue('conditionsWorkingHourStartTime')
                      if (!endValue || !startValue) {
                        return endValue < moment().startOf('day')
                      }
                      return endValue < moment().startOf('day') || endValue.valueOf() <= startValue.valueOf()
                    }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="End"
                    open={endOpenWorking}
                    onOpenChange={this.handleEndWorkingOpenChange}
                  />
                )}
              </FormItem>

              <FormItem label="Quota Count" hasFeedback={currentStep === 2} {...formItemLayout}>
                {getFieldDecorator('quotasTotalCount', {
                  initialValue: item.quotasTotalCount || 1,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} min={1} max={999} />)}
              </FormItem>
              <FormItem label="Quota Count Per User" hasFeedback={currentStep === 2} {...formItemLayout}>
                {getFieldDecorator('quotasTotalCountPerUser', {
                  initialValue: item.quotasTotalCountPerUser || 1,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<InputNumber style={{ width: '100%' }} min={1} max={999} />)}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="default" style={{ marginRight: '10px' }} onClick={this.backToStepTwo}>Back</Button>
                <Button type="primary" onClick={handleThirdStep}>Next</Button>
              </FormItem>
            </div>
            <div style={{ display: currentStep === 3 ? 'initial' : 'none' }}>
              <FormItem label="Memo" hasFeedback={currentStep === 3} {...formItemLayout}>
                {getFieldDecorator('memo', {
                  rules: [
                    {
                      required: true,
                      pattern: /^[a-z0-9/\n _-]{5,255}$/i,
                      message: 'Max 2000 character'
                    }
                  ]
                })(<TextArea maxLength={2000} autosize={{ minRows: 2, maxRows: 6 }} />)}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="default" style={{ marginRight: '10px' }} onClick={this.backToStepThree}>Back</Button>
                <Button type="primary" onClick={handleSubmit}>{button}</Button>
              </FormItem>
            </div>
          </Col>
        </Row>
      </Form >
    )
  }
}


FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
