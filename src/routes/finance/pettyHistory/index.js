import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Form from './Form'

const TabPane = Tabs.TabPane

const Counter = ({ pettyHistory, userStore, loading, dispatch, location }) => {
  const { list, modalType, currentItem, activeKey } = pettyHistory
  const { listAllStores } = userStore

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

  const formProps = {
    list,
    listAllStores,
    listProps,
    modalType,
    loading,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: 'pettyHistory/query',
        payload: {
          ...data
        }
      })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...data
        }
      }))
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
  userStore: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pettyHistory, userStore, loading, app }) => ({ pettyHistory, userStore, loading, app }))(Counter)
