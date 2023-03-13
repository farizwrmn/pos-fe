import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Col, Dropdown, Icon, Menu, Modal, Row, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import Filter from './Filter'
import List from './List'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

function StockReport ({ consignmentStockReport, consignmentVendor, dispatch, app, location, loading }) {
  const {
    activeKey,
    list,
    consignmentId,
    pagination,
    showPDFModal,
    mode,
    listPrintAllStock,
    changed,
    stockLoading
  } = consignmentStockReport
  const {
    list: vendorList
  } = consignmentVendor
  const { user } = app

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentStockReport/updateState',
      payload: {
        activeKey: key
      }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
  }

  if (!consignmentId) {
    return (
      <div>Consignment not linked to this store, please contact your administrator</div>
    )
  }

  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['consignmentStockReport/query'],
    // onChange (page) {
    //   const { query, pathname } = location
    //   dispatch(routerRedux.push({
    //     pathname,
    //     query: {
    //       ...query,
    //       page: page.current,
    //       pageSize: page.pageSize
    //     }
    //   }))
    // }
    onChange ({ pagination }) {
      dispatch({
        type: 'consignmentStockReport/updateState',
        payload: {
          pagination
        }
      })
    }
  }

  const filterProps = {
    vendorList,
    location,
    loadingSearchVendor: loading.effects['consignmentVendor/query'],
    loading: loading.effects['consignmentStockReport/query'],
    onFilterChange (value) {
      const { query, pathname } = location
      const { q, ...other } = query
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...other,
          ...value,
          page: 1
        }
      }))
    },
    searchVendor (q) {
      dispatch({
        type: 'consignmentVendor/query',
        payload: {
          q
        }
      })
    },
    onSelectVendor (id) {
      const vendor = vendorList.filter(filtered => filtered.id === id)
      if (vendor && vendor[0]) {
        dispatch({
          type: 'consignmentStockReport/updateState',
          payload: {
            selectedVendor: vendor[0]
          }
        })
      }
    },
    clearVendorList () {
      dispatch({
        type: 'consignmentVendor/updateState',
        payload: {
          list: []
        }
      })
    }
  }

  const printProps = {
    user
  }

  const onShowPDFModal = (mode) => {
    dispatch({
      type: 'consignmentStockReport/updateState',
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
        type: 'consignmentStockReport/updateState',
        payload: {
          showPDFModal: false,
          changed: false,
          listPrintAllStock: []
        }
      })
    }
  }

  const getAllStock = () => {
    const { query } = location
    dispatch({
      type: 'consignmentStockReport/queryAllStock',
      payload: {
        vendorId: query.vendorId
      }
    })
  }

  let buttonClickPDF = (changed && listPrintAllStock.length) ? (<PrintPDF dataSource={listPrintAllStock} name="Print All Stock" {...printProps} />) : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get All Stock</Button>)
  let buttonClickXLS = (changed && listPrintAllStock.length) ? (<PrintXLS dataSource={listPrintAllStock} name="Print All Stock" {...printProps} />) : (<Button type="default" disabled={stockLoading} size="large" onClick={getAllStock} loading={stockLoading}><Icon type="file-pdf" />Get All Stock</Button>)
  let notification = (changed && listPrintAllStock.length) ? "Click 'Print All Stock' to print!" : "Click 'Get All Stock' to get all data!"

  let printMode
  if (mode === 'pdf') {
    printMode = (
      <Row>
        <Col md={8}>
          {buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
        </Col>
        <Col md={8}>
          <PrintPDF dataSource={list} name="Print Current Page" {...printProps} />
        </Col>
      </Row>
    )
  } else {
    printMode = (<Row>
      <Col md={8}>
        {buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
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
            <div style={{ marginTop: '20px' }}>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

StockReport.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ consignmentStockReport, consignmentVendor, dispatch, app, loading }) => ({ consignmentStockReport, consignmentVendor, dispatch, app, loading }))(StockReport)
