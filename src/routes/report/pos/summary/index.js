/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'

import { Cancel, Trans, Daily, Compare, Hourly, Hour, PosUnit } from '../components'

import Detail from '../components/Detail'
import EmbeddedSalesByDate from '../components/EmbeddedSalesByDate'

const TabPane = Tabs.TabPane

const Report = ({ posReport, dispatch, location }) => {
  const {
    activeKey,
    iframeUrl
    // permissionValue
  } = posReport
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
        <TabPane tab="By Trans" key="1">
          {activeKey === '1' && <Trans />}
        </TabPane>
        <TabPane tab="Void Invoice" key="2">
          {activeKey === '2' && <Cancel />}
        </TabPane>
        <TabPane tab="History" key="3">
          {activeKey === '3' && <Daily />}
        </TabPane>
        <TabPane tab="Detail" key="4">
          {activeKey === '4' && <Detail location={location} />}
        </TabPane>
        <TabPane tab="Compare" key="5">
          {activeKey === '5' && <Compare />}
        </TabPane>
        <TabPane tab="Hourly" key="6">
          {activeKey === '6' && <Hourly />}
        </TabPane>
        <TabPane tab="Hours" key="7">
          {activeKey === '7' && <Hour />}
        </TabPane>
        <TabPane tab="Store" key="8">
          {activeKey === '8' && <PosUnit />}
        </TabPane>
        <TabPane tab="Embedded" key="9">
          {activeKey === '9' && <EmbeddedSalesByDate iframeUrl={iframeUrl} />}
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
