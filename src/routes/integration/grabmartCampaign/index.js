import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs, Modal } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import AlwaysOnProduct from './AlwaysOnProduct'

const TabPane = Tabs.TabPane

const Counter = ({ grabmartCampaign, productstock, userStore, loading, dispatch, location, app }) => {
  const { list, pagination, listAlwaysOn, modalType, currentItem, activeKey } = grabmartCampaign
  const { listAllStores } = userStore
  const { list: listProduct } = productstock
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'grabmartCampaign/query',
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
    loading: loading.effects['grabmartCampaign/query'],
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
    deleteItem (id) {
      dispatch({
        type: 'grabmartCampaign/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'grabmartCampaign/changeTab',
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
    dispatch({ type: 'grabmartCampaign/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'grabmartCampaign/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    listProduct: listAlwaysOn,
    fetching: loading.effects['productstock/query'],
    listAllStores,
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: `grabmartCampaign/${modalType}`,
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
        type: 'grabmartCampaign/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  let timeout
  const alwaysOnProductProps = {
    listAlwaysOn,
    listProduct,
    loading,
    fetching: loading.effects['productstock/query'],
    showLov (models, data) {
      console.log('showLov', models, data)
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
    onSubmit (data) {
      dispatch({
        type: 'grabmartCampaign/addAlwaysOn',
        payload: {
          data
        }
      })
    },
    deleteItem (item) {
      Modal.confirm({
        title: `Delete ${item.product.productName}`,
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: 'grabmartCampaign/deleteAlwaysOn',
            payload: item.id
          })
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
        <TabPane tab="Always On" key="2">
          {activeKey === '2' && (
            <div>
              <AlwaysOnProduct {...alwaysOnProductProps} />
            </div>
          )}
        </TabPane>
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  grabmartCampaign: PropTypes.object,
  userStore: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ grabmartCampaign, productstock, userStore, loading, app }) => ({ grabmartCampaign, productstock, userStore, loading, app }))(Counter)
