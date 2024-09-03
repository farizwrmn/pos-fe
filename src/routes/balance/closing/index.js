import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import List from './List'

const Container = ({ loading, posSetoran, physicalMoney, physicalMoneyDeposit, balance, shift, userDetail, dispatch, paymentOpts, app }) => {
  const { user } = app
  const { list: listSetoran } = posSetoran
  const { list } = physicalMoney
  const { list: listPhysicalMoneyDeposit, visible } = physicalMoneyDeposit
  const { currentItem } = balance
  const { listShift } = shift
  const { listOpts } = paymentOpts
  const { data } = userDetail
  const listProps = {
    list,
    listSetoran,
    listPhysicalMoneyDeposit,
    item: currentItem,
    loading,
    listOpts,
    listShift,
    listUser: data && data.data,
    user,
    dispatch,
    button: 'Close',
    visible,
    onVisible () {
      dispatch({
        type: 'physicalMoneyDeposit/updateState',
        payload: {
          visible: true
        }
      })
    },
    closeVisible () {
      dispatch({
        type: 'physicalMoneyDeposit/updateState',
        payload: {
          visible: false
        }
      })
    },
    onSubmit (data) {
      if (currentItem && currentItem.id) {
        data.balanceId = currentItem ? currentItem.id : null
      }
      data.total = data.setoranDetail.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0)
      data.fingerEmployeeId = data.approveUserId
      data.cashierUserId = data.approveUserId
      if (data && currentItem && currentItem.id) {
        const params = {
          balanceId: currentItem.id,
          userId: data.approveUserId,
          detail: listOpts && listOpts
            .filter(filtered => (data && data.detail && data.detail[filtered.typeCode]))
            .map((item) => {
              const selected = data && data.detail && data.detail[item.typeCode]
              return ({
                paymentOptionId: item.id,
                balanceIn: selected.balanceIn
              })
            }),
          consignment: listOpts && listOpts
            .filter(filtered => (data && data.consignment && data.consignment[filtered.typeCode]))
            .map((item) => {
              const selected = data && data.consignment && data.consignment[item.typeCode]
              return ({
                paymentOptionId: item.id,
                balanceIn: selected.balanceIn
              })
            })
        }
        data.params = params
        dispatch({
          type: 'physicalMoneyDeposit/add',
          payload: {
            data
          }
        })
        // dispatch({
        //   type: 'posSetoran/insertVoidEdcDeposit',
        //   payload: {
        //     data
        //   }
        // })
        // dispatch({
        //   type: 'balance/closed',
        //   payload: {
        //     data: params
        //   }
        // })
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
  physicalMoney: PropTypes.object,
  physicalMoneyDeposit: PropTypes.object,
  balance: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(
  ({
    posSetoran,
    physicalMoney,
    physicalMoneyDeposit,
    loading,
    balance,
    shift,
    userDetail,
    app,
    paymentOpts
  }) => ({
    posSetoran,
    physicalMoney,
    physicalMoneyDeposit,
    loading,
    balance,
    shift,
    userDetail,
    app,
    paymentOpts
  })
)(Container)
