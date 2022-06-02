import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import List from './List'
import Filter from './Filter'
import FilterDetail from './FilterDetail'
import ListDetail from './ListDetail'

const TabPane = Tabs.TabPane

const Counter = ({ taxReportPurchase, taxReportPurchaseDetail, productcategory, productbrand, loading, dispatch, location, app }) => {
  const { list, pagination, selectedRowKeys, activeKey } = taxReportPurchase
  const { list: listDetail, pagination: paginationDetail, selectedRowKeys: selectedRowKeysDetail } = taxReportPurchaseDetail
  const { user, storeInfo } = app
  const { listCategory } = productcategory
  const { listBrand } = productbrand
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'taxReportPurchase/query',
        payload: {
          ...value
        }
      })
      dispatch({
        type: 'taxReportPurchase/updateState',
        payload: {
          selectedRowKeys: []
        }
      })
    },
    deleteItem (selectedRowKeys) {
      dispatch({
        type: 'taxReportPurchase/deleteItem',
        payload: {
          selectedRowKeys
        }
      })
    }
  }

  const filterDetailProps = {
    selectedRowKeys: selectedRowKeysDetail,
    listCategory,
    listBrand,
    onFilterChange (value) {
      dispatch({
        type: 'taxReportPurchaseDetail/query',
        payload: {
          ...value
        }
      })
      dispatch({
        type: 'taxReportPurchaseDetail/updateState',
        payload: {
          selectedRowKeys: []
        }
      })
    },
    deleteItem (selectedRowKeys) {
      dispatch({
        type: 'taxReportPurchaseDetail/deleteItem',
        payload: {
          selectedRowKeys
        }
      })
    }
  }

  const listProps = {
    list,
    selectedRowKeys,
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['taxReportPurchase/query'],
    location,
    editItem (item) {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'taxReportPurchase/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'taxReportPurchase/delete',
        payload: id
      })
    }
  }

  const listDetailProps = {
    list: listDetail,
    selectedRowKeys: selectedRowKeysDetail,
    dataSource: listDetail,
    user,
    storeInfo,
    pagination: paginationDetail,
    loading: loading.effects['taxReportPurchaseDetail/query'],
    location,
    updateSelectedKey (key) {
      dispatch({
        type: 'taxReportPurchaseDetail/updateState',
        payload: {
          selectedRowKeys: key
        }
      })
    },
    editItem (item) {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'taxReportPurchaseDetail/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'taxReportPurchaseDetail/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'taxReportPurchase/changeTab',
      payload: { key }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        page: 1,
        activeKey: key
      }
    }))
    dispatch({ type: 'taxReportPurchase/updateState', payload: { list: [] } })
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Browse" key="1" >
          {activeKey === '1' &&
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane>
        <TabPane tab="Detail" key="2" >
          {activeKey === '2' &&
            <div>
              <FilterDetail {...filterDetailProps} />
              {listDetailProps
                && listDetailProps.dataSource
                && listDetailProps.dataSource.length > 0
                && <ListDetail {...listDetailProps} />}
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  taxReportPurchase: PropTypes.object,
  taxReportPurchaseDetail: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ taxReportPurchase, taxReportPurchaseDetail, productcategory, productbrand, loading, app }) => ({ taxReportPurchase, taxReportPurchaseDetail, productcategory, productbrand, loading, app }))(Counter)
