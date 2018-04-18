import React from 'react'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'

const ProductStockReport = ({ productstockReport, loading, dispatch, app }) => {
  const { listStockInTransit } = productstockReport
  const { user, storeInfo } = app

  const printProps = {
    user,
    storeInfo,
    data: listStockInTransit
  }

  const filterProps = {
    ...printProps,
    listStockInTransit,
    onSearchProduct (value) {
      dispatch({
        type: 'productstockReport/queryTransferStockOut',
        payload: {
          ...value
        }
      })
    },
    onResetClick () {
      dispatch({ type: 'productstockReport/queryTransferStockOut' })
    }
  }

  const listProps = {
    dataSource: listStockInTransit,
    pagination: {
      pageSize: 15
    },
    loading: loading.effects['productstockReport/queryTransferStockOut']
  }
  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

export default connect(({ productstockReport, app, loading }) => ({ productstockReport, app, loading }))(ProductStockReport)

