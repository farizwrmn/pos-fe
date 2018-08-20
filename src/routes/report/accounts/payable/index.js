/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { PayableTrans } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ dispatch, accountsReport }) => {
  const { activeKey } = accountsReport
  const callback = (key) => {
    dispatch({
      type: 'accountsReport/setListNull'
    })
    dispatch({
      type: 'accountsReport/updateState',
      payload: {
        activeKey: key
      }
    })
  }
  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={callback} type="card">
        <TabPane tab="By Trans" key="1">{activeKey === '1' && <PayableTrans />}</TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
  accountsReport: PropTypes.object
}

export default connect(({ loading, posReport, accountsReport }) => ({ loading, posReport, accountsReport }))(Report)
