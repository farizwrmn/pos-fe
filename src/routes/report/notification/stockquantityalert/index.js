import React from 'react'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'

const ProductStockReport = ({ productstockReport, loading, dispatch, app }) => {
  const { listProductsBelowQty, start, end } = productstockReport
  const { user, storeInfo } = app

  const arrayList = []
  for (let key in listProductsBelowQty) {
    arrayList.push(listProductsBelowQty[key])
  }

  const printProps = {
    user,
    storeInfo,
    data: arrayList
  }

  const filterProps = {
    ...printProps,
    onSearchProduct (value) {
      dispatch({
        type: 'productstockReport/queryProductsBelowMinimum',
        payload: {
          ...value,
          start,
          end
        }
      })
    },
    onResetClick () {
      dispatch({
        type: 'productstockReport/queryProductsBelowMinimum',
        payload: {
          start,
          end
        }
      })
    }
  }

  const listProps = {
    dataSource: arrayList,
    pagination: {
      pageSize: 15
    },
    loading: loading.effects['productstockReport/queryProductsBelowMinimum']
  }
  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

export default connect(({ productstockReport, app, loading }) => ({ productstockReport, app, loading }))(ProductStockReport)

