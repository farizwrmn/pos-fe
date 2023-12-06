import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import ImportExcel from './ImportExcel'

const TabPane = Tabs.TabPane

const Counter = ({ purchasePrice, purchase, productstock, loading, dispatch, location, app }) => {
  const { list, pagination, modalType, currentItem, activeKey } = purchasePrice
  const { listSupplier } = purchase
  const {
    list: listProduct,
    changed,
    listPrintAllStock,
    stockLoading
  } = productstock
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'purchasePrice/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['purchasePrice/query'] || loading.effects['purchasePrice/add'],
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
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'purchasePrice/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'purchasePrice/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'purchasePrice/changeTab',
      payload: { key }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
    dispatch({ type: 'purchasePrice/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'purchasePrice/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  let timeout
  const formProps = {
    modalType,
    loading,
    listProduct,
    listSupplier,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: `purchasePrice/${modalType}`,
        payload: {
          data,
          reset
        }
      })
    },
    showLov (models, data) {
      if (!data) {
        dispatch({
          type: `${models}/query`,
          payload: {
            pageSize: 5
          }
        })
      }
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }

      timeout = setTimeout(() => {
        dispatch({
          type: `${models}/query`,
          payload: {
            pageSize: 5,
            ...data
          }
        })
      }, 400)
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
        type: 'purchasePrice/updateState',
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

  const importExcelProps = {
    dispatch,
    user,
    storeInfo,
    changed,
    stockLoading,
    listPrintAllStock
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
              <ImportExcel {...importExcelProps} />
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  purchasePrice: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchasePrice, purchase, productstock, loading, app }) => ({ purchasePrice, purchase, productstock, loading, app }))(Counter)
