import React from 'react'
import PropTypes from 'prop-types'
import { Form, Table, Button, Row, Col, Modal, Card, Input, Select } from 'antd'
import { lstorage } from 'utils'
import ModalMemberTier from './ModalRecipe'

const { TextArea } = Input
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
  listAllStores,
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
      title: 'No',
      dataIndex: 'no',
      key: 'no'
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (text, record) => {
        return (
          <div>
            <div><strong>{record.productName}</strong></div>
            {record && record.material && record.material.map(item => (
              <div>
                <div style={{ marginLeft: '10px' }}>{item.qty} x {item.productName}</div>
              </div>
            ))}
          </div>
        )
      }
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
      console.log('item', item)
      const response = {
        header: {
          transNo: item.transNo,
          storeIdReceiver: data.storeIdReceiver,
          ...data
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

  let childrenTransNo = listAllStores.length > 0 ? listAllStores.map(x => (<Option key={x.value} value={x.value} title={x.label}>{x.label}</Option>)) : []

  return (
    <Form layout="horizontal">
      <Card title="Header" style={{ margin: '10px 0' }}>
        <Row>
          <Col {...column}>
            <FormItem label="Trans No" hasFeedback {...formItemLayout} >
              {getFieldDecorator('transNo', {
                initialValue: item.transNo,
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Input disabled />
              )}
            </FormItem>
            <FormItem
              label="Store Target"
              hasFeedback
              {...formItemLayout}
            >
              {getFieldDecorator('storeIdReceiver', {
                initialValue: lstorage.getCurrentUserStore(),
                rules: [
                  {
                    required: true
                  }
                ]
              })(
                <Select
                  mode="default"
                  allowClear
                  size="large"
                  showSearch
                  disabled
                  style={{ width: '100%' }}
                  placeholder="Choose Store"
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {childrenTransNo}
                </Select>
              )}
            </FormItem>
            <FormItem label="Description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<TextArea maxLength={255} autosize={{ minRows: 2, maxRows: 3 }} />)}
            </FormItem>
          </Col>
        </Row>
      </Card>
      <Card
        title={(
          <div>
            <span style={{ marginRight: '10px' }}>Request</span>
            <Button type="primary" onClick={() => onOpenModalTier('add')}>Add Item +</Button>
          </div>
        )}
        style={{ margin: '10px 0' }}
      >
        <Table
          dataSource={detail && detail.map((item, index) => ({ no: index + 1, ...item }))}
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
