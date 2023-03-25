/**
 * Created by Veirry on 09/09/2017.
*/
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { message } from 'antd'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, generalLedger, userStore, accountRule, app, loading }) => {
  const { from, to, activeKey, listProduct } = generalLedger
  const { listAllStores } = userStore
  const { listAccountCode } = accountRule
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
    loading,
    listAccountCode,
    listAllStores,
    activeKey,
    // productCode,
    // productName,
    listProduct,
    listRekap,
    user,
    dispatch,
    storeInfo,
    from,
    to,
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
      if (data.rangePicker && data.rangePicker[0]) {
        const from = moment(data.rangePicker[0]).format('YYYY-MM-DD')
        const fromPeriod = moment(data.rangePicker[0]).format('YYYY-MM')
        const to = moment(data.rangePicker[1]).format('YYYY-MM-DD')
        const toPeriod = moment(data.rangePicker[1]).format('YYYY-MM')
        if (fromPeriod === toPeriod) {
          dispatch({
            type: 'generalLedger/setPeriod',
            payload: {
              accountId: data.accountId,
              from,
              to,
              storeId: data.storeId || undefined
            }
          })
          dispatch(routerRedux.push({
            pathname: location.pathname,
            query: {
              accountId: data.accountId,
              from,
              to,
              storeId: data.storeId || undefined
            }
          }))
        } else {
          message.warning('Validation: Only access one month period')
        }
      }
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
  accountRule: PropTypes.object,
  productcategory: PropTypes.object.isRequired,
  productbrand: PropTypes.object.isRequired
}

export default connect(({ generalLedger, userStore, accountRule, productcategory, productbrand, app, loading }) => ({ generalLedger, userStore, accountRule, productcategory, productbrand, app, loading }))(Report)
