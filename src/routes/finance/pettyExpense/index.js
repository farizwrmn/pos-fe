import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Counter = ({ pettyExpense, accountCode, loading, dispatch, location, app }) => {
  const { list, pagination, activeKey, currentItemExpense, modalExpenseVisible } = pettyExpense
  const { listAccountCodeExpense } = accountCode
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'pettyExpense/query',
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
    loading: loading.effects['pettyExpense/query'],
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
        type: 'pettyExpense/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'pettyExpense/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'pettyExpense/changeTab',
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
    dispatch({ type: 'pettyExpense/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'pettyExpense/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const modalExpenseProps = {
    item: currentItemExpense,
    visible: modalExpenseVisible,
    listAccountCode: listAccountCodeExpense,
    loading: loading.effects['pettyExpense/generateExpense'] || loading.effects['pettyExpense/deleteExpense'],
    onSubmit (item) {
      dispatch({
        type: 'pettyExpense/generateExpense',
        payload: {
          item
        }
      })
    },
    onCancel (item) {
      dispatch({
        type: 'pettyExpense/deleteExpense',
        payload: {
          item
        }
      })
    }
  }

  const formProps = {
    list,
    loading: loading.effects['pettyExpense/generateExpense'],
    modalExpenseProps,
    handleClick () {
      dispatch({
        type: 'pettyExpense/updateState',
        payload: {
          modalExpenseVisible: true
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
  accountCode: PropTypes.object,
  pettyExpense: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pettyExpense, accountCode, loading, app }) => ({ pettyExpense, accountCode, loading, app }))(Counter)
