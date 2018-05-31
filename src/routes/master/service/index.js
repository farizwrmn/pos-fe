import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Button, Tabs, Row, Col, Menu, Icon, Dropdown, Modal } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const Service = ({ service, loading, dispatch, location, app }) => {
  const { list, listServiceType, modalType, currentItem, activeKey, disable, show, pagination,
    listPrintAllService, showPDFModal, mode, changed, serviceLoading } = service
  const { user, storeInfo } = app
  const filterProps = {
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...value,
          page: 1
        }
      }))
    },
    onResetClick () {
      const { query, pathname } = location
      const { activeKey } = query

      dispatch(routerRedux.push({
        pathname,
        query: {
          page: 1,
          activeKey: activeKey || '0'
        }
      }))
      dispatch({
        type: 'service/updateState',
        payload: {
          searchText: null
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    pagination,
    storeInfo,
    loading: loading.effects['service/query'],
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    editItem (item) {
      dispatch({
        type: 'service/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
    },
    deleteItem (id) {
      dispatch({
        type: 'service/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'service/updateState',
      payload: {
        activeKey: key,
        modalType: 'add',
        currentItem: {},
        disable: ''
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
    dispatch({ type: 'service/resetServiceList' })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'service/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const onShowHideSearch = () => {
    dispatch({
      type: 'service/updateState',
      payload: {
        show: !show
      }
    })
  }

  const onShowPDFModal = (mode) => {
    dispatch({
      type: 'service/updateState',
      payload: {
        showPDFModal: true,
        mode
      }
    })
  }

  const onHidePDFModal = () => {
    dispatch({
      type: 'service/updateState',
      payload: {
        showPDFModal: false,
        changed: false,
        listPrintAllService: []
      }
    })
  }

  const getAllService = () => {
    dispatch({
      type: 'service/queryAllService',
      payload: {
        type: 'all',
        mode
      }
    })
    setTimeout(() => {
      dispatch({
        type: 'service/updateState',
        payload: {
          changed: true
        }
      })
    }, 1000)
  }

  const formProps = {
    listServiceType,
    modalType,
    item: currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `service/${modalType}`,
        payload: {
          id,
          data
        }
      })
    },
    onCancel () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'service/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><Button onClick={() => onShowPDFModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-pdf" />PDF</Button></Menu.Item>
      <Menu.Item key="2"><Button onClick={() => onShowPDFModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-excel" />Excel</Button></Menu.Item>
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => clickBrowse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button><Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown> </div>)

  const PDFModalProps = {
    visible: showPDFModal,
    title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    width: 375,
    onCancel () {
      onHidePDFModal()
    }
  }

  const printProps = {
    user,
    storeInfo
  }

  let buttonClickPDF = (changed && listPrintAllService.length && listPrintAllService.length <= 500) ? (<PrintPDF data={listPrintAllService} name="Print All Service" {...printProps} />) : (<Button disabled={serviceLoading} type="default" size="large" onClick={getAllService} loading={serviceLoading}><Icon type="file-pdf" />Get All Service</Button>)
  let buttonClickXLS = (changed && listPrintAllService.length) ? (<PrintXLS data={listPrintAllService} name="Print All Service" {...printProps} />) : (<Button disabled={serviceLoading} type="default" size="large" onClick={getAllService} loading={serviceLoading}><Icon type="file-pdf" />Get All Service</Button>)
  let notification = (changed && listPrintAllService.length) ? "Click 'Print All Service' to print!" : "Click 'Get All Service' to get all data!"
  let printmode
  if (mode === 'pdf') {
    printmode = (<Row><Col md={12}>{buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintPDF data={list} name="Print Current Page" {...printProps} /></Col></Row>)
  } else {
    printmode = (<Row><Col md={12}>{buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintXLS data={list} name="Print Current Page" {...printProps} /></Col></Row>)
  }

  return (
    <div className="content-inner">
      {showPDFModal && <Modal footer={null} {...PDFModalProps}>
        {printmode}
      </Modal>}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          <Filter {...filterProps} />
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Service.propTypes = {
  service: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ service, loading, app }) => ({ service, loading, app }))(Service)
