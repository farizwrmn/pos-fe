import React from 'react'
import pathToRegexp from 'path-to-regexp'
import { Row } from 'antd'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Form from './Form'

class SetoranClosed extends React.Component {
  render () {
    const {
      dispatch,
      location,
      setoran,
      balanceShift,
      userDetail,
      paymentOpts
    } = this.props
    const {
      closedBalance,
      currentBalance
    } = setoran
    const {
      listOpts
    } = paymentOpts
    const {
      listShift
    } = balanceShift
    const {
      data
    } = userDetail

    const formProps = {
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
  setoran,
  balanceShift,
  userDetail,
  paymentOpts
}) => ({
  loading,
  setoran,
  balanceShift,
  userDetail,
  paymentOpts
}))(SetoranClosed)
