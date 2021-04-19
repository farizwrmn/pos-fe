import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Spin, Select, Button, Row, Col, Modal } from 'antd'

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
  loading,
  showLov,
  listMarketplace,
  listProduct,
  optionSelect = (listProduct || []).length > 0 ? listProduct.map(c => <Option value={c.id} key={c.id} title={`${c.productName} (${c.productCode})`}>{`${c.productName} (${c.productCode})`}</Option>) : [],
  button,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const listMarketplaceOpt = (listMarketplace || []).length > 0 ? listMarketplace.map(c => <Option value={c.id} key={c.id} title={`${c.marketplaceName}`}>{`${c.marketplaceName}`}</Option>) : []
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
      const data = {
        ...getFieldsValue()
      }
      data.productId = data && data.productId && data.productId.key ? data.productId.key : undefined
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(data)
          // setTimeout(() => {
          resetFields()
          // }, 500)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="Marketplace" hasFeedback {...formItemLayout}>
            {getFieldDecorator('marketplaceId', {
              initialValue: item.marketplaceId,
              rules: [{
                required: true,
                message: 'Required'
              }]
            })(<Select
              showSearch
              allowClear
              filterOption={filterOption}
            >{listMarketplaceOpt}
            </Select>)}
          </FormItem>
          <FormItem label="Product" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productId', {
              initialValue: item.productId ? {
                key: item.productId,
                label: `${item.productName} (${item.productCode})`
              } : undefined,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              style={{ width: '250px' }}
              placeholder="Select Product"

              showSearch
              allowClear
              optionFilterProp="children"

              notFoundContent={loading.effects['productstock/query'] ? <Spin size="small" /> : null}
              onSearch={value => showLov('productstock', { q: value })}
              labelInValue
              filterOption={filterOption}
            >
              {optionSelect}
            </Select>)}
          </FormItem>
          <FormItem label="Url" hasFeedback {...formItemLayout}>
            {getFieldDecorator('url', {
              initialValue: item.url,
              rules: [
                {
                  required: true
                }
              ]
            })(<Input maxLength={255} />)}
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
