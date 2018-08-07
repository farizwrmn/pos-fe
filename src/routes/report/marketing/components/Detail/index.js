import React from 'react'
import { connect } from 'dva'
import Filter from './Filter'
import List from './List'

const Detail = ({ promo, dispatch, app, loading }) => {
  const { listMarketingPromo, pagination, fromDate, toDate } = promo
  const { user, storeInfo } = app
  const filterProps = {
    user,
    storeInfo,
    fromDate,
    toDate,
    listData: listMarketingPromo,
    onDateChange (from, to) {
      dispatch({
        type: 'promo/queryPromoDetail',
        payload: { from, to }
      })
    },
    resetList () {
      dispatch({
        type: 'promo/updateState',
        payload: {
          listMarketingPromo: [],
          pagination: { total: 0 }
        }
      })
    }
  }

  const listProps = {
    dataSource: listMarketingPromo,
    pagination,
    loading: loading.effects['promo/queryPromoDetail']
  }
  return (
    <div>
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}
export default connect(({ promo, loading, app }) => ({ promo, loading, app }))(Detail)

