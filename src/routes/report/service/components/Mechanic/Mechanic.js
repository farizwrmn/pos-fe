/**
 * Created by Veirry on 21/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, loading, serviceReport, app }) => {
  const { list, fromDate, toDate, productCode } = serviceReport
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['serviceReport/queryMechanic'],
    dataSource: list,
    list,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode
  }

  const filterProps = {
    list,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    onListReset () {
      dispatch({
        type: 'serviceReport/setListNull'
      })
    },
    onDateChange (from, to, hasEmployee) {
      // dispatch(routerRedux.push({
      //   pathname: location.pathname,
      //   query: {
      //     from: from,
      //     to: to,
      //   },
      // }))
      dispatch({
        type: 'serviceReport/queryMechanic',
        payload: {
          from,
          to,
          hasEmployee
        }
      })
      dispatch({
        type: 'serviceReport/setDate',
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
  dispatch: PropTypes.func,
  loading: PropTypes.func,
  app: PropTypes.app,
  serviceReport: PropTypes.object
}

export default connect(({ loading, serviceReport, app }) => ({ loading, serviceReport, app }))(Report)
