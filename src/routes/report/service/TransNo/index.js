/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import Browse from './Browse'
import { saveAs } from 'file-saver'

const Report = ({ location, dispatch, loading, serviceReport }) => {
  const { list, pagination, fromDate, toDate, productCode, company } = serviceReport
  const { pageSize } = pagination
  const browseProps = {
    dataSource: list,
    list,
    company,
    fromDate,
    toDate,
    productCode,
    onListReset () {
      console.log('onListReset')
      dispatch({
        type: 'serviceReport/setListNull',
      })
    },
    onDateChange(from, to) {
      dispatch({
        type: 'serviceReport/query',
        payload: {
          from: from,
          to: to,
        },
      })
      dispatch({
        type: 'serviceReport/setDate',
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
  serviceReport: PropTypes.object,
}

export default connect(({ loading, serviceReport }) => ({ loading, serviceReport }))(Report)
