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

const Counter = ({ taxReportSales, taxReportSalesDetail, productcategory, productbrand, loading, dispatch, location, app }) => {
  const { list, pagination, selectedRowKeys, activeKey } = taxReportSales
  const { list: listDetail, pagination: paginationDetail, modalRestoreVisible, listRestore, selectedRowKeysRestore, selectedRowKeys: selectedRowKeysDetail } = taxReportSalesDetail
  const { user, storeInfo } = app
  const { listCategory } = productcategory
  const { listBrand } = productbrand

  const printHeaderOpts = {
    user,
    list,
    storeInfo
  }

  const printDetailOpts = {
    user,
    list: listDetail,
    storeInfo
  }

  const filterProps = {
    printHeaderOpts,
    loading: loading.effects['taxReportSales/query'],
    onFilterChange (value) {
      dispatch({
        type: 'taxReportSales/query',
        payload: {
          ...value
        }
      })
      dispatch({
        type: 'taxReportSales/updateState',
        payload: {
          selectedRowKeys: []
        }
      })
    },
    deleteItem (selectedRowKeys) {
      dispatch({
        type: 'taxReportSales/deleteItem',
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
    loading: loading.effects['taxReportSales/query'],
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
        type: 'taxReportSales/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'taxReportSales/delete',
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
    loading: loading.effects['taxReportSalesDetail/query'],
    location,
    updateSelectedKey (key) {
      dispatch({
        type: 'taxReportSalesDetail/updateState',
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
        type: 'taxReportSalesDetail/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'taxReportSalesDetail/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'taxReportSales/changeTab',
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
    dispatch({ type: 'taxReportSales/updateState', payload: { list: [] } })
  }

  const modalRestoreTableProps = {
    list: listRestore,
    dataSource: listRestore,
    user,
    storeInfo,
    pagination: paginationDetail,
    loading: loading.effects['taxReportSalesDetail/queryRestore'],
    location
  }

  const modalRestoreProps = {
    width: 700,
    list: listRestore,
    selectedRowKeys: selectedRowKeysRestore,
    modalRestoreTableProps,
    visible: modalRestoreVisible,
    loading: loading.effects['taxReportSalesDetail/queryRestore'],
    maskClosable: false,
    title: 'Restore Transaction',
    confirmLoading: loading.effects['taxReportSalesDetail/queryRestore'],
    wrapClassName: 'vertical-center-modal',
    onOk () {
      if (selectedRowKeysRestore) {
        dispatch({
          type: 'taxReportSalesDetail/restoreDetail',
          payload: {
            id: selectedRowKeysRestore
          }
        })
      }
    },
    onCancel () {
      dispatch({
        type: 'taxReportSalesDetail/updateState',
        payload: {
          selectedRowKeysRestore: [],
          listRestore: [],
          modalRestoreVisible: false
        }
      })
    },
    updateSelectedKey (key) {
      dispatch({
        type: 'taxReportSalesDetail/updateState',
        payload: {
          selectedRowKeysRestore: key
        }
      })
    }
  }

  const filterDetailProps = {
    printDetailOpts,
    modalRestoreProps,
    loading: loading.effects['taxReportSalesDetail/query'],
    selectedRowKeys: selectedRowKeysDetail,
    listCategory,
    listBrand,
    onRestoreModal (value) {
      dispatch({
        type: 'taxReportSalesDetail/queryRestore',
        payload: {
          ...value
        }
      })
      dispatch({
        type: 'taxReportSalesDetail/updateState',
        payload: {
          selectedRowKeysRestore: [],
          modalRestoreVisible: true
        }
      })
    },
    onFilterChange (value) {
      dispatch({
        type: 'taxReportSalesDetail/query',
        payload: {
          ...value
        }
      })
      dispatch({
        type: 'taxReportSalesDetail/updateState',
        payload: {
          selectedRowKeys: []
        }
      })
    },
    deleteItem (selectedRowKeys) {
      dispatch({
        type: 'taxReportSalesDetail/deleteItem',
        payload: {
          selectedRowKeys
        }
      })
    }
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
  taxReportSales: PropTypes.object,
  taxReportSalesDetail: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ taxReportSales, taxReportSalesDetail, productcategory, productbrand, loading, app }) => ({ taxReportSales, taxReportSalesDetail, productcategory, productbrand, loading, app }))(Counter)
