/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, purchase, fifoReport, loading, app }) => {
  const { listSupplier } = purchase
  const { period, year, activeKey } = fifoReport
  let { listRekap } = fifoReport
  if (activeKey === '1') {
    listRekap = listRekap.filter(el => el.count !== 0)
  }
  const { user, storeInfo } = app

  const browseProps = {
    dataSource: listRekap,
    loading: loading.effects['fifoReport/queryInAdj']
  }

  const filterProps = {
    listSupplier,
    activeKey,
    listRekap,
    user,
    dispatch,
    storeInfo,
    period,
    year,
    onListReset () {
      dispatch({
        type: 'fifoReport/setNull'
      })
    },
    onChangePeriod (month, yearPeriod) {
      dispatch({
        type: 'fifoReport/setPeriod',
        payload: {
          month,
          yearPeriod
        }
      })
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          period: month,
          year: yearPeriod,
          activeKey
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
  purchase: PropTypes.object,
  fifoReport: PropTypes.object
}

export default connect(({ purchase, fifoReport, loading, app }) => ({ purchase, fifoReport, loading, app }))(Report)
