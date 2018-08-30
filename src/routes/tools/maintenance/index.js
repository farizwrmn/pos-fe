import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import PosHeader from '../posHeader'
import Inventory from '../Inventory'

const TabPane = Tabs.TabPane

const Maintenance = ({ maintenance, dispatch }) => {
  const { path } = maintenance

  const changeTab = (path) => {
    dispatch({
      type: 'maintenance/updateState',
      payload: {
        path
      }
    })
    dispatch(routerRedux.push(path))
  }
  return (
    <div className="content-inner">
      <Tabs type="card" activeKey={path} onChange={path => changeTab(path)}>
        <TabPane tab="POS header" key="/tools/maintenance/posheader">
          {path === '/tools/maintenance/posheader' && <PosHeader />}
        </TabPane>
        <TabPane tab="Recalculate Inventory" key="/tools/maintenance/inventory">
          {path === '/tools/maintenance/inventory' && <Inventory />}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ maintenance }) => ({ maintenance }))(Maintenance)

