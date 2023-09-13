import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Col, Modal, Row } from 'antd'
import { lstorage } from 'utils'
import { currencyFormatter } from 'utils/string'
import List from './List'
import Filter from './Filter'
import ItemJournal from './ItemJournal'

const {
  getCurrentUserRole
} = lstorage

class DepositFinance extends React.Component {
  componentDidMount () {
    const { dispatch, location } = this.props
    const { pathname, query } = location
    const { all, ...other } = query
    const userRole = getCurrentUserRole()
    if (userRole !== 'OWN') {
      dispatch(routerRedux.push({
        pathname,
        query: other
      }))
    }
  }

  render () {
    const {
      loading,
      location,
      dispatch,
      depositFinance
    } = this.props

    const {
      list,
      pagination,

      listLedger,
      listSelectedLedger
    } = depositFinance

    const { all = false } = location.query
    const userRole = getCurrentUserRole()

    const total = listSelectedLedger.reduce((prev, curr) => { return prev + curr.debit }, 0)

    const handleClickSelectAll = () => {
      dispatch({
        type: 'depositFinance/updateState',
        payload: {
          listSelectedLedger: listLedger
            .filter(filtered => filtered.recon === 0)
            .map(record => ({
              id: record.id,
              debit: record.debit,
              transactionId: record.transactionId,
              transactionType: record.transactionType
            }))
        }
      })
    }

    const handleClickDeselectAll = () => {
      dispatch({
        type: 'depositFinance/updateState',
        payload: {
          listSelectedLedger: []
        }
      })
    }

    const handleClickReconciliation = () => {
      Modal.confirm({
        title: 'Approve ledger',
        content: 'Are you sure to approve this transaction?',
        onOk: () => {
          dispatch({
            type: 'depositFinance/queryApproveLedger',
            payload: {
              data: listSelectedLedger,
              location
            }
          })
        }
      })
    }

    const listProps = {
      loading,
      dataSource: list,
      pagination,
      onClickRecord: (transId) => {
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            transId
          }
        }))
      },
      handlePagination: (paginationProps) => {
        const { pathname, query } = location
        const { current: page, pageSize } = paginationProps
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
      all,
      userRole,
      location,
      onChangeAllStore: (event) => {
        const { checked } = event.target
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            all: checked,
            page: 1
          }
        }))
      },
      onChangeTransDate: (rangeDate) => {
        const { pathname, query } = location
        const { startDate, endDate, ...other } = query
        if (rangeDate.length > 0) {
          dispatch(routerRedux.push({
            pathname,
            query: {
              ...query,
              startDate: moment(rangeDate[0]).format('YYYY-MM-DD'),
              endDate: moment(rangeDate[1]).format('YYYY-MM-DD'),
              page: 1
            }
          }))
        } else {
          dispatch(routerRedux.push({
            pathname,
            query: {
              ...other,
              page: 1
            }
          }))
        }
      }
    }

    return (
      <div className="content-inner">
        <Row type="flex" align="middle" style={{ marginBottom: '10px' }}>
          <Filter {...filterProps} />
        </Row>
        <Row>
          <Col span={12} style={{ padding: '10px' }}>
            <List {...listProps} />
          </Col>
          <Col span={12} style={{ padding: '10px' }}>
            <Row type="flex" align="middle" justify="end" style={{ marginBottom: '10px' }}>
              <h3 style={{ fontWeight: 'bold', flex: 1 }}>List Ledger</h3>
            </Row>
            <Row type="flex" align="middle" style={{ marginBottom: '10px' }}>
              {listSelectedLedger.length > 0
                ? (
                  <Button
                    type="danger"
                    icon="close"
                    onClick={handleClickDeselectAll}
                    loading={loading.effects['depositFinance/queryApproveLedger'] || loading.effects['depositFinance/queryLedger']}
                  >
                    Deselect All
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleClickSelectAll}
                    loading={loading.effects['depositFinance/queryApproveLedger'] || loading.effects['depositFinance/queryLedger']}
                    disabled={listLedger.filter(filtered => filtered.recon === 0).length === 0}
                  >
                    Select All
                  </Button>
                )}
              {listSelectedLedger.length > 0 && (
                <Button
                  type="primary"
                  icon="check"
                  onClick={handleClickReconciliation}
                  style={{ marginLeft: '10px' }}
                  loading={loading.effects['depositFinance/queryApproveLedger'] || loading.effects['depositFinance/queryLedger']}
                >
                  {`Approve (Total: ${currencyFormatter(total)})`}
                </Button>
              )}
            </Row>
            {listLedger && listLedger.length > 0 && listLedger.map((record) => {
              const isChecked = listSelectedLedger.find(item => item.id === record.id)
              const itemJournalProps = {
                item: record,
                isChecked: !!isChecked,
                listSelectedLedger,
                loading: loading.effects['depositFinance/queryApproveLedger'] || loading.effects['depositFinance/queryLedger'],
                handleCheckItem: (result) => {
                  dispatch({
                    type: 'depositFinance/updateState',
                    payload: {
                      listSelectedLedger: result
                    }
                  })
                }
              }
              return (
                <ItemJournal {...itemJournalProps} />
              )
            })}
          </Col>
        </Row >
      </div >
    )
  }
}

export default connect(({
  loading,
  depositFinance
}) => ({
  loading,
  depositFinance
}))(DepositFinance)
