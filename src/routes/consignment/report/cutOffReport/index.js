import React from 'react'
import { connect } from 'dva'
import { Button, Col, Dropdown, Icon, Menu, Modal, Row, Select, Tabs } from 'antd'
import moment from 'moment'
import Filter from './Filter'
import List from './List'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const TabPane = Tabs.TabPane
const Option = Select.Option

function CutOffReport ({ consignmentCutOffReport, consignmentOutlet, dispatch, app, loading }) {
  const {
    activeKey,
    list,
    periodList,
    consignmentId,
    period,
    showPDFModal,
    mode,
    changed,
    listPrintAllCutOff,
    cutOffLoading
  } = consignmentCutOffReport
  const { list: outletList } = consignmentOutlet
  const { user } = app

  const changeTab = () => {
  }

  if (!consignmentId) {
    return (
      <div>Consignment not linked to this store, please contact your administrator</div>
    )
  }

  const listProps = {
    list,
    outletList,
    loading: loading.effects['consignmentCutOffReport/query'],
    setCutOffReadyForEmail (cutOffDetailId) {
      dispatch({
        type: 'consignmentCutOffReport/setCutOffReadyForEmail',
        payload: {
          id: cutOffDetailId
        }
      })
    }
  }

  const filterProps = {
    period,
    periodList,
    loading: loading.effects['consignmentCutOffReport/query'],
    getData (data) {
      dispatch({
        type: 'consignmentCutOffReport/query',
        payload: {
          period: data.period
        }
      })
    }
  }

  const printProps = {
    user,
    period
  }

  const onShowPDFModal = (mode) => {
    dispatch({
      type: 'consignmentCutOffReport/updateState',
      payload: {
        showPDFModal: true,
        mode
      }
    })
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><Button onClick={() => onShowPDFModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-pdf" />PDF</Button></Menu.Item>
      <Menu.Item key="2"><Button onClick={() => onShowPDFModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-excel" />Excel</Button></Menu.Item>
    </Menu>
  )

  const moreButtonTab = (<div>
    <Dropdown overlay={menu}>
      <Button style={{ marginLeft: 8 }}>
        <Icon type="printer" /> Print
      </Button>
    </Dropdown>
  </div>)

  const PDFModalProps = {
    visible: showPDFModal,
    footer: null,
    width: '600px',
    title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    onCancel () {
      dispatch({
        type: 'consignmentCutOffReport/updateState',
        payload: {
          showPDFModal: false,
          changed: false,
          listPrintAllStock: []
        }
      })
    }
  }

  const getAllCutOff = () => {
    dispatch({
      type: 'consignmentCutOffReport/queryAllCutOff',
      payload: {
        period
      }
    })
  }

  const handleChangePeriod = (period) => {
    console.log('period', period)
    dispatch({
      type: 'consignmentCutOffReport/updateState',
      payload: {
        period,
        listPrintAllCutOff: []
      }
    })
  }

  let buttonClickPDF = (changed && listPrintAllCutOff.length) ? (<PrintPDF dataSource={listPrintAllCutOff} name="Print All Store Cut Off" {...printProps} />) : (<Button type="default" disabled={cutOffLoading || !period} size="default" onClick={getAllCutOff} loading={cutOffLoading}><Icon type="file-pdf" />Get All Store Cut Off</Button>)
  let buttonClickXLS = (changed && listPrintAllCutOff.length) ? (<PrintXLS dataSource={listPrintAllCutOff} name="Print All Store Cut Off" {...printProps} />) : (<Button type="default" disabled={cutOffLoading || !period} size="default" onClick={getAllCutOff} loading={cutOffLoading}><Icon type="file-pdf" />Get All Store Cut Off</Button>)
  let notification = (changed && listPrintAllCutOff.length) ? "Click 'Print All Store Cut Off' to print!" : "Click 'Get All Store Cut Off' to get all data!"

  const periodOption = periodList.length > 0 ? periodList.map(record => (<Option key={record.id} value={record.period}>{moment(record.period, 'YYYY-MM-DD').format('DD MMM YYYY')}</Option>)) : []
  let printMode
  if (mode === 'pdf') {
    printMode = (
      <Row>
        <Col md={16}>
          <Row>
            <Select placeholder="Pilih Periode" style={{ marginBottom: '10px', minWidth: '120px' }} defaultValue={period || undefined} onChange={handleChangePeriod}>
              {periodOption}
            </Select>
            {buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
          </Row>
        </Col>
        <Col md={8}>
          <PrintPDF dataSource={list} name="Print Current Page" {...printProps} />
        </Col>
      </Row>
    )
  } else {
    printMode = (<Row>
      <Col md={16}>
        <Row>
          <Select placeholder="Pilih Periode" style={{ marginBottom: '10px', minWidth: '120px' }} defaultValue={period || undefined} onChange={handleChangePeriod}>
            {periodOption}
          </Select>
          {buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
        </Row>
      </Col>
      <Col md={8}>
        <PrintXLS dataSource={list} name="Print Current Page" {...printProps} />
      </Col>
    </Row>)
  }

  return (
    <div className="content-inner">
      {showPDFModal && (
        <Modal {...PDFModalProps}>
          {printMode}
        </Modal>
      )}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card" tabBarExtraContent={moreButtonTab}>
        <TabPane tab="Report" key="0" >
          {activeKey === '0' &&
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  consignmentCutOffReport,
  consignmentOutlet,
  dispatch,
  app,
  loading
}) => ({ consignmentCutOffReport, consignmentOutlet, dispatch, app, loading }))(CutOffReport)
