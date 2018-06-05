import React from 'react'
import { Form, Modal, Button, DatePicker, Select, Input, Row, Col } from 'antd'
import moment from 'moment'
import List from './ListItem'

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
  onVoid,
  onModalVisible,
  modalConfirmVisible,
  form: {
    getFieldDecorator,
    // resetFields,
    validateFields
  },
  ...modalAcceptProps
}) => {
  const childrenEmployee = listEmployee.length > 0 ? listEmployee.map(c => <Option value={c.id} key={c.id}>{c.employeeName}</Option>) : []
  const handleCancel = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      Modal.confirm({
        title: 'Cancel this SellPrice',
        content: 'This action cannot be undone',
        onOk () {
          onVoid(item.id)
        }
      })
    })
  }
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      Modal.confirm({
        title: 'Submit and save data',
        content: 'This action cannot be undone',
        onOk () {
          onOk(item.id, listItem)
        }
      })
    })
  }

  const modalOpts = {
    ...modalAcceptProps,
    onOk: handleOk
  }
  // const resetSelectedField = (value) => {
  //   resetFields([value])
  // }
  const tableAcceptProps = {
    onModalVisible
  }
  return (
    <div>
      <Modal
        width="80%"
        height="80%"
        className="modal-accept"
        footer={[
          <Button type="danger" style={{ align: 'left' }} onClick={() => handleCancel()}>Void</Button>,
          <Button disabled={disableButton} key="submit" type="primary" onClick={() => handleOk()} >Process</Button>
        ]}
        {...modalOpts}
      >
        <Form layout="horizontal">
          <Row>
            <Col lg={12} md={24}>
              <FormItem label="No Trans" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transNo', {
                  initialValue: item.transNo
                })(<Input disabled />)}
              </FormItem>
              <FormItem label="Date" hasFeedback {...formItemLayout}>
                {getFieldDecorator('transDate', {
                  initialValue: item.transDate ? moment.utc(moment(item.transDate).format('YYYY-MM-DD hh:mm:ss'), 'YYYY-MM-DD hh:mm:ss') : ''
                })(<DatePicker placeholder="Select Period" disabled />)}
              </FormItem>
              <FormItem label="PIC" hasFeedback {...formItemLayout}>
                {getFieldDecorator('employeeId', {
                  initialValue: item.employeeId
                })(<Select
                  disabled
                  optionFilterProp="children"
                >
                  {childrenEmployee}
                </Select>)}
              </FormItem>
            </Col>
            <Col lg={12} md={24}>
              <FormItem label="Description" hasFeedback {...formItemLayout}>
                {getFieldDecorator('description', {
                  initialValue: item.description
                })(<TextArea maxLength={200} autosize={{ minRows: 2, maxRows: 3 }} disabled />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
        <List dataSource={listItem || []} {...tableAcceptProps} />
      </Modal>
    </div>
  )
}

export default Form.create()(modal)
