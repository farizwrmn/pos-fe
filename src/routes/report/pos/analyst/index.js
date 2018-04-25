/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { Turnover } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ dispatch }) => {
  const callback = () => {
    dispatch({
      type: 'posReport/setListNull'
    })
  }
  return (
    <div className="content-inner">
      <Tabs onChange={callback} type="card">
        <TabPane tab="Turnover" key="1"><Turnover /></TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func
}

export default connect(({ loading, posReport }) => ({ loading, posReport }))(Report)
