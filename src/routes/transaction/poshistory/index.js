import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import Filter from './Filter'
import List from './List'

const PosHistory = ({ poshistory, loading, dispatch, location }) => {
  const { period, list, status } = poshistory
  const filterProps = {
    period,
    status,
    filter: {
      ...location.query
    },
    filterChange (date, stats) {
      dispatch({
        type: 'poshistory/query',
        payload: {
          start: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD'),
          status: stats
        }
      })
    },
    filterTransNo (date, stats, no) {
      dispatch({
        type: 'poshistory/query',
        payload: {
          start: moment(date, 'YYYY-MM').startOf('month').format('YYYY-MM-DD'),
          end: moment(date, 'YYYY-MM').endOf('month').format('YYYY-MM-DD'),
          status: stats,
          transNo: no
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['poshistory/query'],
    location
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

PosHistory.propTypes = {
  poshistory: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ poshistory, loading }) => ({ poshistory, loading }))(PosHistory)
