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

const Report = ({ dispatch, accountPayableReport }) => {
  const { activeKey } = accountPayableReport
  const callback = (key) => {
    const { pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        activeKey: key
      }
    }))
    dispatch({
      type: 'accountPayableReport/setListNull'
    })
    dispatch({
      type: 'accountPayableReport/updateState',
      payload: {
        activeKey: key
      }
    })
  }
  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={callback} type="card">
        <TabPane tab="By Date" key="0">{activeKey === '0' && <PayableTrans />}</TabPane>
        <TabPane tab="By Supplier" key="1">{activeKey === '1' && <PayableSupplier />}</TabPane>
      </Tabs>
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func,
  accountPayableReport: PropTypes.object
}

export default connect(({ loading, accountPayableReport }) => ({ loading, accountPayableReport }))(Report)
