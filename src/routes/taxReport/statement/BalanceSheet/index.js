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
  const { listBalanceSheet: listTrans, listProfit, from, to, productCode } = accountingStatementReport
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['accountingStatementReport/queryBalanceSheet'] || loading.effects['accountingStatementReport/query'],
    dataSource: listTrans,
    listTrans,
    listProfit,
    storeInfo,
    user,
    from,
    to,
    productCode
  }

  const filterProps = {
    listAllStores,
    listTrans,
    listProfit,
    user,
    storeInfo,
    from,
    to,
    productCode,
    onListReset () {
      dispatch({
        type: 'accountingStatementReport/setListNull'
      })
    },
    onDateChange (value) {
      const { pathname, query } = location
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
