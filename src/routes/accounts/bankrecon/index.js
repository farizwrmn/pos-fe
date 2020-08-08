import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'

const Cash = ({ bankentry, accountCode, dispatch }) => {
  const { currentItem } = bankentry
  const { listAccountCode } = accountCode

  const formProps = {
    item: currentItem,
    listAccountCode,
    onSubmit (data, resetFields) {
      dispatch({
        type: 'bankentry/transfer',
        payload: {
          data,
          resetFields
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

Cash.propTypes = {
  bankentry: PropTypes.object,
  paymentOpts: PropTypes.object,
  bank: PropTypes.object,
  pos: PropTypes.object.isRequired,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({
  bankentry,
  accountCode,
  loading,
  pos }) => ({ bankentry, accountCode, loading, pos }))(Cash)
