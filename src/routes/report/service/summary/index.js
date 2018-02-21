/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { Mechanic, Trans } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ dispatch }) => {
  const callback = () => {
    dispatch({
      type: 'serviceReport/setListNull'
    })
  }
  return (
    <div className="content-inner">
      <Tabs onChange={callback} type="card">
        <TabPane tab="By Trans" key="1"><Trans /></TabPane>
        <TabPane tab="By Mechanic" key="2"><Mechanic /></TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func
}

export default connect(({ loading, serviceReport }) => ({ loading, serviceReport }))(Report)
