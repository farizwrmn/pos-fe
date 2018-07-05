/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { Trans, Receivable, ReceivableGroup } from '../components'

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
    <div className="content-inner" style={{ clear: 'both' }}>
      <Tabs activeKey={activeKey} onChange={callback} type="card">
        <TabPane tab="By Trans" key="1">{activeKey === '1' && <Trans />}</TabPane>
        <TabPane tab="Receivable" key="2">{activeKey === '2' && <Receivable />}</TabPane>
        <TabPane tab="Receivable Group" key="3">{activeKey === '3' && <ReceivableGroup />}</TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
  accountsReport: PropTypes.object
}

export default connect(({ loading, posReport, accountsReport }) => ({ loading, posReport, accountsReport }))(Report)
