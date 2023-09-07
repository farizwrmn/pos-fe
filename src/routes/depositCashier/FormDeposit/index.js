import React from 'react'
import moment from 'moment'
import { Button, Col, Modal, Row, message } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
import ListBalance from './ListBalance'
import ListJournal from './ListJournal'
import Filter from './Filter'
import ModalJournal from './ModalJournal'

const {
  setBalanceListCreateJournal
} = lstorage

class DepositCashierDetail extends React.Component {
  state = {
    selectedBalanceResolve: {},
    journalType: ''
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
      selectedBalanceResolve,
      journalType
    } = this.state

    const {
      summaryDetail,
      listDetail,
      paginationDetail,

      listResolveOption,

      visibleModalJournal,

      listCreateJournal
    } = depositCashier

    const {
      listAccountCodeLov
    } = accountRule

    const handleBackButton = () => {
      dispatch(routerRedux.push('/setoran/cashier'))
    }

    const handleModalJournal = () => {
      if (visibleModalJournal) {
        this.setState({
          journalType: ''
        })
      }
      dispatch({
        type: 'depositCashier/updateState',
        payload: {
          visibleModalJournal: !visibleModalJournal
        }
      })
    }

    const handleSubmit = () => {
      const { query } = location
      const { startDate, endDate } = query
      if (!startDate || !endDate) {
        message.error('Date is not defined!')
      }
      Modal.confirm({
        title: 'Confirmation',
        content: 'Are you sure for submitting this form?',
        onOk: () => {
          dispatch({
            type: 'depositCashier/queryAdd',
            payload: {
              startDate,
              endDate,
              detail: listCreateJournal
            }
          })
        }
      })
    }

    const listBalanceProps = {
      loading,
      summaryDetail,
      listCreateJournal,
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
          selectedBalanceResolve: data,
          journalType: 'resolve'
        })
        handleModalJournal()
      }
    }

    const listGeneratedJournal = {
      loading,
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
      },
      handleAddButton: () => {
        this.setState({
          journalType: 'normal'
        })
        handleModalJournal()
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

    const modalJournalProps = {
      journalType,
      selectedBalanceResolve,
      listAccountCodeLov,
      visible: visibleModalJournal,
      listResolveOption,
      onCancel: handleModalJournal,
      onSubmit: (data) => {
        const result = [
          ...listCreateJournal,
          {
            id: listCreateJournal.length + 1,
            ...data
          }
        ]
        setBalanceListCreateJournal(JSON.stringify(result))
        dispatch({
          type: 'depositCashier/updateState',
          payload: {
            listCreateJournal: result,
            visibleModalJournal: false
          }
        })
      }
    }

    return (
      <div className="content-inner">
        {visibleModalJournal && <ModalJournal {...modalJournalProps} />}
        <Row type="flex" style={{ marginBottom: '30px' }}>
          <Col
            style={{
              flex: 1
            }}
          >
            <Button
              type="danger"
              icon="rollback"
              onClick={handleBackButton}
              loading={loading.effects['depositCashier/queryAdd']}
            >
              Back
            </Button>
          </Col>
          <Button
            type="primary"
            icon="check"
            onClick={handleSubmit}
            loading={loading.effects['depositCashier/queryAdd']}
            disabled={listCreateJournal.length === 0}
          >
            Submit
          </Button>
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
