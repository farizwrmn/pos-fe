import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Cashier = ({ cashier, user, loading, dispatch, location }) => {
  const { listCashier, modalType, currentItem, activeKey, pagination } = cashier
  const { list } = user
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'cashier/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: listCashier,
    pagination,
    loading: loading.effects['cashier/query'],
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
        type: 'cashier/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'cashier/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'cashier/changeTab',
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
    dispatch({ type: 'cashier/updateState', payload: { listCashier: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'cashier/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    listUser: list,
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `cashier/${modalType}`,
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
        type: 'cashier/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    searchUser () {
      dispatch({ type: 'user/query' })
    }
  }

  let moreButtonTab
  if (activeKey === '0') {
    moreButtonTab = <Button onClick={() => clickBrowse()}>Browse</Button>
  }

  return (
    <div className="content-inner" style={{ clear: 'both' }}>
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

Cashier.propTypes = {
  cashier: PropTypes.object,
  user: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ cashier, user, loading }) => ({ cashier, user, loading }))(Cashier)
