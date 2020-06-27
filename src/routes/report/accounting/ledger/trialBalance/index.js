/**
 * Created by Veirry on 09/09/2017.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, generalLedger, app, loading }) => {
  const { period, year, activeKey, listProduct } = generalLedger
  let { listRekap } = generalLedger
  if (activeKey === '1') {
    listRekap = listRekap.filter(el => el.count !== 0)
  }

  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listRekap,
    activeKey,
    loading: loading.effects['generalLedger/queryCard']
  }

  const filterProps = {
    activeKey,
    // productCode,
    // productName,
    listProduct,
    listRekap,
    user,
    dispatch,
    storeInfo,
    period,
    year,
    onListReset () {
      if (activeKey === '3') {
        dispatch({
          type: 'generalLedger/setNullProduct'
        })
      }
      dispatch({
        type: 'setNull'
      })
    },
    onOk (month, yearPeriod, data) {
      dispatch({
        type: 'generalLedger/queryCard',
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
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          period: month,
          year: yearPeriod,
          activeKey
        }
      }))
    },
    onShowCategories () {
      dispatch({ type: 'productcategory/query' })
    },
    onShowBrands () {
      dispatch({ type: 'productbrand/query' })
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
  app: PropTypes.object.isRequired,
  generalLedger: PropTypes.object.isRequired,
  productcategory: PropTypes.object.isRequired,
  productbrand: PropTypes.object.isRequired
}

export default connect(({ generalLedger, productcategory, productbrand, app, loading }) => ({ generalLedger, productcategory, productbrand, app, loading }))(Report)
