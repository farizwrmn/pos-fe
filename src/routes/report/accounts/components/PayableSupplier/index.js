/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, purchase, accountsReport, userStore, app, loading }) => {
  const { listTrans: listBySupplier, from, to, productCode } = accountsReport
  const { listSupplier } = purchase
  const { user, storeInfo } = app
  const { listAllStores } = userStore
  const browseProps = {
    dataSource: listBySupplier,
    loading: loading.effects['accountsReport/queryPayableTrans'],
    listTrans: listBySupplier,
    storeInfo,
    user,
    from,
    to,
    productCode
  }

  const filterProps = {
    listAllStores,
    listSupplier,
    listTrans: listBySupplier,
    user,
    storeInfo,
    loading,
    from,
    to,
    productCode,
    onListReset () {
      dispatch({
        type: 'accountsReport/setListNull'
      })
    },
    onDateChange (data) {
      dispatch({
        type: 'accountsReport/queryPayableTrans',
        payload: data
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
  purchase: PropTypes.object,
  app: PropTypes.object,
  accountsReport: PropTypes.object,
  userStore: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ loading, purchase, userStore, accountsReport, app }) => ({ loading, purchase, userStore, accountsReport, app }))(Report)
