import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Filter from './Filter'
import List from './List'

const Detail = ({ marketingReport, dispatch, app, loading }) => {
  const { listTrans, pagination, fromDate, toDate } = marketingReport
  const { user, storeInfo } = app
  const filterProps = {
    user,
    storeInfo,
    fromDate,
    toDate,
    listTrans,
    onDateChange (from, to, year) {
      dispatch({
        type: 'marketingReport/queryTarget',
        payload: { from, to, year }
      })
    },
    resetList () {
      dispatch({
        type: 'marketingReport/updateState',
        payload: {
          listTrans: [],
          pagination: { total: 0 }
        }
      })
    }
  }

  const listProps = {
    dataSource: listTrans,
    pagination,
    loading: loading.effects['marketingReport/queryTarget']
  }
  return (
    <div>
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

Detail.propTypes = {
  marketingReport: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
}

export default connect(({ marketingReport, loading, app }) => ({ marketingReport, loading, app }))(Detail)

