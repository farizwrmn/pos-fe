import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Counter = ({ purchaseQuotation, dispatch, loading, location }) => {
  const {
    listTrans,
    listSupplier,

    modalType,
    currentItem
  } = purchaseQuotation

  const formProps = {
    listTrans,
    listSupplier,
    loading,
    modalType,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: `purchaseQuotation/${modalType}`,
        payload: {
          data,
          reset
        }
      })
    },
    onGetDataSupplier (transId) {
      dispatch({
        type: 'purchaseQuotation/querySupplierCount',
        payload: {
          transId
        }
      })
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
        type: 'purchaseQuotation/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
    </div>
  )
}

Counter.propTypes = {
  purchaseQuotation: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseQuotation, loading, app }) => ({ purchaseQuotation, loading, app }))(Counter)
