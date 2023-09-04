/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, userStore, accountingStatementBalanceSheet, loading, app }) => {
  const { listBalanceSheet, storeId, to } = accountingStatementBalanceSheet
  const { listAllStores } = userStore
  const { user, storeInfo } = app

  const browseProps = {
    loading: loading.effects['accountingStatementBalanceSheet/queryMainTotal']
      || loading.effects['accountingStatementBalanceSheet/queryChildTotalType']
      || loading.effects['accountingStatementBalanceSheet/updateStateChildBalanceSheet'],
    dataSource: listBalanceSheet,
    storeInfo,
    user,
    storeId,
    to,
    onExpandChildAccountType (accountType, storeId, to) {
      if (accountType) {
        dispatch({
          type: 'accountingStatementBalanceSheet/queryChildTotalType',
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
    loading: loading.effects['accountingStatementBalanceSheet/queryMainTotal']
      || loading.effects['accountingStatementBalanceSheet/queryChildTotalType']
      || loading.effects['accountingStatementBalanceSheet/updateStateChildBalanceSheet'],
    to,
    onListReset () {
      dispatch({
        type: 'accountingStatementBalanceSheet/setListNull'
      })
    },
    onDateChange (value) {
      const { pathname, query } = location
      dispatch({
        type: 'accountingStatementBalanceSheet/setListNull'
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
      {listBalanceSheet && listBalanceSheet.length > 0 && <Browse {...browseProps} />}
    </div>
  )
}

Report.propTyps = {
  userStore: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  accountingStatementBalanceSheet: PropTypes.object
}

export default connect(({ loading, userStore, accountingStatementBalanceSheet, app }) => ({ loading, userStore, accountingStatementBalanceSheet, app }))(Report)
