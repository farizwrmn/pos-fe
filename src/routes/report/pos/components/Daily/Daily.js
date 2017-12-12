/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, posReport, app }) => {
  const { listDaily, fromDate, toDate, productCode, category, brand } = posReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listDaily,
    listDaily,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode,
  }

  const filterProps = {
    listDaily: listDaily,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    category,
    brand,
    onListReset() {
      dispatch({
        type: 'posReport/setListNull',
      })
    },
    onDateChange(from, to) {
      dispatch({
        type: 'posReport/queryDaily',
        payload: {
          from: from,
          to: to,
          mode: 'pbc'
        },
      })
      dispatch({
        type: 'posReport/setDate',
        payload: {
          from: from,
          to: to,
        },
      })
    },
    onFilterChange(data) {
      dispatch({
        type: 'posReport/queryDaily',
        payload: {
          ...data
        },
      })
      dispatch({
        type: 'posReport/setDate',
        payload: {
          ...data
        },
      })
    }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
    </div>
  )
}

Report.propTyps = {
  dispatch: PropTypes.func,
  app: PropTypes.object,
  posReport: PropTypes.object,
}

export default connect(({ posReport, app }) => ({ posReport, app }))(Report)