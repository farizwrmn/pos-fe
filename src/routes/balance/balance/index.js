import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {
  TYPE_SALES,
  TYPE_PETTY_CASH
} from 'utils/variable'
import Form from './Form'

const Container = ({ loading, balance, shift, paymentOpts, dispatch, location }) => {
  const { modalType, currentItem, disable } = balance
  const { listShift } = shift

  const { listOpts } = paymentOpts

  const listProps = {
    listOpts
  }

  const formProps = {
    listShift: listShift || [],
    item: currentItem,
    loading,
    dispatch,
    modalType,
    listProps,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    onSubmit (data) {
      console.log('data', data)
      if (data) {
        const detail = listOpts && listOpts.map((item) => {
          const selected = data && data.detail && data.detail[item.typeCode]
          return ({
            paymentOptionId: item.id,
            balanceIn: selected.balanceIn,
            type: TYPE_SALES
          })
        })
        const cash = listOpts && listOpts
          .filter(filtered => filtered.typeCode === 'C')
          .map((item) => {
            const selected = data && data.cash && data.cash[item.typeCode]
            return ({
              paymentOptionId: item.id,
              balanceIn: selected.balanceIn,
              type: TYPE_PETTY_CASH
            })
          })
        const params = {
          storeId: data.storeId,
          shiftId: data.shiftId,
          description: data.description,
          detail: detail.concat(cash)
        }
        console.log('balance/open')
        dispatch({
          type: 'balance/open',
          payload: {
            data: params
          }
        })
      }
    },
    onCancel () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'balance/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  // if (loading && loading.effects['balance/active']) {
  //   console.log('1')
  //   return null
  // }

  if (currentItem && currentItem.id && Boolean(currentItem.id)) {
    return (
      <div className="content-inner">
        <Form {...formProps} button="Close" />
      </div>
    )
  }

  return (
    <div className="content-inner" >
      <Form {...formProps} button="Open" />
    </div >
  )
}

Container.propTypes = {
  balance: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ balance, shift, paymentOpts, loading, app }) => ({ balance, shift, paymentOpts, loading, app }))(Container)
