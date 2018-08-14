import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button, Tabs, Row, Col, Icon, Dropdown, Menu } from 'antd'
import List from './List'
import Filter from './Filter'
import FormInput from './Form'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'
import FormMobile from './FormMobile'

const TabPane = Tabs.TabPane

const formCustomer = ({
  item = {},
  onCancel,
  onActivate,
  disabled,
  clickBrowse,
  modalType,
  dataCustomer,
  modalAddUnit,
  addUnit,
  openModal,
  confirmAddUnit,
  cancelUnit,
  confirmSendUnit,
  filterProps,
  printProps,
  tabProps,
  mobileProps,
  listProps
}) => {
  const { show } = filterProps
  const { onShowHideSearch,
    list,
    listPrintAllCustomer,
    changed,
    mode,
    activeKey,
    changeTab,
    customerLoading,
    showPDFModal,
    onShowPDFModal,
    onHidePDFModal,
    getAllCustomer
  } = tabProps
  const change = (key) => {
    changeTab(key)
  }

  const browse = () => {
    clickBrowse()
  }

  const PDFModalProps = {
    visible: showPDFModal,
    title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    width: 375,
    onCancel () {
      onHidePDFModal()
    }
  }

  const changeButton = () => {
    getAllCustomer()
  }

  let buttonClickPDF = (changed && listPrintAllCustomer.length) ? (<PrintPDF data={listPrintAllCustomer} name="Print All Customer" {...printProps} />) : (<Button disabled={customerLoading} type="default" size="large" onClick={changeButton} loading={customerLoading}><Icon type="file-pdf" />Get All Customer</Button>)
  let buttonClickXLS = (changed && listPrintAllCustomer.length) ? (<PrintXLS data={listPrintAllCustomer} name="Print All Customer" {...printProps} />) : (<Button type="default" disabled={customerLoading} size="large" onClick={changeButton} loading={customerLoading}><Icon type="file-pdf" />Get All Customer</Button>)
  let notification = (changed && listPrintAllCustomer.length) ? "Click 'Print All Customer' to print!" : "Click 'Get All Customer' to get all data!"
  let printmode
  if (mode === 'pdf') {
    printmode = (<Row><Col md={12}>{buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintPDF data={list} name="Print Current Page" {...printProps} /></Col></Row>)
  } else {
    printmode = (<Row><Col md={12}>{buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintXLS data={list} name="Print Current Page" {...printProps} /></Col></Row>)
  }

  const openPDFModal = (mode) => {
    onShowPDFModal(mode)
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><Button onClick={() => openPDFModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-pdf" />PDF</Button></Menu.Item>
      <Menu.Item key="2"><Button onClick={() => openPDFModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-excel" />Excel</Button></Menu.Item>
    </Menu>
  )

  let moreButtonTab
  if (activeKey === '0') {
    moreButtonTab = (<Button onClick={() => browse()}>Browse</Button>)
  } else if (activeKey === '1') {
    moreButtonTab = (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button> <Dropdown overlay={menu}>
      <Button style={{ marginLeft: 8 }}>
        <Icon type="printer" /> Print
      </Button>
    </Dropdown> </div>)
  }

  const formMobileProps = {
    onActivate,
    openModal,
    dataCustomer,
    disabled,
    // memberStatus,
    ...mobileProps
  }
  const formOpts = {
    modalType,
    modalAddUnit,
    addUnit,
    confirmAddUnit,
    confirmSendUnit,
    cancelUnit,
    item,
    onCancel,
    disabled,
    activeKey
  }
  return (
    <div>
      {showPDFModal && <Modal footer={null} {...PDFModalProps}>
        {printmode}
      </Modal>}
      <Tabs activeKey={activeKey} onChange={key => change(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <FormInput {...formOpts} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          {activeKey === '1' && (
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          )}
        </TabPane>
        <TabPane tab="Mobile" key="2" >
          <Row>
            <Col span={24}>
              {activeKey === '2' && <FormMobile {...formMobileProps} />}
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div >
  )
}

formCustomer.propTypes = {
  form: PropTypes.object,
  disabled: PropTypes.string,
  item: PropTypes.object,
  listGroup: PropTypes.object.isRequired,
  listType: PropTypes.object.isRequired,
  listCity: PropTypes.object.isRequired,
  listIdType: PropTypes.object.isRequired,
  checkMember: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  clickBrowse: PropTypes.func.isRequired,
  changeTab: PropTypes.func.isRequired,
  activeKey: PropTypes.string.isRequired,
  button: PropTypes.string.isRequired,
  showCustomerGroup: PropTypes.func.isRequired,
  showCustomerType: PropTypes.func.isRequired,
  showIdType: PropTypes.func.isRequired,
  showCity: PropTypes.func
}

export default formCustomer
