import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import FilterDetail from './FilterDetail'
import ListDetail from './ListDetail'

const TabPane = Tabs.TabPane

const Counter = ({ taxReportSales, taxReportSalesDetail, productcategory, productbrand, loading, dispatch, location, app }) => {
  const { list, pagination, selectedRowKeys, modalType, currentItem, activeKey } = taxReportSales
  const { list: listDetail, pagination: paginationDetail, selectedRowKeys: selectedRowKeysDetail } = taxReportSalesDetail
  const { user, storeInfo } = app
  const { listCategory } = productcategory
  const { listBrand } = productbrand
  const filterProps = {
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

  const filterDetailProps = {
    selectedRowKeys: selectedRowKeysDetail,
    listCategory,
    listBrand,
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

  const clickBrowse = () => {
    dispatch({
      type: 'taxReportSales/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: `taxReportSales/${modalType}`,
        payload: {
          data,
          reset
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
        type: 'taxReportSales/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  let moreButtonTab
  if (activeKey === '0') {
    moreButtonTab = <Button onClick={() => clickBrowse()}>Browse</Button>
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
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
              <ListDetail {...listDetailProps} />
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
