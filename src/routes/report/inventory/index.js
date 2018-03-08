import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { TransferOut } from './components'

const TabPane = Tabs.TabPane

const Report = ({ dispatch }) => {
  const callback = () => {
    dispatch({
      type: 'inventoryReport/setListNull'
    })
  }
  return (
    <div className="content-inner">
      <Tabs onChange={callback} type="card">
        <TabPane tab="Transfer In" key="1">Transfer In</TabPane>
        <TabPane tab="Transfer Out" key="2"><TransferOut /></TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func
}

export default connect(({ loading, posReport }) => ({ loading, posReport }))(Report)
