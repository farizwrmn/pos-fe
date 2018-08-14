/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import { Mechanic, Trans } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ serviceReport, dispatch }) => {
  const { activeKey } = serviceReport
  const tabsProps = {
    type: 'card',
    activeKey,
    onChange (key) {
      dispatch({
        type: 'serviceReport/updateState',
        payload: {
          activeKey: key,
          listMechanic: [],
          listService: [],
          list: [],
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
      <Tabs {...tabsProps}>
        <TabPane tab="By Trans" key="1">
          {activeKey === '1' && <Trans />}
        </TabPane>
        <TabPane tab="By Mechanic" key="2">
          {activeKey === '2' && <Mechanic />}
        </TabPane>
        {/* <TabPane tab="By Item" key="3">
          {activeKey === '3' && <Item />}
        </TabPane> */}
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func
}

export default connect(({ loading, serviceReport }) => ({ loading, serviceReport }))(Report)
