/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, purchaseReport, app }) => {
  const { listDaily, fromDate, toDate, productCode, category, brand } = purchaseReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listDaily,
    listDaily,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode
  }

  const filterProps = {
    listDaily,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    category,
    brand,
    onListReset () {
      dispatch({
        type: 'purchaseReport/setListNull'
      })
    },
    onDateChange (from, to) {
      dispatch({
        type: 'purchaseReport/queryDaily',
        payload: {
          from,
          to,
          mode: 'pbc'
        }
      })
      dispatch({
        type: 'purchaseReport/setDate',
        payload: {
          from,
          to
        }
      })
    },
    onFilterChange (data) {
      dispatch({
        type: 'purchaseReport/queryDaily',
        payload: {
          ...data
        }
      })
      dispatch({
        type: 'purchaseReport/setDate',
        payload: {
          ...data
        }
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
  purchaseReport: PropTypes.object
}

export default connect(({ purchaseReport, app }) => ({ purchaseReport, app }))(Report)
