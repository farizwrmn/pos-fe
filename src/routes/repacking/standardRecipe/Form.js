import React from 'react'
import PropTypes from 'prop-types'
import { Form, Table, Button, Row, Col, Modal, Card, Select, Spin } from 'antd'
import ModalMemberTier from './ModalRecipe'

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
  onSubmit,
  onCancel,
  fetching,
  listProduct,
  childrenProduct = listProduct && listProduct.length > 0 ? listProduct.map(x => (<Option key={x.id} title={`${x.productName} (${x.productCode})`}>{`${x.productName} (${x.productCode})`}</Option>)) : [],
  showLov,
  onOpenModalTier,
  modalMemberTierProps,
  modalType,
  button,
  detail,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields
  }
}) => {
  const columnTier = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty'
    }
  ]
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
      const response = {
        header: {
          productId: data.productId
        },
        detail
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit(response, resetFields)
        },
        onCancel () { }
      })
    })
  }

  return (
    <Form layout="horizontal">
      <Card title="Product Recipe" style={{ margin: '10px 0' }}>
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
        </Row>
      </Card>
      <Card
        title={(
          <div>
            <span style={{ marginRight: '10px' }}>Add Material</span>
            <Button type="primary" onClick={() => onOpenModalTier('add')}>Add Item +</Button>
          </div>
        )}
        style={{ margin: '10px 0' }}
      >
        <Table
          dataSource={detail}
          pagination={false}
          bordered
          onRowClick={record => onOpenModalTier('edit', record)}
          columns={columnTier}
          simple
          scroll={{ x: 700 }}
        />
      </Card>
      <FormItem {...tailFormItemLayout}>
        {modalType === 'edit' && <Button type="danger" style={{ margin: '0 10px' }} onClick={handleCancel}>Cancel</Button>}
        <Button type="primary" onClick={handleSubmit}>{button}</Button>
      </FormItem>
      {modalMemberTierProps.visible && <ModalMemberTier {...modalMemberTierProps} />}
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
