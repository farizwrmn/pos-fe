import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs } from 'antd'
import AccountingReport from './AccountingReport'
import SalesReport from './SalesReport'
import PurchasingReport from './PurchasingReport'
import ProductReport from './ProductReport'
import BankReport from './BankReport'

const TabPane = Tabs.TabPane

const Counter = ({ accountingOverview, dispatch, location }) => {
  const { modalType, currentItem, activeKey } = accountingOverview

  const changeTab = (key) => {
    dispatch({
      type: 'accountingOverview/changeTab',
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
    dispatch({ type: 'accountingOverview/updateState', payload: { list: [] } })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'accountingOverview/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const formProps = {
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: `accountingOverview/${modalType}`,
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
        type: 'accountingOverview/updateState',
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
        <TabPane tab="Accounting" key="0" >
          {activeKey === '0' && <AccountingReport {...formProps} />}
        </TabPane>
        <TabPane tab="Sales" key="1" >
          {activeKey === '1' && <SalesReport {...formProps} />}
        </TabPane>
        <TabPane tab="Purchasing" key="2" >
          {activeKey === '2' && <PurchasingReport {...formProps} />}
        </TabPane>
        <TabPane tab="Product" key="3" >
          {activeKey === '3' && <ProductReport {...formProps} />}
        </TabPane>
        <TabPane tab="Bank" key="4" >
          {activeKey === '4' && <BankReport {...formProps} />}
        </TabPane>
      </Tabs>
    </div>
  )
}

Counter.propTypes = {
  accountingOverview: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ accountingOverview, loading, app }) => ({ accountingOverview, loading, app }))(Counter)
