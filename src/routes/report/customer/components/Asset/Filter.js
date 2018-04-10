import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Card, Icon, Modal } from 'antd'
import ModalBrowse from './Modal'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

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

const Filter = ({
  customer,
  listAsset,
  user,
  storeInfo,
  modalVisible,
  customerInfo,
  openModalCustomer,
  getAllCustomer,
  closeModal,
  onResetClick,
  onSearchClick
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

  const { showChoice, showCustomer } = modalVisible

  const modalChoiceProps = {
    visible: showChoice,
    footer: null,
    width: 375,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      closeModal()
    }
  }

  const modalCustomerProps = {
    customer,
    visible: showCustomer,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      closeModal()
    }
  }

  return (
    <Row>
      <Col {...columnLeft} >
        {showChoice && <Modal {...modalChoiceProps}>
          <Row style={{ marginTop: 30, textAlign: 'center' }}>
            <Col md={12}><Button type="default" size="large" onClick={getAllCustomer}>Find All Customer</Button></Col>
            <Col md={12}><Button type="default" size="large" onClick={openModalCustomer} >Find Customer</Button></Col></Row>
        </Modal>}
        {showCustomer && <ModalBrowse {...modalCustomerProps} />}

        {Object.keys(customerInfo).length > 0 && <Card {...cardProps}>{item}</Card>}
      </Col>
      <Col {...columnRight} style={{ textAlign: 'right' }}>
        <Button
          type="dashed"
          size="large"
          className="button-width02 button-extra-large"
          onClick={onSearchClick}
        >
          <Icon type="search" className="icon-large" />
        </Button>
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
    </Row >
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
  onSearchClick: PropTypes.func
}

export default Filter
