/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, purchaseReport, app }) => {
  const { listTrans, fromDate, toDate, productCode } = purchaseReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listTrans,
    listTrans,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode,
  }

  const filterProps = {
    listTrans: listTrans,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    onListReset() {
      dispatch({
        type: 'purchaseReport/setListNull',
      })
    },
    onDateChange(from, to) {
      dispatch({
        type: 'purchaseReport/queryReturn',
        payload: {
          from: from,
          to: to
        }
      })
    },
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
}

export default connect(({ purchaseReport, app }) => ({ purchaseReport, app }))(Report)
