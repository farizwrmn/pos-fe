import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const BalanceShift = ({ balanceShift, loading, dispatch, location, app }) => {
  const {
    listShift,
    pagination,

    modalType,
    activeKey,
    currentItem
  } = balanceShift
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'balanceShift/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: listShift,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['balanceShift/query'],
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
      dispatch({
        type: 'balanceShift/editItem',
        payload: { item }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
    },
    deleteItem (id) {
      dispatch({
        type: 'balanceShift/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
  }

  const clickBrowse = () => {
    dispatch({
      type: 'balanceShift/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    listShift,
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `balanceShift/${modalType}`,
        payload: data
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
        type: 'balanceShift/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    searchSequence () {
      dispatch({ type: 'balanceShift/query' })
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
          <Filter {...filterProps} />
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  balanceShift,
  loading,
  app
}) => ({
  balanceShift,
  loading,
  app
}))(BalanceShift)
