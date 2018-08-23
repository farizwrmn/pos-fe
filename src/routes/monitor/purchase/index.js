import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import Filter from './Filter'
import List from './List'

const PurchaseHistory = ({ purchase, loading, dispatch }) => {
  const { period, listPurchaseHistories } = purchase
  const filterProps = {
    period,
    filterChange (date) {
      dispatch({
        type: 'purchase/queryHistory',
        payload: {
          startPeriod: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          endPeriod: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
        }
      })
    },
    filterTransNo (transNo) {
      dispatch({
        type: 'purchase/queryHistoryByTransNo',
        payload: {
          transNo
        }
      })
    }
  }

  const listProps = {
    dataSource: listPurchaseHistories,
    loading: loading.effects['purchase/queryHistory'],
    printInvoice (transNo) {
      dispatch({
        type: 'purchase/queryHistoryDetail',
        payload: {
          transNo
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

PurchaseHistory.propTypes = {
  purchase: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchase, loading }) => ({ purchase, loading }))(PurchaseHistory)
