/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'

const Report = ({ location, dispatch, loading, adjustReport, app }) => {
  const { listOut, pagination, fromDate, toDate, productCode } = adjustReport
  const { user, company } = app
  const { pageSize } = pagination
  const browseProps = {
    dataSource: listOut,
    listOut,
    company,
    user,
    pagination,
    fromDate,
    toDate,
    loading: loading.effects['adjustReport/query'],
    productCode,
    onListReset () {
      console.log('onListReset')
      dispatch({
        type: 'adjustReport/setListNull',
      })
    },
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize,
        },
      }))
    },
    onDateChange (from, to) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          from: from,
          to: to,
        },
      }))
    },
  }

  return (
    <div className="content-inner">
      <Browse {...browseProps} />
    </div>
  )
}

Report.propTyps = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  app: PropTypes.object,
  adjustReport: PropTypes.object,
}

export default connect(({ loading, adjustReport, app }) => ({ loading, adjustReport, app }))(Report)
