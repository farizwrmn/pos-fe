import React from 'react'
import moment from 'moment'
import { Button, Modal, Row } from 'antd'
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
    selectedBalanceResolve: undefined,
    journalType: '',

    selectedJournal: undefined
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
      journalType,

      selectedJournal
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
      if (listCreateJournal && listCreateJournal.length > 0) {
        Modal.confirm({
          title: 'Cancel Form',
          content: (
            <div>
              <Row>
                Are you sure to cancel this form?
              </Row>
              <Row>
                {'(NB: All changes wouldn\'t be save)'}
              </Row>
            </div>
          ),
          onOk: () => {
            dispatch(routerRedux.push('/setoran/cashier'))
          }
        })
      } else {
        dispatch(routerRedux.push('/setoran/cashier'))
      }
    }

    const handleModalJournal = () => {
      if (visibleModalJournal) {
        this.setState({
          selectedBalanceResolve: undefined,
          journalType: '',
          selectedJournal: undefined
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
      if (!listDetail || listDetail.length === 0) {
        Modal.warning({
          title: 'Submittion Failed',
          content: 'Balance is empty!'
        })
        return
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
      handleChangePagination: (paginationProps) => {
        const { current: page, pageSize } = paginationProps
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

    const listJournalProps = {
      loading,
      dataSource: listCreateJournal,
      handleAddButton: () => {
        this.setState({
          journalType: 'normal'
        })
        handleModalJournal()
      },
      handleEdit: (data) => {
        this.setState({
          selectedJournal: data,
          journalType: data.journalType
        })
        handleModalJournal()
      },
      handleDelete: (data) => {
        const filteredListCreateJournal = listCreateJournal.filter(filtered => filtered.id !== data.id)
        const result = filteredListCreateJournal.map((record, index) => ({
          ...record,
          id: index + 1
        }))
        setBalanceListCreateJournal(JSON.stringify(result))
        dispatch({
          type: 'depositCashier/updateState',
          payload: {
            listCreateJournal: result
          }
        })
      }
    }

    const filterProps = {
      location,
      handleChangeDate: (rangeDate) => {
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            startDate: moment(rangeDate[0]).format('YYYY-MM-DD'),
            endDate: moment(rangeDate[0]).format('YYYY-MM-DD')
          }
        }))
      }
    }

    const modalJournalProps = {
      journalType,
      selectedBalanceResolve,
      selectedJournal,
      listAccountCodeLov,
      visible: visibleModalJournal,
      listResolveOption,
      onCancel: handleModalJournal,
      onEdit: (data) => {
        Modal.confirm({
          title: 'Submit Edited Journal',
          content: 'Are you sure to overwrite this journal?',
          onOk: () => {
            const result = listCreateJournal.map((record) => {
              if (record.id === data.id) {
                return ({
                  ...data
                })
              }

              return ({
                ...record
              })
            })
            setBalanceListCreateJournal(JSON.stringify(result))
            handleModalJournal()
            dispatch({
              type: 'depositCashier/updateState',
              payload: {
                listCreateJournal: result
              }
            })
          }
        })
      },
      onSubmit: (data) => {
        const result = [
          ...listCreateJournal,
          {
            id: listCreateJournal.length + 1,
            ...data
          }
        ]
        setBalanceListCreateJournal(JSON.stringify(result))
        handleModalJournal()
        dispatch({
          type: 'depositCashier/updateState',
          payload: {
            listCreateJournal: result
          }
        })
      }
    }

    return (
      <div className="content-inner">
        {visibleModalJournal && <ModalJournal {...modalJournalProps} />}
        <Row style={{ marginBottom: '30px' }}>
          <Button
            type="danger"
            icon="rollback"
            onClick={handleBackButton}
            loading={loading.effects['depositCashier/queryAdd']}
            style={{ marginRight: '10px' }}
          >
            Cancel
          </Button>
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
        <Row type="flex" justify="end" style={{ marginBottom: '10px' }}>
          <Filter {...filterProps} />
        </Row>
        <Row style={{ marginBottom: '30px' }}>
          <ListBalance {...listBalanceProps} />
        </Row>
        <Row style={{ marginBottom: '10px' }}>
          <ListJournal {...listJournalProps} />
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
