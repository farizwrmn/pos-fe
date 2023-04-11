import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'

const Counter = ({ purchaseReceive, loading, dispatch }) => {
  const {
    listTrans,
    listDetail
  } = purchaseReceive

  const formProps = {
    loading,
    listTrans,
    listDetail,
    onGetDetailData (supplierId) {
      dispatch({
        type: 'purchaseReceive/queryDetail',
        payload: {
          supplierId
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
  purchaseReceive: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseReceive, loading, app }) => ({ purchaseReceive, loading, app }))(Counter)
