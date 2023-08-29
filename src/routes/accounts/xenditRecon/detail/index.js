import React from 'react'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Col, Row, message } from 'antd'
import ListBalance from './ListBalance'
import ListTransaction from './ListTransaction'
import Filter from './Filter'
import ListTransactionNotReconciled from './ListTransactionNotReconciled'

class Detail extends React.Component {
  render () {
    const {
      dispatch,
      location,
      loading,
      xenditRecon,
      app
    } = this.props
    const {
      listTransactionNotRecon,
      listTransactionDetail,
      listTransactionDetailAll,
      paginationTransactionDetail,
      listBalanceDetail,
      paginationBalanceDetail,
      showPDFModalTransactionDetail,
      showPDFModalTransactionNotRecon,
      mode,
      changed
    } = xenditRecon
    const { user } = app

    const handleBackButton = () => {
      const query = {}
      if (location.query.from && location.query.to) {
        query.from = location.query.from
        query.to = location.query.to
      }
      if (location.query.all) query.all = location.query.all
      dispatch(routerRedux.push({
        pathname: '/accounting/xendit-recon',
        query
      }))
    }

    const { type } = location.query
    if (!type || (type !== 'transaction' && type !== 'balance')) {
      message.error('Invalid Type')
      handleBackButton()
      return
    }

    const listBalanceProps = {
      loading: loading.effects['xenditRecon/queryBalanceDetail'],
      dataSource: listBalanceDetail,
      pagination: paginationBalanceDetail,
      onChangePagination: (pagination) => {
        const { current: page, pageSize } = pagination
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            page,
            pageSize
          }
        }))
      }
    }

    const listTransactionProps = {
      dispatch,
      loading,
      dataSource: listTransactionDetail,
      pagination: paginationTransactionDetail,
      showPDFModal: showPDFModalTransactionDetail,
      modalPrintProps: {
        loading,
        location,
        mode,
        list: listTransactionDetail,
        listPrintAll: listTransactionDetailAll,
        changed,
        PDFModalProps: {
          closeable: false,
          maskCloseable: false,
          visible: showPDFModalTransactionDetail,
          footer: null,
          width: '600px',
          title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
          onCancel () {
            dispatch({
              type: 'xenditRecon/updateState',
              payload: {
                showPDFModalTransactionDetail: false,
                changed: false,
                listTransactionDetailAll: []
              }
            })
          }
        },
        printProps: {
          user
        },
        getAllData: () => {
          const match = pathToRegexp('/accounting/xendit-recon/detail/:id').exec(location.pathname)
          if (match) {
            dispatch({
              type: 'xenditRecon/queryAllTransactionDetail',
              payload: {
                changed: true,
                transId: match[1]
              }
            })
          }
        }
      },
      onChangePagination: (pagination) => {
        const { current: page, pageSize } = pagination
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            page,
            pageSize
          }
        }))
      }
    }

    const filterProps = {
      location,
      onSearch: (value) => {
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            q: value,
            page: 1
          }
        }))
      }
    }

    const listTransactionNotReconProps = {
      loading,
      dispatch,
      listTransactionNotRecon,
      showPDFModal: showPDFModalTransactionNotRecon,
      modalPrintProps: {
        dispatch,
        listPrintAll: listTransactionNotRecon,
        showPDFModal: showPDFModalTransactionNotRecon,
        PDFModalProps: {
          closeable: false,
          maskCloseable: false,
          visible: showPDFModalTransactionNotRecon,
          footer: null,
          width: '600px',
          title: mode === 'pdf' ? 'Choose PDF' : 'Choose Excel',
          onCancel () {
            dispatch({
              type: 'xenditRecon/updateState',
              payload: {
                showPDFModalTransactionNotRecon: false
              }
            })
          }
        },
        printProps: {
          user
        },
        mode,
        changed
      }
    }

    return (
      <div className="content-inner">
        <Row>
          <Col span={24}>
            <Row style={{ marginBottom: '10px' }}>
              <Button icon="rollback" type="primary" onClick={handleBackButton}>Back</Button>
            </Row>
            <Row justify="end" type="flex">
              <Filter {...filterProps} />
            </Row>
            <Row>
              {type === 'balance' && <ListBalance {...listBalanceProps} />}
              {type === 'transaction' && <ListTransaction {...listTransactionProps} />}
              {type === 'transaction' && listTransactionNotRecon && listTransactionNotRecon.length > 0 && (
                <ListTransactionNotReconciled {...listTransactionNotReconProps} />
              )}
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(({
  xenditRecon,
  app,
  loading
}) => ({ xenditRecon, app, loading }))(Detail)
