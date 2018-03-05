import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, Card, Icon } from 'antd'
import ModalBrowse from './Modal'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const formItemLayout = {
  labelCol: {
    xs: {
      span: 9
    },
    sm: {
      span: 8
    },
    md: {
      span: 7
    }
  },
  wrapperCol: {
    xs: {
      span: 15
    },
    sm: {
      span: 14
    },
    md: {
      span: 14
    }
  }
}

const columnLeft = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 8 },
  xl: { span: 12 }
}

const columnRight = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 16 },
  xl: { span: 12 }
}

const FormItem = Form.Item

const Filter = ({
  listAsset,
  user,
  storeInfo,
  modalVisible,
  customerInfo,
  openModal,
  onResetClick,
  resetHistory,
  onSearchClick,
  ...modalProps
}) => {
  const printProps = {
    listAsset,
    user,
    storeInfo
  }
  const cardProps = {
    title: `${customerInfo.memberCode}`,
    style: { width: 300 },
    item: (
      <div>
        <Row gutter={16}>
          <Col span={6} >Name</Col>
          <Col span={18}>: {customerInfo.memberName}</Col>
        </Row>
        <Row gutter={16}>
          <Col span={6} >Address</Col>
          <Col span={18}>: {customerInfo.address01}</Col>
        </Row>
      </div>
    )
  }

  const { item } = cardProps

  return (
    <Row>
      <Col {...columnLeft} >
        <FormItem label="Member Code" {...formItemLayout}>
          <Button type="primary" onClick={openModal} >Find Customer</Button>
          {modalVisible && <ModalBrowse {...modalProps} />}
        </FormItem>
        {Object.keys(customerInfo).length > 0 && <Card {...cardProps}>{item}</Card>}
      </Col>
      <Col {...columnRight} style={{ textAlign: 'right' }}>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-lightgrey"
          onClick={onResetClick}
        >
          <Icon type="rollback" className="icon-large" />
        </Button>
        <PrintPDF {...printProps} />
        <PrintXLS {...printProps} />

      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  listPoliceNo: PropTypes.array,
  listServiceType: PropTypes.array,
  modalVisible: PropTypes.bool,
  customerInfo: PropTypes.object,
  openModal: PropTypes.func,
  onResetClick: PropTypes.func,
  resetHistory: PropTypes.func,
  onSearchClick: PropTypes.func
}

export default Form.create()(Filter)
