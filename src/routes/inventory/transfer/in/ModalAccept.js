import React from 'react'
import { Form, Modal, Button, DatePicker, Select, Input, Row, Col } from 'antd'
import moment from 'moment'
import List from './ListItem'
import ModalConfirm from './ModalConfirm'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

const formItemLayout = {
  labelCol: {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 8 },
    xl: { span: 8 }
  },
  wrapperCol: {
    sm: { span: 24 },
    md: { span: 24 },
    lg: { span: 12 },
    xl: { span: 12 }
  }
}

const modal = ({
  item,
  disableButton,
  sequenceNumber,
  listTransDetail,
  listEmployee,
  getEmployee,
  hideEmployee,
  onOk,
  onOkPrint,
  user,
  storeInfo,
  listItem,
  modalConfirmVisible,
  form: {
    getFieldDecorator,
    // resetFields,
    validateFields,
    getFieldsValue
  },
  ...formConfirmProps,
  ...modalAcceptProps
}) => {
  const childrenEmployee = listEmployee.length > 0 ? listEmployee.map(list => <Option value={list.id}>{list.employeeName}</Option>) : []
  const formConfirmOpts = {
    user,
    storeInfo,
    onOkPrint,
    itemPrint: {
      transNo: getFieldsValue().transNo
    },
    itemHeader: {
      storeId: {
        label: getFieldsValue().storeName
      },
      transNo: getFieldsValue().transNo,
      storeName: {
        label: getFieldsValue().storeNameReceiver
      },
      storeNameSender: {
        label: getFieldsValue().storeNameReceiver
      },
      transDate: moment(getFieldsValue().transDate).format('DD-MM-YYYY'),
      employeeId: {
        key: item.employeeId,
        label: item.employeeName
      },
      employeeReceiver: getFieldsValue().employeeId ? getFieldsValue().employeeId.label : '',
      referenceTrans: item.transNo,
      ...getFieldsValue()
    },
    listItem,
    ...formConfirmProps
  }
  // const handleReset = () => {
  //   resetFields()
  //   resetItem()
  //   onListReset()
  // }

  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue()
      }
      const dataHeader = {
        storeIdSender: item.storeId,
        reference: item.id,
        transType: data.transType,
        employeeId: data.employeeId.key,
        carNumber: item.carNumber,
        totalColly: item.totalColly,
        description: item.description
      }
      const storeId = item.storeIdReceiver
      const detail = listTransDetail
      onOk(dataHeader, detail, storeId)
    })
  }

  const modalOpts = {
    ...modalAcceptProps,
    title: item.transNo,
    onOk: handleOk
  }

  // const resetSelectedField = (value) => {
  //   resetFields([value])
  // }

  return (
    <div>
      <Modal
        footer={[
          <Button disabled={disableButton} key="submit" type="primary" onClick={() => handleOk()} >Process</Button>
        ]}
        {...modalOpts}
      >
        <Form layout="horizontal">
          <Row>
            <Col lg={12} md={24}>
              <FormItem label="No Trans" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transNo', {
                  initialValue: sequenceNumber,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="Date" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transDate', {
                  initialValue: moment.utc(moment(item.transDate).format('YYYY-MM-DD hh:mm:ss'), 'YYYY-MM-DD hh:mm:ss'),
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<DatePicker placeholder="Select Period" disabled />)}
              </FormItem>
              <FormItem label="reference" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transNoReference', {
                  initialValue: item.transNo,
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="Type" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transType', {
                  initialValue: 'MUIN',
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="Received By" hasFeedback {...formItemLayout}>
                {getFieldDecorator('employeeId', {
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Select labelInValue onFocus={getEmployee} onBlur={hideEmployee} >{childrenEmployee}</Select>)}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem label="From Store" hasFeedback {...formItemLayout}>
                {getFieldDecorator('storeName', {
                  initialValue: item.storeName,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="To Store" hasFeedback {...formItemLayout}>
                {getFieldDecorator('storeNameReceiver', {
                  initialValue: item.storeNameReceiver,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="Car Number" hasFeedback {...formItemLayout}>
                {getFieldDecorator('carNumber', {
                  initialValue: item.carNumber,
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="Total Colly" hasFeedback {...formItemLayout}>
                {getFieldDecorator('totalColly', {
                  initialValue: item.totalColly,
                  rules: [
                    {
                      required: true
                    }
                  ]
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="Description" hasFeedback {...formItemLayout}>
                {getFieldDecorator('description', {
                  initialValue: item.description,
                  rules: [
                    {
                      required: false
                    }
                  ]
                })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 3 }} disabled />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <List dataSource={listTransDetail} />
        {modalConfirmVisible && <ModalConfirm {...formConfirmOpts} />}
      </Modal>
    </div>
  )
}

export default Form.create()(modal)
