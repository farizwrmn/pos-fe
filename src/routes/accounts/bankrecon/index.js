import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Modal, Row, Tabs } from 'antd'
import FormImport from './FormImport'
import Form from './Form'
import List from './List'
import ConflictedList from './ConflictedList'

const TabPane = Tabs.TabPane

const Cash = ({ bankentry, accountRule, location, loading, dispatch }) => {
  const {
    listBankRecon,
    conflictedCSV,
    conflictedPayment,
    summaryBankRecon,
    selectedRowKeys,
    currentItem,
    pagination,
    accountId,
    from,
    to,
    modalVisible,
    activeKey
  } = bankentry
  const { listAccountCode } = accountRule

  const changeTab = (key) => {
    dispatch({
      type: 'bankentry/updateState',
      payload: {
        activeKey: key
      }
    })
    const { pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        activeKey: key
      }
    }))
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
    conflictedCSV,
    conflictedPayment
  }

  const modalFooter = [
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
  ]

  const modalProps = {
    title: 'Auto Reconciliation BCA',
    visible: modalVisible,
    confirmLoading: loading.effects['bankentry/importCsv'] || loading.effects['bankentry/autoRecon'],
    footer: modalFooter,
    onCancel () {
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: false
        }
      })
    }
  }


  const showImportDialog = () => {
    dispatch({
      type: 'bankentry/updateState',
      payload: {
        modalVisible: true
      }
    })
  }

  return (
    <div className="content-inner">
      <Modal {...modalProps} >
        <FormImport {...formImportProps} />
      </Modal>
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Bank Reconciliation" key="0" >
          <Form {...formProps} />
          <List {...listProps} />
        </TabPane>
        <TabPane tab="Auto Reconciliation" key="1" >
          <Row>
            <Button type="primary" icon="check" onClick={() => showImportDialog()}>BCA Auto Recon</Button>
          </Row>
          <Row>
            <ConflictedList {...conflictedListProps} />
          </Row>
        </TabPane>
      </Tabs>
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
