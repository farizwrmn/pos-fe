/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, posReport, app }) => {
  const { listTrans, fromDate, toDate, productCode } = posReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listTrans,
    listTrans,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode
  }

  const filterProps = {
    listTrans,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    onListReset () {
      dispatch({
        type: 'posReport/setListNull'
      })
    },
    onDateChange (from, to) {
      dispatch({
        type: 'posReport/queryTrans',
        payload: {
          from,
          to
        }
      })
      dispatch({
        type: 'posReport/setDate',
        payload: {
          from,
          to
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
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  posReport: PropTypes.object
}

export default connect(({ posReport, app }) => ({ posReport, app }))(Report)
