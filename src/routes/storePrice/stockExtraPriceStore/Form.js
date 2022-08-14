import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Select,
  Spin,
  InputNumber,
  Button,
  Row,
  Col,
  Modal
} from 'antd'
import { getDistPriceName } from 'utils/string'

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
  item = {},
  onSubmit,
  onCancel,
  modalType,
  showLov,
  list,
  listAllStores,
  loading,
  optionSelect = (list || []).length > 0 ? list.map(c => <Option value={c.id} key={c.id} title={`${c.productName} (${c.productCode})`}>{`${c.productName} (${c.productCode})`}</Option>) : [],
  button,
  form: {
    getFieldDecorator,
    validateFields,
    setFieldsValue,
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

  const InputNumberProps = {
    placeholder: '0',
    style: { width: '100%' },
    maxLength: 20
  }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data, resetFields)
          // setTimeout(() => {
          // }, 500)
        },
        onCancel () { }
      })
    })
  }

  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option title={`${x.storeName} (${x.storeCode})`} key={x.id} value={x.id}>{`${x.storeName} (${x.storeCode})`}</Option>)) : []

  const onChangeProduct = (value) => {
    if (value && value.key) {
      // eslint-disable-next-line eqeqeq
      const productFilter = list && list.filter(filtered => filtered.id == value.key)
      if (productFilter && productFilter[0]) {
        const item = productFilter[0]
        setFieldsValue({
          sellPrice: item.sellPrice,
          distPrice01: item.distPrice01,
          distPrice02: item.distPrice02,
          distPrice03: item.distPrice03,
          distPrice04: item.distPrice04,
          distPrice05: item.distPrice05,
          distPrice06: item.distPrice06,
          distPrice07: item.distPrice07,
          distPrice08: item.distPrice08,
          distPrice09: item.distPrice09
        })
      }
    }
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem
            label="Store"
            hasFeedback
            {...formItemLayout}
          >
            {getFieldDecorator('storeId', {
              initialValue: modalType === 'add' ? [] : item.storeId,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <Select
                size="large"
                placeholder="Select Store"

                showSearch
                allowClear
                optionFilterProp="children"

                multiple={modalType === 'add'}
                notFoundContent={loading.effects['userStore/getAllListStores'] ? <Spin size="small" /> : null}
                filterOption={filterOption}
              >
                {childrenTransNo}
              </Select>
            )}
          </FormItem>
          <FormItem label="Product" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productId', {
              initialValue: item.productId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              style={{ width: '100%' }}
              placeholder="Select Product"

              showSearch
              allowClear
              optionFilterProp="children"

              notFoundContent={loading.effects['productstock/query'] ? <Spin size="small" /> : null}
              onSearch={value => showLov('productstock', { q: value })}
              onChange={onChangeProduct}
              filterOption={filterOption}
            >
              {optionSelect}
            </Select>)}
          </FormItem>
          <FormItem label={getDistPriceName('sellPrice')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('sellPrice', {
              initialValue: item.sellPrice,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice01')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice01', {
              initialValue: item.distPrice01,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice02')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice02', {
              initialValue: item.distPrice02,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice03')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice03', {
              initialValue: item.distPrice03,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice04')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice04', {
              initialValue: item.distPrice04,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice05')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice05', {
              initialValue: item.distPrice05,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice06')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice06', {
              initialValue: item.distPrice06,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice07')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice07', {
              initialValue: item.distPrice07,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice08')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice08', {
              initialValue: item.distPrice08,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem label={getDistPriceName('distPrice09')} hasFeedback {...formItemLayout}>
            {getFieldDecorator('distPrice09', {
              initialValue: item.distPrice09,
              rules: [
                {
                  required: true,
                  pattern: /^(?:0|[1-9][0-9]{0,20})$/,
                  message: '0-9'
                }
              ]
            })(<InputNumber {...InputNumberProps} />)}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
            <Button type="primary" onClick={handleSubmit}>{button}</Button>
          </FormItem>
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
