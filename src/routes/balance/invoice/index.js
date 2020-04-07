import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {
  TYPE_SALES,
  TYPE_PETTY_CASH
} from 'utils/variable'
import Form from './Form'

const Container = ({ balance, balanceDetail, shift, paymentOpts, dispatch, location }) => {
  const { modalType, disable } = balance
  const { listShift } = shift
  const { currentItem, listBalanceDetail } = balanceDetail
  const { listOpts } = paymentOpts

  const formProps = {
    listShift: listShift || [],
    item: currentItem ? {
      ...currentItem,
      detail: listBalanceDetail
    } : {},
    dispatch,
    modalType,
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

  return (
    <div className="content-inner">
      {currentItem && currentItem.id && (
        <Form {...formProps} button="Open" />
      )}
    </div>
  )
}

Container.propTypes = {
  balance: PropTypes.object,
  balanceDetail: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ balance, balanceDetail, shift, paymentOpts, loading, app }) => ({ balance, balanceDetail, shift, paymentOpts, loading, app }))(Container)
