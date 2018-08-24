import React from 'react'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Tabs, Button, Icon, Dropdown, Menu, Row, Col, Modal } from 'antd'
import { DataTable } from './../components'
import FormBrand from './Form'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const Brand = ({ car, app, loading, dispatch, location }) => {
  const { listBrand, activeKey, pagination, currentItem, formType, printType, changed,
    showPrintModal, listPrintAllBrands, queryLoading } = car
  const { user, storeInfo } = app
  const changeTab = (key) => {
    dispatch({
      type: 'car/updateState',
      payload: {
        activeKey: key,
        currentItem: {},
        formType: 'add'
      }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: key === '1' ? { ...query, activeKey: key } : { activeKey: key }
    }))
  }

  const formProps = {
    item: currentItem,
    formType,
    onSubmit (data) {
      let id = currentItem.id
      if (id) {
        dispatch({ type: 'car/updateBrandOfCars', payload: { id, ...data } })
      } else {
        dispatch({ type: 'car/addBrandOfCars', payload: data })
      }
    },
    onCancel () {
      dispatch({
        type: 'car/updateState',
        payload: {
          activeKey: '1',
          currentItem: {}
        }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 1
        }
      }))
    }
  }

  const listProps = {
    dataSource: listBrand,
    pagination,
    loading: loading.effects['car/queryBrandsOfCars'],
    headers: [{ title: 'Name', key: 'brandName' }],
    module: 'brand',
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
        type: 'car/updateState',
        payload: {
          activeKey: '0',
          currentItem: item,
          formType: 'edit'
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
        type: 'car/deleteBrandOfCars',
        payload: { id }
      })
    }
  }

  const filterProps = {
    onSearchByKeyword (q) {
      const { query, pathname } = location
      const { activeKey } = query
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey,
          q
        }
      }))
    },
    onResetFilter () {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          page: 1,
          activeKey: 1,
          pageSize: query.pageSize || 10
        }
      }))
    }
  }

  const clickBrowse = () => {
    dispatch({
      type: 'car/updateState',
      payload: {
        activeKey: '1'
      }
    })
    const { pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: { activeKey: 1 }
    }))
  }

  const onShowPrintModal = (printType) => {
    dispatch({
      type: 'car/updateState',
      payload: {
        showPrintModal: true,
        printType
      }
    })
  }

  const onHidePrintModal = () => {
    dispatch({
      type: 'car/updateState',
      payload: {
        showPrintModal: false,
        changed: false,
        listPrintAllBrands: []
      }
    })
  }

  const getAllBrands = () => {
    if (printType === 'pdf') {
      dispatch({
        type: 'car/checkLengthOfBrands',
        payload: {
          page: 51,
          pageSize: 10
        }
      })
    } else {
      dispatch({
        type: 'car/queryAllBrands',
        payload: {
          type: 'all'
        }
      })
    }
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><Button onClick={() => onShowPrintModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-pdf" />PDF</Button></Menu.Item>
      <Menu.Item key="2"><Button onClick={() => onShowPrintModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-excel" />Excel</Button></Menu.Item>
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => clickBrowse()}>Browse</Button> : (<Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown>)

  const printModalProps = {
    visible: showPrintModal,
    title: printType === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    width: 375,
    onCancel () {
      onHidePrintModal()
    }
  }

  const printProps = {
    user,
    storeInfo
  }

  let buttonClickPDF = (changed && listPrintAllBrands.length) ? (<PrintPDF data={listPrintAllBrands} name="Print All Brands" {...printProps} />) : (<Button disabled={queryLoading} type="default" size="large" onClick={getAllBrands} loading={queryLoading}><Icon type="file-pdf" />Get All Brands</Button>)
  let buttonClickXLS = (changed && listPrintAllBrands.length) ? (<PrintXLS data={listPrintAllBrands} name="Print All Brands" {...printProps} />) : (<Button disabled={queryLoading} type="default" size="large" onClick={getAllBrands} loading={queryLoading}><Icon type="file-pdf" />Get All Brands</Button>)
  let notification = (changed && listPrintAllBrands.length) ? "Click 'Print All Brands' to print!" : "Click 'Get All Brands' to get all data!"
  let type
  if (printType === 'pdf') {
    type = (<Row><Col md={12}>{buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintPDF data={listBrand} name="Print Current Page" {...printProps} /></Col></Row>)
  } else {
    type = (<Row><Col md={12}>{buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p></Col>
      <Col md={12}><PrintXLS data={listBrand} name="Print Current Page" {...printProps} /></Col></Row>)
  }

  return (
    <div className="content-inner">
      {showPrintModal && <Modal footer={null} {...printModalProps}>
        {type}
      </Modal>}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <FormBrand {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          {activeKey === '1' &&
            <div>
              <Filter {...filterProps} />
              <DataTable {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ car, app, loading }) => ({ car, app, loading }))(Brand)
