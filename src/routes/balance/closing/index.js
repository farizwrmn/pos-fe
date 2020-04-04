import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import List from './List'

const Container = ({ balance, dispatch, paymentOpts }) => {
  const { currentItem } = balance
  const { listOpts } = paymentOpts

  const listProps = {
    listOpts,
    dispatch,
    button: 'Close',
    onSubmit (data) {
      if (data && currentItem && currentItem.id) {
        const params = {
          balanceId: currentItem.id,
          detail: listOpts && listOpts.map((item) => {
            const selected = data && data.detail && data.detail[item.typeCode]
            return ({
              paymentOptionId: item.id,
              balanceIn: selected.balanceIn
            })
          }),
          cash: listOpts && listOpts.filter(filtered => filtered.typeCode === 'C').map((item) => {
            const selected = data && data.cash && data.cash[item.typeCode]
            return ({
              paymentOptionId: item.id,
              balanceIn: selected.balanceIn
            })
          }),
          consignment: listOpts && listOpts.map((item) => {
            const selected = data && data.consignment && data.consignment[item.typeCode]
            return ({
              paymentOptionId: item.id,
              balanceIn: selected.balanceIn
            })
          })
        }
        dispatch({
          type: 'balance/closed',
          payload: {
            data: params
          }
        })
      }
    }
  }

  return (
    <div className="content-inner">
      {currentItem && currentItem.id ? (
        <List {...listProps} />
      )
        : (
          <div>
            <h2>Already Closed</h2>
            <a href={'/balance/current'}>Open New Transaction</a>
          </div>
        )}
    </div>
  )
}

Container.propTypes = {
  balance: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(
  ({
    loading,
    balance,
    app,
    paymentOpts
  }) =>
    ({
      loading,
      balance,
      app,
      paymentOpts
    })
)(Container)
