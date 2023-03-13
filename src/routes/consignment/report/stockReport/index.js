import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Dropdown, Icon, Menu, Tabs } from 'antd'
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
    pagination
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
    dataSource: list,
    user
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )

  const moreButtonTab = (<div>
    <Dropdown overlay={menu}>
      <Button style={{ marginLeft: 8 }}>
        <Icon type="printer" /> Print
      </Button>
    </Dropdown>
  </div>)

  return (
    <div className="content-inner">
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
