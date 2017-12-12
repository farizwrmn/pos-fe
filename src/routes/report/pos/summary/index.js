/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { Product, Cancel, Trans, Daily } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ dispatch, posReport }) => {
  const callback = () => {
    dispatch({
      type: 'posReport/setListNull'
    })
  }
  return (
    <div className="content-inner">
      <Tabs onChange={callback} type="card">
        <TabPane tab="By Trans" key="1"><Trans /></TabPane>
        <TabPane tab="By Product" key="2"><Product /></TabPane>
        <TabPane tab="Void Invoice" key="3"><Cancel /></TabPane>
        <TabPane tab="History" key="4"><Daily /></TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
}

export default connect(({ loading, posReport }) => ({ loading, posReport }))(Report)