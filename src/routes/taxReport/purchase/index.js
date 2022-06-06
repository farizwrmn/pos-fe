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

const Counter = ({ supplier, taxReportPurchase, taxReportPurchaseDetail, productcategory, productbrand, loading, dispatch, location, app }) => {
  const { listSupplier } = supplier
  const { list, pagination, selectedRowKeys, activeKey } = taxReportPurchase
  const { list: listDetail, modalTaxEditorVisible, modalRestoreVisible, listRestore, selectedRowKeysRestore, pagination: paginationDetail, selectedRowKeys: selectedRowKeysDetail } = taxReportPurchaseDetail
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
    loading: loading.effects['taxReportPurchase/query'],
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

  const modalRestoreTableProps = {
    list: listRestore,
    dataSource: listRestore,
    user,
    storeInfo,
    pagination: paginationDetail,
    loading: loading.effects['taxReportPurchaseDetail/queryRestore'],
    location
  }

  const modalTaxEditorProps = {
    visible: modalTaxEditorVisible,
    onOk (data) {
      dispatch({
        type: 'taxReportPurchaseDetail/editTax',
        payload: {
          ...data
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'taxReportPurchaseDetail/updateState',
        payload: {
          modalTaxEditorVisible: false
        }
      })
    }
  }

  const modalRestoreProps = {
    width: 700,
    list: listRestore,
    selectedRowKeys: selectedRowKeysRestore,
    modalRestoreTableProps,
    visible: modalRestoreVisible,
    loading: loading.effects['taxReportPurchaseDetail/queryRestore'],
    maskClosable: false,
    title: 'Restore Transaction',
    confirmLoading: loading.effects['taxReportPurchaseDetail/queryRestore'],
    wrapClassName: 'vertical-center-modal',
    onOk () {
      if (selectedRowKeysRestore) {
        dispatch({
          type: 'taxReportPurchaseDetail/restoreDetail',
          payload: {
            id: selectedRowKeysRestore
          }
        })
      }
    },
    onCancel () {
      dispatch({
        type: 'taxReportPurchaseDetail/updateState',
        payload: {
          selectedRowKeysRestore: [],
          listRestore: [],
          modalRestoreVisible: false
        }
      })
    },
    updateSelectedKey (key) {
      dispatch({
        type: 'taxReportPurchaseDetail/updateState',
        payload: {
          selectedRowKeysRestore: key
        }
      })
    }
  }

  const filterDetailProps = {
    printDetailOpts,
    modalRestoreProps,
    modalTaxEditorProps,
    selectedRowKeys: selectedRowKeysDetail,
    loading: loading.effects['taxReportPurchaseDetail/query'],
    listCategory,
    listBrand,
    listSupplier,
    onShowTaxEditor () {
      dispatch({
        type: 'taxReportPurchaseDetail/updateState',
        payload: {
          modalTaxEditorVisible: true
        }
      })
    },
    onRestoreModal (value) {
      dispatch({
        type: 'taxReportPurchaseDetail/queryRestore',
        payload: {
          ...value
        }
      })
      dispatch({
        type: 'taxReportPurchaseDetail/updateState',
        payload: {
          selectedRowKeysRestore: [],
          modalRestoreVisible: true
        }
      })
    },
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
  supplier: PropTypes.object,
  taxReportPurchase: PropTypes.object,
  taxReportPurchaseDetail: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ supplier, taxReportPurchase, taxReportPurchaseDetail, productcategory, productbrand, loading, app }) => ({ supplier, taxReportPurchase, taxReportPurchaseDetail, productcategory, productbrand, loading, app }))(Counter)
