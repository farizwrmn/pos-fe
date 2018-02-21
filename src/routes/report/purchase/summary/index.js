/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { Return, Trans, Daily } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ dispatch }) => {
  const callback = () => {
    dispatch({
      type: 'purchaseReport/setListNull'
    })
  }
  return (
    <div className="content-inner">
      <Tabs onChange={callback} type="card">
        <TabPane tab="By Trans" key="1"><Trans /></TabPane>
        <TabPane tab="Return" key="2"><Return /></TabPane>
        <TabPane tab="Daily" key="3"><Daily /></TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func
}

export default connect(({ loading, purchaseReport }) => ({ loading, purchaseReport }))(Report)
