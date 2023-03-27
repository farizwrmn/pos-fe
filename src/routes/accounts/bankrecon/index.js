import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Col, Modal, Row } from 'antd'
import FormImport from './FormImport'
import Form from './Form'
import List from './List'
import ConflictedList from './ConflictedList'

const Cash = ({ bankentry, accountRule, location, loading, dispatch }) => {
  const {
    listBankRecon,
    conflictedCSV,
    summaryBankRecon,
    selectedRowKeys,
    currentItem,
    pagination,
    accountId,
    from,
    to,
    modalVisible
  } = bankentry
  const { listAccountCode } = accountRule

  const listColumnProps = {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 12,
    xl: 12
  }

  const formImportProps = {
    listAccountCode,
    accountId,
    from,
    to,
    loading,
    importCSV (array, filename) {
      dispatch({
        type: 'bankentry/importCsv',
        payload: {
          list: array,
          filename
        }
      })
    },
    onSubmit (params) {
      dispatch({
        type: 'bankentry/autoRecon',
        payload: params
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
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: true
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
      dispatch({
        type: 'bankentry/updateBankRecon',
        payload: {
          id: item.id
        }
      })
    }
  }

  const conflictedListProps = {
    conflictedCSV
  }

  return (
    <div className="content-inner">
      <Modal
        title="Auto Reconciliation BCA"
        visible={modalVisible}
        confirmLoading={loading.effects['bankentry/importCsv'] || loading.effects['bankentry/autoRecon']}
        footer={[
          <Button
            key="close"
            onClick={() => {
              dispatch({
                type: 'bankentry/updateState',
                payload: {
                  modalVisible: false
                }
              })
            }}
          >
            Close
          </Button>
        ]}
        onCancel={() => {
          dispatch({
            type: 'bankentry/updateState',
            payload: {
              modalVisible: false
            }
          })
        }}
      >
        <FormImport {...formImportProps} />
      </Modal>
      <Row>
        <Form {...formProps} />
      </Row>
      <Row>
        <Col {...listColumnProps}>
          <List {...listProps} />
        </Col>
        <Col {...listColumnProps}>
          <ConflictedList {...conflictedListProps} />
        </Col>
      </Row>
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
