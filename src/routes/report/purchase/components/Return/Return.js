/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, loading, userStore, supplier, purchaseReport, app }) => {
  const { listTrans, fromDate, toDate, productCode } = purchaseReport
  const { listAllStores } = userStore
  const { user, storeInfo } = app
  const { list } = supplier
  const browseProps = {
    dataSource: listTrans,
    listTrans,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode
  }

  const filterProps = {
    listTrans,
    listSupplier: list,
    listAllStores,
    user,
    storeInfo,
    fromDate,
    toDate,
    loading,
    productCode,
    onSearchSupplier (value) {
      dispatch({
        type: 'supplier/query',
        payload: {
          q: value
        }
      })
    },
    onListReset () {
      dispatch({
        type: 'purchaseReport/setListNull'
      })
    },
    onDateChange ({
      from,
      to,
      supplierId,
      storeId
    }) {
      dispatch({
        type: 'purchaseReport/queryReturn',
        payload: {
          from,
          to,
          supplierId,
          storeId
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
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
  userStore: PropTypes.object,
  supplier: PropTypes.object,
  purchaseReport: PropTypes.object
}

export default connect(({ loading, userStore, purchaseReport, supplier, app }) => ({ loading, userStore, purchaseReport, supplier, app }))(Report)
