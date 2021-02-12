/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, accountingStatementReport, fifoReport, loading, app }) => {
  const { listBalanceSheet: listTrans, listProfit, from, to, productCode } = accountingStatementReport
  const { listRekap } = fifoReport
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['accountingStatementReport/queryBalanceSheet'],
    dataSource: listTrans,
    listTrans,
    listProfit,
    listRekap,
    storeInfo,
    user,
    from,
    to,
    productCode
  }

  const filterProps = {
    listTrans,
    listProfit,
    listRekap,
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
    onDateChange (to) {
      // dispatch({
      //   type: 'accountingStatementReport/queryBalanceSheet',
      //   payload: {
      //     from,
      //     to
      //   }
      // })
      // dispatch({
      //   type: 'accountingStatementReport/setDate',
      //   payload: {
      //     from,
      //     to
      //   }
      // })
      const { pathname, query } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          to
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
  fifoReport: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  accountingStatementReport: PropTypes.object
}

export default connect(({ loading, fifoReport, accountingStatementReport, app }) => ({ loading, fifoReport, accountingStatementReport, app }))(Report)
