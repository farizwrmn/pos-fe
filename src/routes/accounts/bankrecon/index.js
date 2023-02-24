import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Modal, Row } from 'antd'
import FormImport from './FormImport'
import Form from './Form'
import List from './List'

const Cash = ({ bankentry, accountCode, location, loading, dispatch, bank }) => {
  const {
    listBankRecon,
    summaryBankRecon,
    selectedRowKeys,
    currentItem,
    pagination,
    accountId,
    from,
    to
  } = bankentry
  const { listAccountCode } = accountCode
  const { listBank } = bank

  const formImportProps = {
    listBank,
    loading,
    dispatch
  }

  const formProps = {
    listBankRecon,
    loading,
    item: currentItem,
    accountId,
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
    },
    showImportDialog () {
      Modal.info({
        title: 'Import CSV File',
        content: (
          <FormImport {...formImportProps} />
        ),
        okText: 'Close'
      })
    },
    autoRecon () {
      dispatch({
        type: 'bankentry/autoRecon',
        payload: {
          list: listBankRecon
        }
      })
    }
  }

  const listProps = {
    loading,
    listBankRecon,
    summaryBankRecon,
    selectedRowKeys,
    pagination,
    dispatch,
    onSubmit (item) {
      console.log('item', item)
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
      <Row>
        <Form {...formProps} />
      </Row>
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
  bank,
  accountCode,
  loading,
  pos }) => ({ bankentry, bank, accountCode, loading, pos }))(Cash)
