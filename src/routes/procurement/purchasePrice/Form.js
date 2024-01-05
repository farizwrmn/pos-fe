import React from 'react'
import PropTypes from 'prop-types'
import { Form, InputNumber, Button, Select, Row, Col, Modal, Spin } from 'antd'
import { lstorage } from 'utils'

const { Option } = Select

const FormItem = Form.Item

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
  listProduct,
  listSupplier,
  onCancel,
  modalType,
  showLov,
  loading,
  listStore = lstorage.getListUserStores(),
  button,
  form: {
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
      const data = {
        ...getFieldsValue()
      }
      Modal.confirm({
        title: 'Do you want to save this item?',
        onOk () {
          onSubmit([data], resetFields)
        },
        onCancel () { }
      })
    })
  }

  const listStoreOption = listStore.map(item => (
    <Option value={item.value}>
      {item.label}
    </Option>
  ))

  const optionSelect = (listProduct || []).length > 0 ? listProduct.map(c => <Option value={c.id} key={c.id} title={`${c.productName} (${c.productCode})`}>{`${c.productName} (${c.productCode})`}</Option>) : []
  const supplierData = (listSupplier || []).length > 0 ?
    listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>)
    : []

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          <FormItem label="To Store" hasFeedback {...formItemLayout}>
            {getFieldDecorator('storeIdReceiver', {
              initialValue: item.storeIdReceiver,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              showSearch
            >
              {listStoreOption}
            </Select>)}
          </FormItem>
          <FormItem label="Product" hasFeedback {...formItemLayout}>
            {getFieldDecorator('productId', {
            })(<Select
              style={{ width: '250px' }}
              placeholder="Select Product"

              showSearch
              allowClear
              optionFilterProp="children"

              notFoundContent={loading.effects['productstock/query'] ? <Spin size="small" /> : null}
              onSearch={value => showLov('productstock', { q: value })}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {optionSelect}
            </Select>)}
          </FormItem>
          <FormItem required label="Supplier" {...formItemLayout}>
            {getFieldDecorator('supplierId', {
              initialValue: item.supplierId,
              rules: [
                {
                  required: true
                }
              ]
            })(<Select
              showSearch
              optionFilterProp="children"
              style={{ width: '100%' }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            >
              {supplierData}
            </Select>)}
          </FormItem>
          <FormItem label="Price" hasFeedback {...formItemLayout}>
            {getFieldDecorator('purchasePrice', {
              initialValue: item.purchasePrice,
              rules: [{
                required: true
              }]
            })(
              <InputNumber
                value={0}
                min={0}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleSubmit()
                  }
                }}
              />
            )}
          </FormItem>
          <FormItem label="Disc 1 (%)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discPercent', {
              initialValue: item.discPercent || 0,
              rules: [
                {
                  required: true,
                  pattern: /^([0-9]{0,3})$/i,
                  message: 'Invalid discount'
                }
              ]
            })(
              <InputNumber
                min={0}
                max={100}
                step={1}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleSubmit()
                  }
                }}
              />
            )}
          </FormItem>
          <FormItem label="Disc 2 (%)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discPercent02', {
              initialValue: item.discPercent02 || 0,
              rules: [
                {
                  required: true,
                  pattern: /^([0-9]{0,3})$/i,
                  message: 'Invalid discount'
                }
              ]
            })(
              <InputNumber
                min={0}
                max={100}
                step={1}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleSubmit()
                  }
                }}
              />
            )}
          </FormItem>
          <FormItem label="Disc 3 (%)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discPercent03', {
              initialValue: item.discPercent03 || 0,
              rules: [
                {
                  required: true,
                  pattern: /^([0-9]{0,3})$/i,
                  message: 'Invalid discount'
                }
              ]
            })(
              <InputNumber
                min={0}
                max={100}
                step={1}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleSubmit()
                  }
                }}
              />
            )}
          </FormItem>
          <FormItem label="Disc (N)" hasFeedback {...formItemLayout}>
            {getFieldDecorator('discNominal', {
              initialValue: item.discNominal || 0,
              rules: [
                {
                  required: true
                }
              ]
            })(
              <InputNumber
                min={0}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    handleSubmit()
                  }
                }}
              />
            )}
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
