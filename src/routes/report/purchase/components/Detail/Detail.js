import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, loading, purchaseReport, app }) => {
  const { listPurchase, listPurchaseDetail, fromDate, toDate } = purchaseReport
  const { user, storeInfo } = app

  const listData = _.map(listPurchase, (item) => {
    return Object.assign(item, {
      items: _.filter(listPurchaseDetail, { transNo: item.transNo })
    })
  })

  const browseProps = {
    dataSource: listPurchaseDetail,
    loading: loading.effects['purchaseReport/queryPurchase']
  }

  const filterProps = {
    listData,
    user,
    storeInfo,
    fromDate,
    toDate,
    onListReset () {
      dispatch({
        type: 'purchaseReport/setListNull'
      })
    },
    onDateChange (date) {
      dispatch({
        type: 'purchaseReport/queryPurchase',
        payload: {
          startPeriod: date[0],
          endPeriod: date[1]
        }
      })
      dispatch({
        type: 'purchaseReport/queryPurchaseDetail',
        payload: {
          transDate: date
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
  purchaseReport: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ loading, purchaseReport, app }) => ({ loading, purchaseReport, app }))(Report)
