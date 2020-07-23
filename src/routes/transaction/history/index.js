import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Pos from '../savedPayment'
import PurchaseHistory from '../purchasehistory'

const TabPane = Tabs.TabPane

const History = ({ history, dispatch, location }) => {
  const { path } = history

  const changeTab = (path) => {
    dispatch({
      type: 'history/updateState',
      payload: {
        path
      }
    })
    dispatch(routerRedux.push(path))
  }
  return (
    <div className="content-inner">
      <Tabs activeKey={path} onChange={path => changeTab(path)}>
        <TabPane tab="POS" key="/transaction/pos/history">
          {path === '/transaction/pos/history' && <Pos location={location} />}
        </TabPane>
        <TabPane tab="Purchase" key="/transaction/purchase/history">
          {path === '/transaction/purchase/history' && <PurchaseHistory location={location} />}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ history }) => ({ history }))(History)

