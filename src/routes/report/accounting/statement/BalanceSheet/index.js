/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, accountingStatementReport, loading, app }) => {
  const { listTrans, from, to, productCode } = accountingStatementReport
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['accountingStatementReport/queryCashFlow'],
    dataSource: listTrans,
    listTrans,
    storeInfo,
    user,
    from,
    to,
    productCode
  }

  const filterProps = {
    listTrans,
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
    onDateChange (from, to) {
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
          from,
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
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  accountingStatementReport: PropTypes.object
}

export default connect(({ loading, accountingStatementReport, app }) => ({ loading, accountingStatementReport, app }))(Report)
