/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, fifoReport, app }) => {
  const { listRekap, period, year, productCode } = fifoReport
  const { user, storeInfo } = app

  const browseProps = {
    dataSource: listRekap,
    listRekap,
    storeInfo,
    user,
    period,
    year,
    productCode,
    onListReset () {
      dispatch({
        type: 'fifoReport/setNull'
      })
    }
  }

  const filterProps = {
    listRekap,
    user,
    dispatch,
    storeInfo,
    period,
    year,
    productCode,
    onListReset () {
      dispatch({
        type: 'fifoReport/setNull'
      })
    },
    onChangePeriod (month, yearPeriod) {
      dispatch({
        type: 'setPeriod',
        payload: {
          month,
          yearPeriod
        }
      })
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          period: month,
          year: yearPeriod
        }
      }))
    }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
    </div>
  )
}

Report.propTypes = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  fifoReport: PropTypes.object
}

export default connect(({ fifoReport, loading, app }) => ({ fifoReport, loading, app }))(Report)
