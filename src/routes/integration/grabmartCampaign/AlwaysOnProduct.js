import React from 'react'
import { Form, Row, Modal, Col, Icon, Spin, Select, Button } from 'antd'

const FormItem = Form.Item
const { Option } = Select

const formItemLayout = {
  style: {
    marginTop: 8
  },
  labelCol: {
    xs: { span: 9 },
    sm: { span: 8 },
    md: { span: 8 },
    lg: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 15 },
    sm: { span: 16 },
    md: { span: 16 },
    lg: { span: 16 }
  }
}

const column = {
  md: { span: 24 },
  lg: { span: 12 }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 24,
    xs: {
      offset: 19
    },
    sm: {
      offset: 20
    },
    md: {
      offset: 19
    },
    lg: {
      offset: 18
    }
  }
}

const AlwaysOnProduct = ({
  listAlwaysOn = [],
  listProduct = [],
  fetching,
  deleteItem,
  loading,
  showLov,
  onSubmit,
  form: { getFieldDecorator, validateFields, getFieldsValue, resetFields }
}) => {
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
        },
        onCancel () { }
      })
    })
  }

  const childrenProduct = listProduct.length > 0 ? listProduct.map(x => (<Option key={x.id}>{`${x.productName} (${x.productCode})`}</Option>)) : []

  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...column}>
            <FormItem label="Product" hasFeedback {...formItemLayout} >
              {getFieldDecorator('productId', {
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  onSearch={value => showLov('productstock', { q: value })}
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
          </Col>
          <Col {...column} />
        </Row>
        <FormItem {...tailFormItemLayout}>
          <Button
            type="primary"
            disabled={
              loading.effects['grabmartCampaign/addAlwaysOn']
              || loading.effects['grabmartCampaign/queryAlwaysOn']
            }
            onClick={handleSubmit}
          >Add</Button>
        </FormItem>
      </Form>
      {listAlwaysOn && listAlwaysOn.length > 0 ? listAlwaysOn.map((item, index) => {
        return (
          <div style={{ margin: '20px 0' }}>
            <Icon style={{ margin: '0 10px', color: 'red' }} type="close" onClick={() => deleteItem(item)} />
            {`${index + 1}. ${item.product.productCode} - ${item.product.productName}`}
          </div>
        )
      }) : null}
    </div>
  )
}

export default Form.create()(AlwaysOnProduct)
