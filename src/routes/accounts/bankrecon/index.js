import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Modal, Row } from 'antd'
import FormImport from './FormImport'
import Form from './Form'
import List from './List'

const Cash = ({ bankentry, accountRule, location, loading, dispatch }) => {
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
  const { listAccountCode } = accountRule

  const formImportProps = {
    loading,
    autoRecon () {
      dispatch({
        type: 'bankentry/autoRecon',
        payload: {
          list: listBankRecon
        }
      })
    },
    importCSV (array) {
      console.log('array', array)
      dispatch({
        type: 'bankentry/importCsv',
        payload: {
          list: array
        }
      })
    }
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
        title: 'Auto Reconciliation BCA',
        content: (
          <FormImport {...formImportProps} />
        ),
        okText: 'Close'
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
  accountRule,
  loading,
  pos }) => ({ bankentry, accountRule, loading, pos }))(Cash)
