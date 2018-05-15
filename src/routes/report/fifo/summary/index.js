/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import { Summary, Balance, Transfer } from './components'

const { TabPane } = Tabs

const Report = ({ dispatch, fifoReport }) => {
  const { activeKey } = fifoReport
  const callback = (key) => {
    const { pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        activeKey: key
      }
    }))
    dispatch({
      type: 'fifoReport/setNull'
    })
  }
  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => callback(key)} type="card">
        <TabPane tab="Summary" key="0">
          {activeKey === '0' && <Summary />}
        </TabPane>
        <TabPane tab="Balance" key="1">
          {activeKey === '1' && <Balance />}
        </TabPane>
        <TabPane tab="Transfer" key="2">
          {activeKey === '2' && <Transfer />}
        </TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
  fifoReport: PropTypes.object
}

export default connect(({ loading, fifoReport }) => ({ loading, fifoReport }))(Report)
