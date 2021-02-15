/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, accountsReport, userStore, loading, app }) => {
  const { listTrans, from, to, productCode } = accountsReport
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const browseProps = {
    loading: loading.effects['accountsReport/queryTrans'],
    dataSource: listTrans,
    listTrans,
    storeInfo,
    user,
    from,
    to,
    productCode
  }

  const filterProps = {
    listAllStores,
    listTrans,
    user,
    loading,
    storeInfo,
    from,
    to,
    productCode,
    onListReset () {
      dispatch({
        type: 'accountsReport/setListNull'
      })
    },
    onDateChange (from, to, storeId) {
      dispatch({
        type: 'accountsReport/queryTrans',
        payload: {
          from,
          to,
          storeId
        }
      })
      dispatch({
        type: 'accountsReport/setDate',
        payload: {
          from,
          to
        }
      })
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
  userStore: PropTypes.object,
  accountsReport: PropTypes.object
}

export default connect(({ loading, userStore, accountsReport, app }) => ({ loading, userStore, accountsReport, app }))(Report)
