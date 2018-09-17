/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'

import { PeakHour } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ posReport, dispatch, location }) => {
  const { activeKey } = posReport
  const callback = (key) => {
    dispatch({
      type: 'posReport/setListNull'
    })

    const { pathname } = location

    dispatch(routerRedux.push({
      pathname,
      query: {
        activeKey: key
      }
    }))
  }
  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={callback} type="card">
        <TabPane tab="Peak Hour" key="1">
          {activeKey === '1' && <PeakHour />}
        </TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
}

export default connect(({ loading, posReport }) => ({ loading, posReport }))(Report)
