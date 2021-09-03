/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import PayableSupplier from '../components/PayableSupplier'
import PayableTrans from '../components/PayableTrans'

const TabPane = Tabs.TabPane

const Report = ({ dispatch, accountsReport }) => {
  const { activeKey } = accountsReport
  const callback = (key) => {
    const { pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        activeKey: key
      }
    }))
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
        <TabPane tab="By Date" key="1">{activeKey === '1' && <PayableTrans />}</TabPane>
        <TabPane tab="By Supplier" key="2">{activeKey === '2' && <PayableSupplier />}</TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
  accountsReport: PropTypes.object
}

export default connect(({ loading, posReport, accountsReport }) => ({ loading, posReport, accountsReport }))(Report)
