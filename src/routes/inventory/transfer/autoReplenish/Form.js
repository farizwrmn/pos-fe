import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Select, Row, Col, Input, Modal, DatePicker } from 'antd'
import { Link } from 'dva/router'
import { lstorage } from 'utils'
import moment from 'moment'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

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
  modalType,
  listStore,
  listPickingLine,
  loading,
  form: {
    getFieldDecorator,
    getFieldValue,
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
          onSubmit({
            header: {
              pickingLineId: data.pickingLineId,
              storeIdReceiver: data.storeIdReceiver,
              storeId: lstorage.getCurrentUserStore(),
              salesDateFrom: data.salesDate ? data.salesDate[0].format('YYYY-MM-DD') : undefined,
              salesDateTo: data.salesDate ? data.salesDate[1].format('YYYY-MM-DD') : undefined
            }
          }, resetFields)
        },
        onCancel () { }
      })
    })
  }

  let childrenStoreReceived = []
  if (listStore.length > 0) {
    let groupStore = []
    for (let id = 0; id < listStore.length; id += 1) {
      groupStore.push(
        <Option disabled={Number(lstorage.getCurrentUserStore()) === listStore[id].value || getFieldValue('storeIdReceiver') === listStore[id].value} value={listStore[id].value}>
          {listStore[id].label}
        </Option>
      )
    }
    childrenStoreReceived.push(groupStore)
  }

  const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0
  const productStockPickingLine = (listPickingLine || []).length > 0 ? ([{ id: 0, lineName: 'All' }]).concat(listPickingLine).map(b => <Option value={b.id} key={b.id}>{b.lineName}</Option>) : ([{ id: 0, lineName: 'All' }]).map(b => <Option value={b.id} key={b.id}>{b.lineName}</Option>)

  return (
    <div>
      <Row><Link target="_blank" to={'/inventory/transfer/auto-replenish-import'}><Button className="button-add-items-right" style={{ margin: '0px' }} icon="plus" type="default" size="large">Import Buffer</Button></Link></Row>
      <Form layout="horizontal">
        <Row>
          <Col {...column}>
            <FormItem label="From Store" hasFeedback {...formItemLayout}>
              {getFieldDecorator('storeName', {
                initialValue: lstorage.getCurrentUserStoreName(),
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Input disabled />)}
            </FormItem>
            <FormItem label="To Store" hasFeedback {...formItemLayout}>
              {getFieldDecorator('storeIdReceiver', {
                initialValue: item.storeIdReceiver,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                filterOption={filterOption}
              >
                {childrenStoreReceived}
              </Select>)}
            </FormItem>
            <FormItem label={(<Link target="_blank" to="/picking-line">Picking Line</Link>)} hasFeedback {...formItemLayout}>
              {getFieldDecorator('pickingLineId', {
                initialValue: [0],
                rules: [
                  {
                    required: false
                  }
                ]
              })(<Select
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                showSearch
                multiple
              >{productStockPickingLine}
              </Select>)}
            </FormItem>
            <FormItem label="Sales Date" hasFeedback {...formItemLayout}>
              {getFieldDecorator('salesDate', {
                initialValue: [moment().subtract(30, 'days'), moment()],
                rules: [
                  {
                    required: true
                  }
                ]
              })(<RangePicker />)}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" onClick={handleSubmit} disabled={loading.effects['autoReplenish/add']}>Add</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
