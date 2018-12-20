import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { Target } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ marketingReport, location, dispatch }) => {
  const { activeKey } = marketingReport
  const tabProps = {
    type: 'card',
    activeKey: activeKey || '1',
    defaultActiveKey: activeKey,
    onChange (key) {
      dispatch({
        type: 'marketingReport/updateState',
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
      <Tabs {...tabProps}>
        <TabPane tab="Target" key="1">
          {activeKey === '1' && <Target />}
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ marketingReport }) => ({ marketingReport }))(Report)

