import React from 'react'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row } from 'antd'
import Form from './Form'

class DepositClosed extends React.Component {
  componentDidMount () {
    const { dispatch, deposit } = this.props
    const { currentBalance } = deposit
    if (currentBalance && currentBalance.id) {
      window.open(`/setoran/invoice/${currentBalance.id}`, '_blank')
    } else {
      dispatch(routerRedux.push('/setoran/current'))
    }
  }

  componentWillUnmount () {
    const { dispatch } = this.props
    dispatch({
      type: 'deposit/updateState',
      payload: {
        currentBalance: {}
      }
    })
  }

  render () {
    const {
      dispatch,
      location,
      deposit,
      balanceShift,
      userDetail,
      paymentOpts
    } = this.props

    const {
      closedBalance,
      currentBalance,
      listBalanceInputPaymentOption
    } = deposit
    const {
      listOpts
    } = paymentOpts
    const {
      listShift
    } = balanceShift
    const {
      data
    } = userDetail
    console.log('currentBalance', currentBalance)
    console.log('listShift', listShift)

    const formProps = {
      listBalanceInputPaymentOption,
      listOpts,
      closedBalance,
      currentBalance,
      listShift,
      listUser: data.data,
      onClose: () => {
        dispatch(routerRedux.push('/setoran/current'))
      },
      onPrint: () => {
        const match = pathToRegexp('/setoran/closed/:id').exec(location.pathname)
        if (match) {
          const balanceId = decodeURIComponent(match[1])
          window.open(`/setoran/invoice/${balanceId}`, '_blank')
        }
      }
    }

    return (
      <div className="content-inner">
        <Row>
          <Form {...formProps} />
        </Row>
      </div>
    )
  }
}

export default connect(({
  loading,
  deposit,
  balanceShift,
  userDetail,
  paymentOpts
}) => ({
  loading,
  deposit,
  balanceShift,
  userDetail,
  paymentOpts
}))(DepositClosed)
