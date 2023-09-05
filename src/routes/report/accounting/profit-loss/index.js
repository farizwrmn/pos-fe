/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, userStore, accountingStatementProfitLoss, loading, app }) => {
  const { listProfitLoss, storeId, from, to } = accountingStatementProfitLoss
  const { listAllStores } = userStore
  const { user, storeInfo } = app

  const browseProps = {
    loading: loading.effects['accountingStatementProfitLoss/queryMainTotal']
      || loading.effects['accountingStatementProfitLoss/queryChildTotalType']
      || loading.effects['accountingStatementProfitLoss/updateStateChildBalanceSheet'],
    dataSource: listProfitLoss,
    storeInfo,
    user,
    storeId,
    from,
    to,
    onExpandChildAccountType (accountType, storeId, to) {
      if (accountType) {
        dispatch({
          type: 'accountingStatementProfitLoss/queryChildTotalType',
          payload: {
            accountType, storeId, to
          }
        })
      }
    }
  }

  const filterProps = {
    listAllStores,
    user,
    storeInfo,
    loading: loading.effects['accountingStatementProfitLoss/queryMainTotal']
      || loading.effects['accountingStatementProfitLoss/queryChildTotalType']
      || loading.effects['accountingStatementProfitLoss/updateStateChildBalanceSheet'],
    from,
    to,
    onListReset () {
      dispatch({
        type: 'accountingStatementProfitLoss/setListNull'
      })
    },
    onDateChange (value) {
      const { pathname, query } = location
      dispatch({
        type: 'accountingStatementProfitLoss/setListNull'
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
      {listProfitLoss && listProfitLoss.length > 0 && <Browse {...browseProps} />}
    </div>
  )
}

Report.propTyps = {
  userStore: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  accountingStatementProfitLoss: PropTypes.object
}

export default connect(({ loading, userStore, accountingStatementProfitLoss, app }) => ({ loading, userStore, accountingStatementProfitLoss, app }))(Report)
