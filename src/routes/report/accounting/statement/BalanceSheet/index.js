/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { message } from 'antd'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'
import ModalBalanceSheetDetail from './ModalBalanceSheetDetail'

const Report = ({ dispatch, userStore, accountingStatementReport, loading, app }) => {
  const { modalBalanceSheetDetailVisible, listDetailStore, listBalanceSheet: listTrans, listBalanceSheetCompare: listCompare, listProfit, listProfitCompare, compareFrom, compareTo, from, to, productCode } = accountingStatementReport
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['accountingStatementReport/queryBalanceSheet']
      || loading.effects['accountingStatementReport/queryBalanceSheetDetailStore']
      || loading.effects['accountingStatementReport/query']
      || loading.effects['accountingStatementReport/queryDetailStore'],
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
    productCode,
    onGetDetail (record) {
      if (record.id) {
        dispatch({
          type: 'accountingStatementReport/updateState',
          payload: {
            modalBalanceSheetDetailVisible: true,
            listDetailStore: []
          }
        })
        dispatch({
          type: 'accountingStatementReport/queryBalanceSheetDetailStore',
          payload: {
            accountId: record.id,
            to
          }
        })
      } else {
        message.warning('Cannot get detail of this account, please use general ledger')
      }
    }
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

  const modalBalanceSheetDetailProps = {
    footer: null,
    visible: modalBalanceSheetDetailVisible,
    loading: loading.effects['accountingStatementReport/queryBalanceSheet']
      || loading.effects['accountingStatementReport/queryBalanceSheetDetailStore']
      || loading.effects['accountingStatementReport/query']
      || loading.effects['accountingStatementReport/queryDetailStore'],
    listDetailStore,
    onCancel () {
      dispatch({
        type: 'accountingStatementReport/updateState',
        payload: {
          modalBalanceSheetDetailVisible: false,
          listDetailStore: []
        }
      })
    }
  }

  return (
    <div className="content-inner">
      {modalBalanceSheetDetailVisible && <ModalBalanceSheetDetail {...modalBalanceSheetDetailProps} />}
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
