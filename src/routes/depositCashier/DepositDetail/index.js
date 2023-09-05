import React from 'react'
import pathToRegexp from 'path-to-regexp'
import { Button, Row } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ListBalance from './ListBalance'
import ListResolve from './ListResolve'
import ListJournal from './ListJournal'
import ModalResolve from './ModalResolve'

class DepositCashierDetail extends React.Component {
  render () {
    const {
      loading,
      location,
      dispatch,
      depositCashier
    } = this.props

    const {
      summaryDetail,
      listDetail,
      paginationDetail,

      listResolve,
      paginationResolve,

      listJournal,
      paginationJournal,

      selectedResolve,
      listResolveOption,

      visibleResolveModal
    } = depositCashier

    const handleBackButton = () => {
      dispatch(routerRedux.push('/setoran/cashier'))
    }

    const listBalanceProps = {
      summaryDetail,
      dataSource: listDetail,
      pagination: paginationDetail,
      handleChangePagination: (pagination) => {
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

    const listResolveProps = {
      dataSource: listResolve,
      pagination: paginationResolve,
      handleChangePagination: (pagination) => {
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
      },
      handleResolve: (selectedResolve) => {
        dispatch({
          type: 'depositCashier/updateState',
          payload: {
            selectedResolve,
            visibleResolveModal: true
          }
        })
      }
    }

    const listGeneratedJournal = {
      dataSource: listJournal,
      pagination: paginationJournal,
      handleChangePagination: (pagination) => {
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

    const modalResolveProps = {
      loading,
      listResolveOption,
      selectedResolve,
      visible: visibleResolveModal,
      onSubmit: (data) => {
        const { pathname } = location
        const match = pathToRegexp('/setoran/cashier/:id').exec(pathname)
        dispatch({
          type: 'depositCashier/queryUpdateStatus',
          payload: {
            ...data,
            transId: decodeURIComponent(match[1]),
            page: paginationResolve.current || 1,
            pageSize: paginationResolve.pageSize || 10
          }
        })
      },
      onCancel: () => {
        dispatch({
          type: 'depositCashier/updateState',
          payload: {
            visibleResolveModal: false,
            selectedResolve: {}
          }
        })
      }
    }

    return (
      <div className="content-inner">
        {visibleResolveModal && <ModalResolve {...modalResolveProps} />}
        <Row style={{ marginBottom: '10px' }}>
          <Button type="primary" icon="rollback" onClick={handleBackButton}>Back</Button>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <ListBalance {...listBalanceProps} />
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <ListResolve {...listResolveProps} />
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <ListJournal {...listGeneratedJournal} />
        </Row>
      </div>
    )
  }
}

export default connect(({
  loading,
  depositCashier
}) => ({
  loading,
  depositCashier
}))(DepositCashierDetail)
