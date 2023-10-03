/**
 * Created by Veirry on 09/09/2017.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import { message } from 'antd'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, userStore, generalLedger, app, loading }) => {
  const { period, year, from, to, storeId, activeKey, listProduct } = generalLedger
  const { listAllStores } = userStore
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
    listAllStores,
    listProduct,
    listRekap,
    storeId,
    user,
    from,
    to,
    dispatch,
    storeInfo,
    loading,
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
    onDateChange (from, to, storeId) {
      const fromPeriod = moment(from, 'YYYY-MM-DD').format('YYYY-MM')
      const toPeriod = moment(to, 'YYYY-MM-DD').format('YYYY-MM')
      if (fromPeriod === toPeriod) {
        const { pathname, query } = location
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            storeId: storeId || undefined,
            from,
            to
          }
        }))
      } else {
        message.warning('Validation: Only access one month period')
      }
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

export default connect(({ generalLedger, userStore, productcategory, productbrand, app, loading }) => ({ generalLedger, userStore, productcategory, productbrand, app, loading }))(Report)
