import React from 'react'
import { connect } from 'dva'
import { Button, Dropdown, Icon, Menu, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import Filter from './Filter'
import List from './List'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

function StockFlowReport ({ consignmentStockFlowReport, dispatch, app, loading }) {
  const {
    activeKey,
    list,
    pagination,

    vendorList,
    selectedVendor,
    selectedVendorProduct,
    dateRange,
    selectedProduct,
    consignmentId
  } = consignmentStockFlowReport
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
    loading: loading.effects['consignmentStockFlowReport/query'],
    onFilterChange ({ pagination }) {
      dispatch({
        type: 'consignmentStockFlowReport/updateState',
        payload: {
          pagination
        }
      })
    }
  }

  const filterProps = {
    vendorList,
    selectedVendor,
    selectedVendorProduct,
    dateRange,
    selectedProduct,
    loadingSearchVendor: loading.effects['consignmentStockFlowReport/queryVendor'],
    loading: loading.effects['consignmentStockFlowReport/query'],
    getStockFlowByProduct () {
      dispatch({
        type: 'consignmentStockFlowReport/query',
        payload: {
          stockId: selectedProduct.id
        }
      })
    },
    updateSelectedProduct (value) {
      const product = selectedVendorProduct.filter(filtered => filtered.id === value)
      if (product && product[0]) {
        dispatch({
          type: 'consignmentStockFlowReport/updateState',
          payload: {
            selectedProduct: product[0]
          }
        })
      }
    },
    onSelectVendor (value) {
      const vendor = vendorList.filter(filtered => filtered.id === value)
      if (vendor && vendor[0]) {
        dispatch({
          type: 'consignmentStockFlowReport/queryProductByVendorId',
          payload: {
            selectedVendor: vendor[0],
            selectedProduct: {},
            selectedVendorProduct: []
          }
        })
      }
    },
    searchVendor (value) {
      dispatch({
        type: 'consignmentStockFlowReport/queryVendor',
        payload: {
          q: value,
          selectedProduct: {},
          selectedVendorProduct: []
        }
      })
    },
    updateDateRange (value) {
      dispatch({
        type: 'consignmentStockFlowReport/updateState',
        payload: {
          dateRange: value
        }
      })
    },
    clearVendorList () {
      dispatch({
        type: 'consignmentStockFlowReport/updateState',
        payload: {
          vendorList: []
        }
      })
    }
  }

  const printProps = {
    dataSource: list,
    user,
    dateRange,
    selectedVendor,
    selectedProduct
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

export default connect(({ consignmentStockFlowReport, dispatch, app, loading }) => ({ consignmentStockFlowReport, dispatch, app, loading }))(StockFlowReport)
