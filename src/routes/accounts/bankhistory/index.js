import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'
import List from './List'

const Cash = ({ bankentry, accountCode, location, loading, dispatch }) => {
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
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...data,
          page: 1
        }
      }))
    }
  }

  const listProps = {
    listBankRecon,
    summaryBankRecon,
    dataSource: listBankRecon,
    pagination,
    loading: loading.effects['bankentry/queryBankRecon'],
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
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
