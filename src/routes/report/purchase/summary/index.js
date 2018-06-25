/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { Return, Trans, Daily, Detail } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ dispatch, purchaseReport }) => {
  const { activeKey } = purchaseReport
  const callback = (key) => {
    dispatch({
      type: 'purchaseReport/setListNull'
    })
    dispatch({
      type: 'purchaseReport/updateState',
      payload: {
        activeKey: key
      }
    })
  }
  return (
    <div className="content-inner">
      <Tabs style={{ clear: 'both' }} activeKey={activeKey} onChange={key => callback(key)} type="card">
        <TabPane tab="By Trans" key="1">
          {activeKey === '1' && <Trans />}
        </TabPane>
        <TabPane tab="Return" key="2">
          {activeKey === '2' && <Return />}
        </TabPane>
        <TabPane tab="Daily" key="3">
          {activeKey === '3' && <Daily />}
        </TabPane>
        <TabPane tab="Detail" key="4">
          {activeKey === '4' && <Detail />}
        </TabPane>

      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
  purchaseReport: PropTypes.object
}

export default connect(({ loading, purchaseReport }) => ({ loading, purchaseReport }))(Report)
