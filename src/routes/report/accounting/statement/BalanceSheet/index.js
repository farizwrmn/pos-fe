/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, userStore, accountingStatementReport, loading, app }) => {
  const { listBalanceSheet: listTrans, listBalanceSheetCompare: listCompare, listProfit, listProfitCompare, compareFrom, compareTo, from, to, productCode } = accountingStatementReport
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['accountingStatementReport/queryBalanceSheet'] || loading.effects['accountingStatementReport/query'],
    listTrans,
    listCompare,
    listProfit,
    listProfitCompare,
    storeInfo,
    user,
    compareFrom,
    compareTo,
    from,
    to,
    productCode
  }

  const filterProps = {
    listAllStores,
    listTrans,
    listProfit,
    listProfitCompare,
    loading,
    user,
    storeInfo,
    from,
    to,
    listCompare,
    compareFrom,
    compareTo,
    productCode,
    onListReset () {
      dispatch({
        type: 'accountingStatementReport/setListNull'
      })
    },
    onDateChange (value) {
      const { pathname, query } = location
      dispatch({
        type: 'accountingStatementReport/setListNull'
      })
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...value
        }
      }))
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
  userStore: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  accountingStatementReport: PropTypes.object
}

export default connect(({ loading, userStore, accountingStatementReport, app }) => ({ loading, userStore, accountingStatementReport, app }))(Report)
