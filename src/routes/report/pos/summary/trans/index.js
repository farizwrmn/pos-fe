/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'

const Report = ({ location, dispatch, loading, posReport, app }) => {
  const { listTrans, pagination, fromDate, toDate, productCode } = posReport
  const { user, storeInfo } = app
  const { pageSize } = pagination
  const browseProps = {
    dataSource: listTrans,
    listTrans,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode,
    onListReset () {
      console.log('onListReset')
      dispatch({
        type: 'posReport/setListNull',
      })
    },
    onDateChange(from, to) {
      dispatch({
        type: 'posReport/queryTrans',
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

  const filterProps = {
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          ...value,
          page: 1,
          pageSize,
        },
      }))
    },
    onSearch (fieldsValue) {
      fieldsValue.keyword.length ? dispatch(routerRedux.push({
        pathname: '/report/pos/monthly',
        query: {
          field: fieldsValue.field,
          keyword: fieldsValue.keyword,
        },
      })) : dispatch(routerRedux.push({
        pathname: '/report/pos/monthly',
      }))
    },
    onSearchHide () { dispatch({ type: 'customer/searchHide' }) },
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
  posReport: PropTypes.object,
}

export default connect(({ loading, posReport, app }) => ({ loading, posReport, app }))(Report)
