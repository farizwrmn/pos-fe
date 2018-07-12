import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import Pos from '../savedPayment/index'
import PurchaseHistory from '../purchasehistory/index'

const TabPane = Tabs.TabPane

const History = ({ history, dispatch }) => {
  const { path } = history

  const changeTab = (path) => {
    console.log(path)
    dispatch({
      type: 'history/updateState',
      payload: {
        path
      }
    })
    dispatch(routerRedux.push(path))
  }
  return (
    <Tabs activeKey={path} onChange={path => changeTab(path)}>
      <TabPane tab="POS" key="/transaction/pos/history"><Pos /></TabPane>
      <TabPane tab="Purchase" key="/transaction/purchase/history"><PurchaseHistory /></TabPane>
    </Tabs>
  )
}

export default connect(({ history }) => ({ history }))(History)

