/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { message } from 'antd'
import ModalBalanceSheetDetail from './ModalBalanceSheetDetail'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, userStore, accountingStatementReport, loading, app }) => {
  const { modalBalanceSheetDetailVisible, storeId, listDetailStore, listProfit: listTrans, listProfitCompare: listCompare, from, to, compareFrom, compareTo, productCode } = accountingStatementReport
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['accountingStatementReport/query'],
    listCompare,
    listTrans,
    storeInfo,
    user,
    from,
    to,
    compareFrom,
    compareTo,
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
          type: 'accountingStatementReport/queryDetailStore',
          payload: {
            accountId: record.id,
            from,
            to
          }
        })
      } else {
        message.warning('Cannot get detail of this account, please use general ledger')
      }
    }
  }

  const filterProps = {
    loading,
    listAllStores,
    listTrans,
    user,
    compareFrom,
    compareTo,
    storeInfo,
    storeId,
    from,
    to,
    productCode,
    onListReset () {
      dispatch({
        type: 'accountingStatementReport/setListNull'
      })
    },
    onDateChange (value = {}) {
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
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  userStore: PropTypes.object,
  accountingStatementReport: PropTypes.object
}

export default connect(({ loading, userStore, accountingStatementReport, app }) => ({ loading, userStore, accountingStatementReport, app }))(Report)
