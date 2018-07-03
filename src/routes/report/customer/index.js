import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { History, Asset } from './components'

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
    <div className="content-inner" style={{ clear: 'both' }}>
      <Tabs {...tabProps}>
        <TabPane tab="History" key="0">
          <History />
        </TabPane>
        <TabPane tab="Asset" key="1">
          <Asset />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ customerReport }) => ({ customerReport }))(Report)

