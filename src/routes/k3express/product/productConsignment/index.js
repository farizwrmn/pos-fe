import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Counter = ({ expressProductBrand, expressProductConsignment, expressProductCategory, loading, dispatch, location, app }) => {
  const { list, listLov: listProductConsignment, pagination, modalType, currentItem, activeKey, productDetail } = expressProductConsignment
  const { listLov: listK3ExpressCategory } = expressProductCategory
  const { listLov: listBrand } = expressProductBrand
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'expressProductConsignment/query',
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
    loading: loading.effects['expressProductConsignment/query'],
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
        type: 'expressProductConsignment/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'expressProductConsignment/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'expressProductConsignment/changeTab',
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
    dispatch({ type: 'expressProductConsignment/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'expressProductConsignment/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    listBrand,
    listK3ExpressCategory,
    listProductConsignment,
    productDetail,
    modalType,
    dispatch,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    editItem (item) {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'expressProductConsignment/editItem',
        payload: { item }
      })
    },
    onSubmit (data, reset) {
      console.log(modalType)
      dispatch({
        type: `expressProductConsignment/${modalType}`,
        payload: {
          data,
          reset
        }
      })
    },
    onGetDetail (value) {
      dispatch({ type: 'expressProductConsignment/queryProduct', payload: { productCode: value } })
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
        type: 'expressProductConsignment/updateState',
        payload: {
          currentItem: {},
          modalType: 'add'
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
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  expressProductConsignment: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({
  expressProductBrand,
  expressProductCategory,
  expressProductConsignment,
  loading,
  app }) => ({ expressProductBrand, expressProductCategory, expressProductConsignment, loading, app }))(Counter)
