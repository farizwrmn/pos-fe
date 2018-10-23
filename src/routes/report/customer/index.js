import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { History, Asset, Cashback } from './components'

const TabPane = Tabs.TabPane

const Report = ({ customerReport, location, dispatch }) => {
  const { activeKey } = customerReport
  const tabProps = {
    type: 'card',
    defaultActiveKey: activeKey,
    onChange (key) {
      dispatch({
        type: 'customerReport/updateState',
        payload: {
          activeKey: key,
          customerInfo: {}
        }
      })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          activeKey: key
        }
      }))
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} {...tabProps}>
        <TabPane tab="History" key="0">
          {activeKey === '0' && <History />}
        </TabPane>
        <TabPane tab="Asset" key="1">
          {activeKey === '1' && <Asset />}
        </TabPane>
        <TabPane tab="Cashback" key="2">
          {activeKey === '2' && <Cashback />}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ customerReport }) => ({ customerReport }))(Report)

