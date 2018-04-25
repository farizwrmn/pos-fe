/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
// import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, loading, posReport, service, productcategory, app }) => {
  const { list, listTrans, fromDate, toDate, productCode } = posReport
  const { listCategory } = productcategory
  const { user, storeInfo } = app
  const { listServiceType } = service
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
    listServiceType,
    listCategory,
    listTrans,
    list,
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
    onChangePeriod (data) {
      dispatch({
        type: 'posReport/setPeriod',
        payload: data
      })
      dispatch({
        type: 'posReport/queryTurnOver',
        payload: data
      })
      // dispatch(routerRedux.push({
      //   pathname: location.pathname,
      //   query: {
      //     period: month,
      //     year: yearPeriod,
      //     category: null,
      //     servie: null
      //   }
      // }))
    },
    showCategories () {
      dispatch({
        type: 'productcategory/query'
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
  service: PropTypes.object,
  productcategory: PropTypes.object,
  location: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ loading, posReport, service, productcategory, app }) => ({ loading, posReport, service, productcategory, app }))(Report)
