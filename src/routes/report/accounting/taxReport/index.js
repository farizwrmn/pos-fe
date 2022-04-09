import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import TaxReport from './TaxReport'

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
        <TabPane tab="GST Report" key="/report/accounting/tax-report">
          {pathname === '/report/accounting/tax-report' && <TaxReport location={location} />}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ taxReport }) => ({ taxReport }))(Report)

