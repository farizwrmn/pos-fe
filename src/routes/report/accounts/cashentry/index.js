/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { CashEntryTrans, CashEntryDetail } from '../components'

const TabPane = Tabs.TabPane

const Report = ({ dispatch, cashEntryReport }) => {
  const { activeKey } = cashEntryReport
  const callback = (key) => {
    dispatch({
      type: 'cashEntryReport/setListNull'
    })
    dispatch({
      type: 'cashEntryReport/updateState',
      payload: {
        activeKey: key
      }
    })
  }
  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={callback} type="card">
        <TabPane tab="By Trans" key="1">{activeKey === '1' && <CashEntryTrans />}</TabPane>
        <TabPane tab="Detail" key="2">{activeKey === '2' && <CashEntryDetail />}</TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
  cashEntryReport: PropTypes.object
}

export default connect(({ loading, posReport, cashEntryReport }) => ({ loading, posReport, cashEntryReport }))(Report)
