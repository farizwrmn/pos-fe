/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import { Payment, Payable } from '../components'

const TabPane = Tabs.TabPane

const PaymentTab = ({ dispatch, accountPayment }) => {
  const { activeKey } = accountPayment
  const changeTab = (key) => {
    // dispatch({
    //   type: 'accountPayment/updateState',
    //   payload: {
    //     activeKey: key
    //   }
    // })
    const { pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        activeKey: key
      }
    }))
  }
  return (
    <div className="content-inner">
      <Tabs type="card" activeKey={activeKey} onChange={key => changeTab(key)}>
        <TabPane tab="Account Receivable" key="1">
          {activeKey === '1' && <Payment />}
        </TabPane>
        <TabPane tab="Account Payable" key="2">
          {activeKey === '2' && <Payable />}
        </TabPane>
      </Tabs>
    </div>
  )
}

PaymentTab.propTypes = {
  dispatch: PropTypes.func
}

export default connect(({ loading, accountPayment }) => ({ loading, accountPayment }))(PaymentTab)
