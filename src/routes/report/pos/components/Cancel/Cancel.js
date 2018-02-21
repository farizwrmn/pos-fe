/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, loading, posReport, app }) => {
  const { listTrans, fromDate, toDate, productCode } = posReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listTrans,
    listTrans,
    storeInfo,
    loading: loading.effects['posReport/query'],
    productCode,
    onListReset () {
      dispatch({
        type: 'posReport/setListNull'
      })
    }
  }
  const filterProps = {
    listTrans,
    user,
    storeInfo,
    dispatch,
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
        type: 'posReport/queryTransCancel',
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
  posReport: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ loading, posReport, app }) => ({ loading, posReport, app }))(Report)
