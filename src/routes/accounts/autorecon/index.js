import React from 'react'
import { connect } from 'dva'
import { Button, Dropdown, Icon, Menu, Row, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import Form from './Form/index'
import FormImport from './Form/Import'
import ConflictedList from './ConflictedList'
import List from './List'
import FormSearch from './Form/Search'
import FormConflicted from './Form/Conflicted'
import ModalPrint from './Print/ModalPrint'

const TabPane = Tabs.TabPane

const AutoReconciliation = ({
  loading,
  accountRule,
  dispatch,
  autorecon,
  location,
  app
}) => {
  const {
    modalVisible,
    formModalVisible,
    conflictModalVisible,
    conflictedCSV,
    conflictedPayment,
    selectedPaymentRowKeys,
    selectedCsvRowKeys,
    list,
    pagination,
    activeKey,
    accountId,
    from,
    to,
    showPDFModal,
    mode,
    listPrintAll,
    changed
  } = autorecon
  const { listAccountCode } = accountRule
  const { user } = app

  const changeTab = (key) => {
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
  }

  const formProps = {
    listAccountCode,
    loading,
    query: location.query,
    showImportModal () {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          modalVisible: true
        }
      })
    },
    onSubmit (params) {
      dispatch({
        type: 'autorecon/autoRecon',
        payload: {
          ...params,
          location
        }
      })
    }
  }

  const formImportProps = {
    modalVisible,
    loading,
    importCSV (array, filename) {
      dispatch({
        type: 'autorecon/importCsv',
        payload: {
          list: array,
          filename
        }
      })
    },
    onCloseModal () {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          modalVisible: false
        }
      })
    }
  }

  const conflictedListProps = {
    conflictedCSV,
    selectedCsvRowKeys,
    conflictedPayment,
    selectedPaymentRowKeys,
    dispatch
  }

  const formSearchProps = {
    loading,
    listAccountCode,
    query: location.query,
    searchQuery (value) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          q: value.q,
          page: 1
        }
      }))
    },
    onSubmit (params) {
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...params
        }
      }))
    }
  }

  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['autorecon/query'] || loading.effects['autorecon/autoRecon'],
    handleChange (tablePagination) {
      const { current, pageSize } = tablePagination
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: current,
          pageSize
        }
      }))
    },
    openDetail (id) {
      const { pathname } = location
      dispatch(routerRedux.push(`${pathname}/${id}`))
    }
  }

  const formConflictedProps = {
    selectedCsvRowKeys,
    selectedPaymentRowKeys,
    conflictedCSV,
    conflictedPayment,
    loading,
    conflictModalVisible,
    insertPaymentConflict () {
      dispatch({
        type: 'autorecon/add',
        payload: {
          selectedCsvRowKeys,
          selectedPaymentRowKeys,
          accountId,
          from,
          to,
          location
        }
      })
    },
    handleModal () {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          conflictModalVisible: !conflictModalVisible
        }
      })
    }
  }

  const printProps = {
    user
  }

  const getAllData = (params) => {
    dispatch({
      type: 'autorecon/queryAll',
      payload: {
        ...params,
        changed: true
      }
    })
  }

  const onShowPDFModal = (mode) => {
    dispatch({
      type: 'autorecon/updateState',
      payload: {
        showPDFModal: true,
        mode
      }
    })
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><Button onClick={() => onShowPDFModal('pdf')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-pdf" />PDF</Button></Menu.Item>
      <Menu.Item key="2"><Button onClick={() => onShowPDFModal('xls')} style={{ background: 'transparent', border: 'none', padding: 0 }}><Icon type="file-excel" />Excel</Button></Menu.Item>
    </Menu>
  )

  const moreButtonTab = (<div>
    <Dropdown overlay={menu}>
      <Button style={{ marginLeft: 8 }}>
        <Icon type="printer" /> Print
      </Button>
    </Dropdown>
  </div>)

  const PDFModalProps = {
    closeable: false,
    maskCloseable: false,
    visible: showPDFModal,
    footer: null,
    width: '600px',
    title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
    onCancel () {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          showPDFModal: false,
          changed: false,
          listPrintAll: []
        }
      })
    }
  }

  let modalPrintProps = {
    loading,
    formModalVisible,
    location,
    mode,
    list,
    listAccountCode,
    listPrintAll,
    changed,
    PDFModalProps,
    printProps,
    getAllData,
    handleFormModal () {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          formModalVisible: !formModalVisible
        }
      })
    }
  }

  return (
    <div className="content-inner">
      {showPDFModal && (
        <ModalPrint {...modalPrintProps} />
      )}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card" tabBarExtraContent={moreButtonTab}>
        <TabPane key="0" tab="Auto Reconcile">
          <FormImport {...formImportProps} />
          <Row>
            <Form {...formProps} />
          </Row>
          {conflictedCSV && conflictedPayment && conflictedCSV.length > 0 && conflictedPayment.length > 0 && (
            <Row>
              <FormConflicted {...formConflictedProps} />
            </Row>
          )}
          <Row>
            <ConflictedList {...conflictedListProps} />
          </Row>
        </TabPane>
        <TabPane key="1" tab="List">
          <FormSearch {...formSearchProps} />
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  accountRule,
  autorecon,
  loading,
  pos,
  app
}) => ({ loading, pos, autorecon, accountRule, app }))(AutoReconciliation)
