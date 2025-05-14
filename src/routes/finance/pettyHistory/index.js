import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Form from './Form'

const TabPane = Tabs.TabPane

const Counter = ({ pettyHistory, accountRule, userStore, loading, dispatch, location }) => {
  const { list, modalClosingVisible, currentItemClosing, modalType, currentItem, activeKey } = pettyHistory
  const { listAccountCode, listAccountCodeExpense } = accountRule
  const { listAllTargetStores } = userStore

  const changeTab = (key) => {
    dispatch({
      type: 'pettyHistory/changeTab',
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
    dispatch({ type: 'pettyHistory/updateState', payload: { list: [] } })
  }

  const listProps = {
    dataSource: list
  }

  const modalClosingProps = {
    listAllStores: listAllTargetStores.map(item => ({ value: item.id, label: item.storeName })),
    list,
    visible: modalClosingVisible,
    item: currentItemClosing,
    listAccountCode,
    listAccountCodeExpense,
    loading: loading.effects['pettyExpense/generateExpense'] || loading.effects['pettyExpense/deleteExpenseRequest'],
    onOk (item, reset) {
      dispatch({
        type: 'pettyHistory/closingPeriod',
        payload: {
          item,
          reset
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'pettyHistory/updateState',
        payload: {
          modalClosingVisible: false,
          currentItemClosing: {}
        }
      })
    }
  }

  const formProps = {
    modalClosingProps,
    list,
    listAllStores: listAllTargetStores.map(item => ({ value: item.id, label: item.storeName })),
    listProps,
    modalType,
    loading,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...data
        }
      }))
    },
    onClosing (storeId) {
      dispatch({
        type: 'pettyHistory/updateState',
        payload: {
          modalClosingVisible: true,
          currentItemClosing: {
            storeId
          }
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
        type: 'pettyHistory/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs
        activeKey={activeKey}
        onChange={key => changeTab(key)}
        type="card"
      >
        <TabPane tab="History" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  pettyHistory: PropTypes.object,
  accountRule: PropTypes.object,
  userStore: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pettyHistory, accountRule, userStore, loading, app }) => ({ pettyHistory, accountRule, userStore, loading, app }))(Counter)
