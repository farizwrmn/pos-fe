import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Spin, DatePicker, Checkbox, Button, Row, InputNumber, Col, Modal, message } from 'antd'
import moment from 'moment'
import { getVATPercentage, getDenominatorDppExclude, getDenominatorPPNInclude, getDenominatorPPNExclude } from 'utils/tax'

const FormItem = Form.Item
const { Option } = Select

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

const FormCounter = ({
  dispatch,
  onSubmit,
  onCancel,
  modalType,
  loading,
  listVendor,
  showLov,
  button,
  listBox = [],
  form: {
    setFieldsValue,
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
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

  const handleCancel = () => {
    onCancel()
    resetFields()
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = getFieldsValue()
      if (data.finalPrice <= 0) {
        message.warning('Final price is invalid')
        return
      }
      data.vendorId = data.vendorId && data.vendorId.key ? data.vendorId.key : null
      console.log('data', data)
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
        },
        onCancel () { }
      })
    })
  }

  const onChangeTaxType = (value) => {
    const data = getFieldsValue()
    const subtotal = (data.price || 0) - (data.discount || 0)
    switch (value) {
      case 'E':
        setFieldsValue({
          price: subtotal,
          DPP: subtotal,
          PPN: 0,
          finalPrice: subtotal
        })
        break
      case 'I':
        setFieldsValue({
          price: subtotal,
          DPP: subtotal / getDenominatorDppExclude(),
          PPN: subtotal / getDenominatorPPNInclude(),
          finalPrice: subtotal
        })
        break
      case 'S':
        setFieldsValue({
          price: subtotal,
          DPP: subtotal,
          PPN: subtotal * getDenominatorPPNExclude(),
          finalPrice: subtotal + (subtotal * getDenominatorPPNExclude())
        })
        break

      default:
        break
    }
  }

  const setPrice = (event, code) => {
    const data = getFieldsValue()
    const finalList = listBox.map((item) => {
      if (item.box_code === code) {
        item.selected = event.target.checked
        return item
      }
      return item
    })
    dispatch({
      type: 'rentRequest/updateState',
      payload: {
        listBox: finalList
      }
    })
    const subtotal = finalList.filter(filtered => filtered.selected).reduce((prev, next) => prev + (next.price || 0), 0)
    setFieldsValue({
      price: subtotal,
      finalPrice: subtotal - (data.discount || 0)
    })
    onChangeTaxType(data.taxType)
  }

  const onChangePrice = (value) => {
    const data = getFieldsValue()
    setFieldsValue({
      price: value,
      finalPrice: value - (data.discount || 0)
    })
    onChangeTaxType(data.taxType)
  }

  const onChangeDiscount = (value) => {
    const data = getFieldsValue()
    const subtotal = (data.price || 0)
    setFieldsValue({
      price: subtotal,
      discount: value,
      finalPrice: subtotal - (value || 0)
    })
    onChangeTaxType(data.taxType)
  }

  const disabledDate = (current) => {
    return current < moment(new Date()).add(-1, 'days').endOf('day')
  }

  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const optionSelect = (listVendor || []).length > 0 ? listVendor.map(c => <Option value={c.id} key={c.id} title={`${c.name} (${c.vendor_code})`}>{`${c.name} (${c.vendor_code})`}</Option>) : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Vendor" hasFeedback {...formItemLayout}>
            {getFieldDecorator('vendorId', {
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              style={{ width: '250px' }}
              placeholder="Select Vendor"

              showSearch

              notFoundContent={loading.effects['rentRequest/queryVendor'] ? <Spin size="small" /> : null}
              onSearch={value => showLov('rentRequest', { q: value })}
              labelInValue
              filterOption={filterOption}
            >
              {optionSelect}
            </Select>)}
          </FormItem>
          <FormItem label="Start Date" hasFeedback {...formItemLayout}>
            {getFieldDecorator('startDate', {
              initialValue: moment(),
              rules: [
                {
                  required: true
                }
              ]
            })(<DatePicker
              disabledDate={disabledDate}
            />)}
          </FormItem>
          <FormItem label="Period" hasFeedback {...formItemLayout}>
            {getFieldDecorator('period', {
              initialValue: 1,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber

              min={1}
              max={100}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem label="Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: 0,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber
              onChange={onChangePrice}
              min={0}
              max={9999999999}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem label="Discount" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discount', {
              initialValue: 0,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber
              onChange={onChangeDiscount}
              min={0}
              max={9999999999}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('taxType', {
              initialValue: localStorage.getItem('taxType') ? localStorage.getItem('taxType') : 'E',
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select onChange={value => onChangeTaxType(value)}>
              <Option value="I">Include</Option>
              <Option value="E">Exclude (0%)</Option>
              <Option value="S">Exclude ({getVATPercentage()}%)</Option>
            </Select>)}
          </FormItem>
          <FormItem label="DPP" hasFeedback {...formItemLayout}>
            {getFieldDecorator('DPP', {
              initialValue: 0,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              disabled
              min={0}
              max={9999999999}
              style={{ width: '100%', color: 'black' }}
            />)}
          </FormItem>
          <FormItem label="PPN" hasFeedback {...formItemLayout}>
            {getFieldDecorator('PPN', {
              initialValue: 0,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              disabled
              min={0}
              max={9999999999}
              style={{ width: '100%', color: 'black' }}
            />)}
          </FormItem>
          <FormItem label="Final Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('finalPrice', {
              initialValue: 0,
              rules: [
                {
                  required: true
                }
              ]
            })(<InputNumber
              disabled
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              min={0}
              max={9999999999}
              style={{ width: '100%', color: 'black' }}
            />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
        <Col {...column}>
          <Row>
            {listBox.map((item) => {
              return (
                <Col span={4}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator(`box['${item.box_code}']`, {
                      initialValue: Boolean(item.selected),
                      valuePropName: 'checked'
                    })(<Checkbox onChange={event => setPrice(event, item.box_code)}>
                      {item.box_code}
                      <div>{(item.price || '').toLocaleString()}</div>
                    </Checkbox>)}
                  </FormItem>
                </Col>
              )
            })}
          </Row>
        </Col>
      </Row>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
