import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Modal, Cascader, Checkbox, Button, Row, Col, Popover, Dropdown, Menu, Table, Icon, Collapse } from 'antd'

const FormItem = Form.Item
const Panel = Collapse.Panel

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}

const modal = ({
  onOk,
  listPaymentDetail,
  listPayment,
  memberPrint,
  mechanicPrint,
  posData,
  company,
  ...modalProps
}) => {
  const handleOk = () => {
    const data= {
      posData: posData,
      data: listPaymentDetail.data,
      memberPrint: memberPrint,
      mechanicPrint: mechanicPrint,
      companyPrint: company,
    }
    onOk(data)
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="submit" onClick={() => handleOk()} type="primary" >Print</Button>,
      ]}
    >
      <Form>
        <FormItem label="No" {...formItemLayout}>
          <Input value={listPaymentDetail ? listPaymentDetail.id : ''} />
        </FormItem>
      </Form>
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  onOk: PropTypes.func,
  onChooseItem: PropTypes.func,
  enablePopover: PropTypes.func,
  modalIsEmployeeChange: PropTypes.func
}

export default Form.create()(modal)
