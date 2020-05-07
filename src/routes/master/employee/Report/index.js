import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Filter from './Filter'
import Browse from './Browse'

const Report = ({
  employee,
  app,
  loading,
  dispatch
}) => {
  const {
    activeKey,
    period,
    year,
    listHris
  } = employee
  const { user, storeInfo } = app
  console.log('listHris', listHris)
  const filterProps = {
    user,
    listRekap: listHris,
    activeKey,
    dispatch,
    storeInfo,
    period,
    year,
    onListReset () {
      dispatch({
        type: 'employee/setNull'
      })
    },
    onChangePeriod (month, yearPeriod) {
      dispatch({
        type: 'employee/setPeriod',
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

  const browseProps = {
    dataSource: listHris,
    loading: loading.effects['employee/getCheckinReport']
  }

  return (
    <div>
      <Filter {...filterProps} />
      <Browse {...browseProps} />
    </div>
  )
}

export default connect(({ employee, loading, app }) => ({ employee, loading, app }))(Report)
