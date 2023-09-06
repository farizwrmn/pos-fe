import React from 'react'
import moment from 'moment'
import { Button, Row } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import ListBalance from './ListBalance'
import ListJournal from './ListJournal'
import Filter from './Filter'
import ModalResolve from './ModalResolve/index'

class DepositCashierDetail extends React.Component {
  state = {
    selectedBalanceResolve: {}
  }

  render () {
    const {
      loading,
      location,
      dispatch,
      depositCashier,
      accountRule
    } = this.props
    const {
      selectedBalanceResolve
    } = this.state

    const {
      summaryDetail,
      listDetail,
      paginationDetail,

      listResolveOption,

      visibleResolveModal,

      listCreateJournal
    } = depositCashier

    const {
      listAccountCodeLov
    } = accountRule

    const handleBackButton = () => {
      dispatch(routerRedux.push('/setoran/cashier'))
    }

    const handleResolveModal = () => {
      dispatch({
        type: 'depositCashier/updateState',
        payload: {
          visibleResolveModal: !visibleResolveModal
        }
      })
    }

    const listBalanceProps = {
      loading,
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
      },
      handleResolve: (data) => {
        this.setState({
          selectedBalanceResolve: data
        })
        handleResolveModal()
      }
    }

    const listGeneratedJournal = {
      dataSource: listCreateJournal,
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

    const filterProps = {
      location,
      loading,
      onSubmit: (data) => {
        const { rangeDate } = data
        const { pathname, query } = location
        if (rangeDate && rangeDate.length > 0) {
          const startDate = moment(rangeDate[0]).format('YYYY-MM-DD')
          const endDate = moment(rangeDate[1]).format('YYYY-MM-DD')
          dispatch(routerRedux.push({
            pathname,
            query: {
              ...query,
              startDate,
              endDate,
              page: 1
            }
          }))
        }
      }
    }

    const modalResolveProps = {
      selectedBalanceResolve,
      listAccountCodeLov,
      visible: visibleResolveModal,
      listResolveOption,
      onCancel: handleResolveModal,
      onSubmit: (data) => {
        dispatch({
          type: 'depositCashier/updateState',
          payload: {
            listCreateJournal: [
              ...listCreateJournal,
              {
                id: listCreateJournal.length + 1,
                ...data
              }
            ],
            visibleResolveModal: false
          }
        })
      }
    }

    return (
      <div className="content-inner">
        {visibleResolveModal && <ModalResolve {...modalResolveProps} />}
        <Row style={{ marginBottom: '30px' }}>
          <Button type="primary" icon="rollback" onClick={handleBackButton}>Back</Button>
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <Filter {...filterProps} />
        </Row>
        <Row style={{ marginBottom: '30px' }}>
          <ListBalance {...listBalanceProps} />
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
  depositCashier,
  accountRule
}) => ({
  loading,
  depositCashier,
  accountRule
}))(DepositCashierDetail)
