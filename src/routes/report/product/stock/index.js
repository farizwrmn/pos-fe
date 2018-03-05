import React from 'react'
import { connect } from 'dva'
import List from './List'
import Filter from './Filter'

const ProductStockReport = ({ productstockReport, loading, dispatch }) => {
  const { listProductsBelowQty } = productstockReport
  const arrayList = []
  for (let key in listProductsBelowQty) {
    arrayList.push(listProductsBelowQty[key])
  }

  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'productstockReport/queryProductsBelowMinimum',
        payload: {
          start: value.period[0],
          end: value.period[1],
          productName: value.searchName
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

export default connect(({ productstockReport, loading }) => ({ productstockReport, loading }))(ProductStockReport)

