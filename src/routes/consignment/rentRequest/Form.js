import React from 'react'
import PropTypes from 'prop-types'
import { Form, Select, Spin, DatePicker, Checkbox, Button, Row, InputNumber, Col, Modal, message } from 'antd'
import moment from 'moment'
import { getVATPercentage, getDenominatorDppInclude, getDenominatorPPNInclude, getDenominatorPPNExclude } from 'utils/tax'
import { getConsignmentId } from 'utils/lstorage'

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
  user,
  showLov,
  button,
  listBox = [],
  form: {
    setFieldsValue,
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
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
      data.startDate = data.startDate ? moment(data.startDate).format('YYYY-MM-DD') : null

      let selectedBox = []

      for (let key in data.box) {
        const item = data.box[key]
        if (item) {
          selectedBox.push(parseFloat(key))
        }
      }

      if (selectedBox && selectedBox.length === 0) {
        message.error('Select at least 1 box')
        return
      }

      const requestParams = {
        header: {
          outlet_id: getConsignmentId(),
          DPP: parseFloat(parseFloat((((getFieldValue('price') || 0) * (getFieldValue('period') || 0)) - (getFieldValue('discount') || 0)) / (getFieldValue('taxType') === 'I' ? getDenominatorDppInclude() : 1)).toFixed(2)),
          PPN: parseFloat(parseFloat(getFieldValue('taxType') === 'I' ? (((getFieldValue('price') || 0) * (getFieldValue('period') || 0)) - (getFieldValue('discount') || 0)) / getDenominatorPPNInclude() : getFieldValue('taxType') === 'S' ? ((parseFloat((((getFieldValue('price') || 0) * (getFieldValue('period') || 0)) - (getFieldValue('discount') || 0)) / (getFieldValue('taxType') === 'I' ? getDenominatorDppInclude() : 1))) * getDenominatorPPNExclude()) : 0).toFixed(2)),
          discount: data.discount,
          final_price: (((getFieldValue('price') || 0) * (getFieldValue('period') || 0)) - (getFieldValue('discount') || 0)) * (getFieldValue('taxType') === 'S' ? (1 + getDenominatorPPNExclude()) : 1),
          period: data.period,
          price: data.price,
          start_date: data.startDate,
          taxType: data.taxType,
          vendor_id: data.vendorId
        },
        detail: selectedBox
      }

      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(requestParams, resetFields)
        },
        onCancel () { }
      })
    })
  }

  const setPrice = (event, code) => {
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
    const price = finalList
      .filter(filtered => filtered.selected)
      .reduce((prev, next) => prev + (next.price || 0), 0)
    setFieldsValue({
      price
    })
  }


  const disabledDate = (current) => {
    if (user.permissions.role === 'MCON' || user.permissions.role === 'OWN') {
      return false
    }
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
              disabled={!(user.permissions.role === 'MCON' || user.permissions.role === 'OWN')}
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
              disabled={!(user.permissions.role === 'MCON' || user.permissions.role === 'OWN')}
              min={0}
              max={9999999999}
              style={{ width: '100%' }}
            />)}
          </FormItem>
          <FormItem label="Tax Type" hasFeedback {...formItemLayout}>
            {getFieldDecorator('taxType', {
              initialValue: 'S',
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select
              disabled={!(user.permissions.role === 'MCON' || user.permissions.role === 'OWN')}
            >
              <Option value="I">Include</Option>
              <Option value="E">Exclude (0%)</Option>
              <Option value="S">Exclude ({getVATPercentage()}%)</Option>
            </Select>)}
          </FormItem>
          <FormItem label="DPP" hasFeedback {...formItemLayout}>
            <InputNumber
              value={parseFloat(parseFloat((((getFieldValue('price') || 0) * (getFieldValue('period') || 0)) - (getFieldValue('discount') || 0)) / (getFieldValue('taxType') === 'I' ? getDenominatorDppInclude() : 1)).toFixed(2))}
              formatter={value => `${value}`.toLocaleString()}
              disabled
              min={0}
              max={9999999999}
              style={{ width: '100%' }}
            />
          </FormItem>
          <FormItem label="PPN" hasFeedback {...formItemLayout}>
            <InputNumber
              value={parseFloat(parseFloat(getFieldValue('taxType') === 'I' ?
                ((((getFieldValue('price') || 0) * (getFieldValue('period') || 0)) - (getFieldValue('discount') || 0)) / getDenominatorPPNInclude())
                : getFieldValue('taxType') === 'S' ? (parseFloat((((getFieldValue('price') || 0) * (getFieldValue('period') || 0)) - (getFieldValue('discount') || 0)) / (getFieldValue('taxType') === 'I' ? getDenominatorDppInclude() : 1)) * getDenominatorPPNExclude())
                  : 0).toFixed(2))}
              formatter={value => `${value}`.toLocaleString()}
              disabled
              min={0}
              max={9999999999}
              style={{ width: '100%', color: 'black' }}
            />
          </FormItem>
          <FormItem label="Final Price" hasFeedback {...formItemLayout}>
            <InputNumber
              value={(((getFieldValue('price') || 0) * (getFieldValue('period') || 0)) - (getFieldValue('discount') || 0)) * (getFieldValue('taxType') === 'S' ? (1 + getDenominatorPPNExclude()) : 1)}
              disabled
              formatter={value => `${value}`.toLocaleString()}
              min={0}
              max={9999999999}
              style={{ width: '100%', color: 'black' }}
            />
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" disable={loading.effects['rentRequest/add']} onClick={handleSubmit}>{button}</Button>
          </FormItem>
        </Col>
        <Col {...column}>
          <Row>
            {listBox.map((item) => {
              return (
                <Col span={4}>
                  <FormItem {...formItemLayout}>
                    {getFieldDecorator(`box[${item.id}]`, {
                      initialValue: Boolean(item.selected),
                      valuePropName: 'checked'
                    })(<Checkbox disabled={item.disabled} style={{ color: item.disabled ? 'grey' : (item.selected ? 'green' : 'black') }} onChange={event => setPrice(event, item.box_code)}>
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
