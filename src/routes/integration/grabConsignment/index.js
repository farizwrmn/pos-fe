import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs, Modal } from 'antd'
import List from './List'

const TabPane = Tabs.TabPane

const GrabConsignment = ({ grabConsignment, grabCategory, loading, dispatch, location, app }) => {
  const { list, pagination, activeKey, selectedRowKeys, currentItemCategory, modalCategoryVisible } = grabConsignment
  const { list: listGrabCategory } = grabCategory
  const { user, storeInfo } = app

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      dispatch({
        type: 'grabConsignment/updateState',
        payload: {
          selectedRowKeys
        }
      })
    }
  }

  const modalCategoryProps = {
    item: currentItemCategory,
    visible: modalCategoryVisible,
    selectedRowKeys,
    listGrabCategory,
    onOk (data, reset) {
      dispatch({
        type: 'grabConsignment/updateCategory',
        payload: {
          data, reset
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'grabConsignment/updateState',
        payload: {
          modalCategoryVisible: false,
          currentItemCategory: {}
        }
      })
    }
  }

  const listProps = {
    modalCategoryVisible,
    modalCategoryProps,
    rowSelection,
    listGrabCategory,
    selectedRowKeys,
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['grabConsignment/query'] || loading.effects['grabConsignment/updateValidate'] || loading.effects['grabConsignment/updateCategory'],
    location,
    onSave () {
      Modal.confirm({
        title: 'Approve this selected items',
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: 'grabConsignment/updateValidate',
            payload: {
              data: {
                productId: selectedRowKeys
              }
            }
          })
        }
      })
    },
    onClicGrabCategory () {
      dispatch({
        type: 'grabConsignment/updateState',
        payload: {
          modalCategoryVisible: true
        }
      })
    },
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
        type: 'grabConsignment/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'grabConsignment/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'grabConsignment/changeTab',
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
    dispatch({ type: 'grabConsignment/updateState', payload: { list: [] } })
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Browse" key="0" >
          {activeKey === '0' &&
            <div>
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

GrabConsignment.propTypes = {
  grabCategory: PropTypes.object,
  grabConsignment: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ grabCategory, grabConsignment, loading, app }) => ({ grabCategory, grabConsignment, loading, app }))(GrabConsignment)
