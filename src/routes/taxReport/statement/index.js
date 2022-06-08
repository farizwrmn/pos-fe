import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import ProfitLoss from './ProfitLoss'
import BalanceSheet from './BalanceSheet'

const TabPane = Tabs.TabPane

const Report = ({ dispatch, location }) => {
  const { pathname } = location

  const changeTab = (pathname) => {
    dispatch(routerRedux.push({
      pathname
    }))
  }
  return (
    <div className="content-inner">
      <Tabs activeKey={pathname} onChange={pathname => changeTab(pathname)}>
        <TabPane tab="Profit Loss" key="/tools/report/profit-loss">
          {pathname === '/tools/report/profit-loss' && <ProfitLoss location={location} />}
        </TabPane>
        <TabPane tab="Balance Sheet" key="/tools/report/balance-sheet">
          {pathname === '/tools/report/balance-sheet' && <BalanceSheet location={location} />}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ accountingStatementReport }) => ({ accountingStatementReport }))(Report)

