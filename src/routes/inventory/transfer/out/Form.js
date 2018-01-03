import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button, Tabs, Row, Col, Select } from 'antd'
import Filter from './Filter'
import ListItem from './ListItem'
import Browse from './Browse'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const Option = Select.Option
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 9
  },
}

const col = {
  lg: {
    span: 12,
    offset: 0,
  },
}

const FormAdd = ({
  item = {},
  onSubmit,
  disabled,
  resetItem,
  modalProductVisible,
  button,
  handleCancel,
  listItem,
  listEmployee,
  listStore,
  getEmployee,
  hideEmployee,
  ...listProps,
  ...filterProps,
  ...formProps,
  modalProductProps,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    resetFields,
  },
}) => {
  const handleReset = () => {
    resetItem()
    resetFields()
  }
  const { handleProductBrowse } = modalProductProps
  // const change = (key) => {
  //   changeTab(key)
  // }

  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),
      }
      data.employeeId = data.employeeId.key
      onSubmit(data, listItem)
      // handleReset()
    })
  }
  const childrenEmployee = listEmployee.length > 0 ? listEmployee.map(list => <Option value={list.id}>{list.employeeName}</Option>) : []
  const childrenStore = listStore.length > 0 ? listStore.map(list => <Option value={list.id}>{list.storeName}</Option>) : []
  return (
    <div>
      <Form layout="horizontal">
        <Row>
          <Col {...col}>
            <FormItem label="No. Transfer" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transNo', {
                initialValue: item.transNo,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input disabled maxLength={20} />)}
            </FormItem>
            <FormItem label="reference" hasFeedback {...formItemLayout}>
              {getFieldDecorator('reference', {
                initialValue: item.reference,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Type" hasFeedback {...formItemLayout}>
              {getFieldDecorator('transType', {
                initialValue: 'MUOUT',
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input disabled/>)}
            </FormItem>
            <FormItem label="PIC" hasFeedback {...formItemLayout}>
              {getFieldDecorator('employeeId', {
                initialValue: item.employeeId,
                valuePropName: 'value',                
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select labelInValue={true} onFocus={getEmployee} onBlur={hideEmployee} >{childrenEmployee}</Select>)}
            </FormItem>
            <Button type="primary" size="large" onClick={handleProductBrowse}>Product</Button>
            {modalProductVisible && <Browse {...modalProductProps} />}   
          </Col>
          <Col {...col}>
            <FormItem label="From Store" hasFeedback {...formItemLayout}>
              {getFieldDecorator('storeId', {
                initialValue: item.storeId,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select
                  labelInValue={true}
                  // onFocus={getEmployee}
                  // onBlur={hideEmployee}
                 >
                 {childrenStore}
                 </Select>)}
            </FormItem>
            <FormItem label="To Store" hasFeedback {...formItemLayout}>
              {getFieldDecorator('storeIdReceiver', {
                initialValue: item.storeIdReceiver,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Select
                labelInValue={true}
                // onFocus={getEmployee}
                // onBlur={hideEmployee}
               >
               {childrenStore}
               </Select>)}
            </FormItem>
            <FormItem label="Car Number" hasFeedback {...formItemLayout}>
              {getFieldDecorator('carNumber', {
                initialValue: item.carNumber,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Total Colly" hasFeedback {...formItemLayout}>
              {getFieldDecorator('totalColly', {
                initialValue: item.totalColly,
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="Description" hasFeedback {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: item.description,
                rules: [
                  {
                    required: false,
                  },
                ],
              })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 3 }} />)}
            </FormItem>
          </Col>
        </Row>     
        <ListItem {...listProps} style={{ marginTop: '10px' }}/>
        <FormItem>
          <Button size="large" type="primary" onClick={handleSubmit} style={{ marginTop: '8px', float: 'right' }}>{button}</Button>        
        </FormItem>
      </Form>
    </div>
  )
}

FormAdd.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  resetItem: PropTypes.func,
  // changeTab: PropTypes.func,
  // activeKey: PropTypes.string,
  button: PropTypes.string,
}

export default Form.create()(FormAdd)
