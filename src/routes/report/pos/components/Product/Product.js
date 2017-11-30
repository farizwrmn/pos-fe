/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, posReport, app }) => {
  const { list, fromDate, toDate, productCode } = posReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: list,
    list,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode,
  }

  const filterProps = {
    list: list,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    onListReset(){
      dispatch({
        type: 'posReport/setListNull',
      })
    },
    onDateChange(from, to) {
      dispatch({
        type: 'posReport/queryPart',
        payload: {
          from: from,
          to: to,
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