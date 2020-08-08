import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'
import List from './List'

const Cash = ({ bankentry, accountCode, dispatch }) => {
  const {
    listBankRecon,
    summaryBankRecon,
    currentItem,
    pagination,
    from,
    to
  } = bankentry
  const { listAccountCode } = accountCode

  const formProps = {
    item: currentItem,
    from,
    to,
    listAccountCode,
    onSubmit (data) {
      dispatch({
        type: 'bankentry/queryBankRecon',
        payload: data
      })
    }
  }

  const listProps = {
    listBankRecon,
    summaryBankRecon,
    pagination,
    onSubmit (item) {
      dispatch({
        type: 'bankentry/updateBankRecon',
        payload: {
          id: item.id
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
      <List {...listProps} />
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
