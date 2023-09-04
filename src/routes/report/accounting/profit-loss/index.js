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

const Report = ({ dispatch, userStore, accountingStatementProfitLoss, loading, app }) => {
  const { from, to, listProfitLoss, modalBalanceSheetDetailVisible } = accountingStatementProfitLoss
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['accountingStatementProfitLoss/queryMainTotal']
      || loading.effects['accountingStatementProfitLoss/queryChildTotalType']
      || loading.effects['accountingStatementProfitLoss/updateStateChildBalanceSheet'],
    listTrans: listProfitLoss,
    storeInfo,
    user,
    from,
    to,
    onGetDetail (record) {
      if (record.id) {
        dispatch({
          type: 'accountingStatementProfitLoss/updateState',
          payload: {
            modalBalanceSheetDetailVisible: true,
            listDetailStore: []
          }
        })
        dispatch({
          type: 'accountingStatementProfitLoss/queryBalanceSheetDetailStore',
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
    loading,
    user,
    storeInfo,
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

  const modalBalanceSheetDetailProps = {
    footer: null,
    visible: modalBalanceSheetDetailVisible,
    loading: loading.effects['accountingStatementProfitLoss/queryBalanceSheet']
      || loading.effects['accountingStatementProfitLoss/queryBalanceSheetDetailStore']
      || loading.effects['accountingStatementProfitLoss/query']
      || loading.effects['accountingStatementProfitLoss/queryDetailStore'],
    onCancel () {
      dispatch({
        type: 'accountingStatementProfitLoss/updateState',
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
  accountingStatementProfitLoss: PropTypes.object
}

export default connect(({ loading, userStore, accountingStatementProfitLoss, app }) => ({ loading, userStore, accountingStatementProfitLoss, app }))(Report)
