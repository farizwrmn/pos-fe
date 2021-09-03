/**
 * Created by Veirry on 09/09/2017.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, generalLedger, accountCode, app, loading }) => {
  const { period, year, activeKey, listProduct } = generalLedger
  const { listAccountCode } = accountCode
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
    listAccountCode,
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
    onChangePeriod (data) {
      dispatch({
        type: 'generalLedger/setPeriod',
        payload: {
          accountId: data.accountId,
          from: moment(data.rangePicker[0]).format('YYYY-MM-DD'),
          to: moment(data.rangePicker[1]).format('YYYY-MM-DD')
        }
      })
      dispatch(routerRedux.push({
        pathname: location.pathname,
        query: {
          accountId: data.accountId,
          from: moment(data.rangePicker[0]).format('YYYY-MM-DD'),
          to: moment(data.rangePicker[1]).format('YYYY-MM-DD')
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
  accountCode: PropTypes.object,
  productcategory: PropTypes.object.isRequired,
  productbrand: PropTypes.object.isRequired
}

export default connect(({ generalLedger, accountCode, productcategory, productbrand, app, loading }) => ({ generalLedger, accountCode, productcategory, productbrand, app, loading }))(Report)
