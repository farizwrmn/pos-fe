import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import ProfitLoss from './ProfitLoss'
import BalanceSheet from './BalanceSheet'

const TabPane = Tabs.TabPane

const Report = ({ dispatch, location }) => {
  const { pathname } = location

  const changeTab = (path) => {
    dispatch({
      type: 'accountingStatementReport/updateState',
      payload: {
        path
      }
    })
    dispatch(routerRedux.push(path))
  }
  return (
    <div className="content-inner">
      <Tabs activeKey={pathname} onChange={path => changeTab(path)}>
        <TabPane tab="Profit Loss" key="/report/accounting/profit-loss">
          {pathname === '/report/accounting/profit-loss' && <ProfitLoss location={location} />}
        </TabPane>
        <TabPane tab="Balance Sheet" key="/report/accounting/balance-sheet">
          {pathname === '/report/accounting/balance-sheet' && <BalanceSheet location={location} />}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ accountingStatementReport }) => ({ accountingStatementReport }))(Report)

