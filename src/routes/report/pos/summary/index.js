/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { Cancel, Trans, Daily, Detail, Compare } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ dispatch }) => {
  const callback = () => {
    dispatch({
      type: 'posReport/setListNull'
    })
  }
  return (
    <div className="content-inner">
      <Tabs onChange={callback} type="card" defaultActiveKey="5">
        <TabPane tab="By Trans" key="1"><Trans /></TabPane>
        {/* <TabPane tab="By Product" key="2"><Product /></TabPane> */}
        <TabPane tab="Void Invoice" key="2"><Cancel /></TabPane>
        <TabPane tab="History" key="3"><Daily /></TabPane>
        <TabPane tab="Detail" key="4"><Detail /></TabPane>
        <TabPane tab="Compare" key="5"><Compare /></TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func
}

export default connect(({ loading, posReport }) => ({ loading, posReport }))(Report)
