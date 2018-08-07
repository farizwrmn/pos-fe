import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { FollowUp } from './components'

const TabPane = Tabs.TabPane

const Report = ({ marketingReport, location, dispatch }) => {
  const { activeKey } = marketingReport
  const tabProps = {
    type: 'card',
    activeKey: activeKey || '1',
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
        <TabPane tab="FollowUp" key="1">
          {activeKey === '1' && <FollowUp />}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ marketingReport }) => ({ marketingReport }))(Report)

