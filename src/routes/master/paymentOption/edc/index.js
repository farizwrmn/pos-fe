import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Counter = ({ paymentOpts, paymentEdc, accountRule, loading, dispatch, location, app }) => {
  const { listPayment, pagination, modalType, currentItem, activeKey } = paymentEdc
  const { listOpts } = paymentOpts
  const { listAccountCode } = accountRule
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      console.log('onFilterChange')
      dispatch({
        type: 'paymentEdc/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: listPayment,
    user,
    dispatch,
    storeInfo,
    pagination,
    loading: loading.effects['paymentEdc/query'],
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
        type: 'paymentEdc/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'paymentEdc/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'paymentEdc/changeTab',
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
    dispatch({ type: 'paymentEdc/updateState', payload: { listPayment: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'paymentEdc/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    options: listOpts || [],
    modalType,
    listAccountCodeLov: listAccountCode,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `paymentEdc/${modalType}`,
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
        type: 'paymentEdc/updateState',
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
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  paymentEdc: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({
  paymentOpts,
  paymentEdc,
  accountRule,
  loading,
  app
}) => ({
  paymentOpts,
  paymentEdc,
  accountRule,
  loading,
  app
}))(Counter)
