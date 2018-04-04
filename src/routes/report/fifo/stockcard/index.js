/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, fifoReport, loading, app }) => {
  const { listRekap, period, year, productCode, productName } = fifoReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listRekap,
    storeInfo,
    user,
    period,
    year,
    productCode,
    productName,
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
    loading: loading.effects['fifoReport/queryProductCode'],
    productCode,
    productName,
    onListReset () {
      dispatch({
        type: 'fifoReport/setNull'
      })
    },
    onOk (month, yearPeriod, data) {
      dispatch({
        type: 'fifoReport/queryCard',
        payload: {
          period: month,
          year: yearPeriod,
          productCode: (data.productCode || '').toString(),
          productName: (data.productName || '').toString()
        }
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
      dispatch({
        type: 'fifoReport/queryProductCode',
        payload: {
          period: month,
          year: yearPeriod
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
  dispatch: PropTypes.func,
  app: PropTypes.object,
  fifoReport: PropTypes.object
}

export default connect(({ fifoReport, loading, app }) => ({ fifoReport, loading, app }))(Report)
