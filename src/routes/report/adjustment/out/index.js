/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ location, dispatch, loading, adjustReport, app }) => {
  const { listOut, fromDate, toDate, productCode } = adjustReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listOut,
    listOut,
    storeInfo,
    loading: loading.effects['adjustReport/query'],
    productCode,
    onListReset () {
      dispatch({
        type: 'adjustReport/setListNull'
      })
    }
  }
  const filterProps = {
    listTrans: listOut,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    onListReset () {
      dispatch({
        type: 'adjustReport/setListNull'
      })
    },
    onDateChange (from, to) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          from,
          to
        }
      }))
    }
  }
  return (
    <div className="content-inner" style={{ clear: 'both' }}>
      <Filter {...filterProps} />
      <Browse {...browseProps} />
    </div>
  )
}

Report.propTyps = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  adjustReport: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ loading, adjustReport, app }) => ({ loading, adjustReport, app }))(Report)
