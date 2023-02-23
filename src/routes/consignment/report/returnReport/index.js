import React from 'react'
import { connect } from 'dva'
import { Button, Dropdown, Icon, Menu, Tabs } from 'antd'
import moment from 'moment'
import { routerRedux } from 'dva/router'
import Filter from './Filter'
import List from './List'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const TabPane = Tabs.TabPane

function ReturnReport ({ consignmentReturnReport, consignmentVendor, dispatch, app, loading }) {
  const { list, activeKey, dateRange, pagination, consignmentId } = consignmentReturnReport
  const { list: vendorList, selectedVendor } = consignmentVendor
  const { user, storeInfo } = app

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentReturnReport/updateState',
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
    loading: loading.effects['consignmentReturnReport/query'],
    onFilterChange () {
      dispatch({
        type: 'consignmentReturnReport/updateState',
        payload: {
          pagination
        }
      })
    }
  }

  const filterProps = {
    vendorList,
    selectedVendor,
    dateRange,
    loadingSearchVendor: loading.effects['consignmentVendor/query'],
    getData () {
      const from = moment(dateRange[0]).format('YYYY-MM-DD')
      const to = moment(dateRange[1]).format('YYYY-MM-DD')
      dispatch({
        type: 'consignmentReturnReport/query',
        payload: {
          vendorId: selectedVendor.id,
          dateRange,
          from,
          to
        }
      })
    },
    selectVendor (value) {
      const vendor = vendorList.filter(record => record.id === value)[0]
      dispatch({
        type: 'consignmentVendor/updateState',
        payload: {
          selectedVendor: vendor
        }
      })
    },
    searchVendor (value) {
      dispatch({
        type: 'consignmentVendor/query',
        payload: {
          q: value
        }
      })
    },
    updateDateRange (value) {
      dispatch({
        type: 'consignmentReturnReport/updateState',
        payload: {
          dateRange: value
        }
      })
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
    user,
    storeInfo
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
  consignmentReturnReport,
  consignmentVendor,
  dispatch,
  app,
  loading
}) => ({ consignmentReturnReport, consignmentVendor, dispatch, app, loading }))(ReturnReport)
