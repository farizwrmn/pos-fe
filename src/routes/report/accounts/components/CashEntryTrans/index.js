/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, cashEntryReport, app }) => {
  const { listTrans, from, to } = cashEntryReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listTrans,
    listTrans,
    storeInfo,
    user,
    from,
    to
  }

  const filterProps = {
    listTrans,
    user,
    storeInfo,
    from,
    to,
    onListReset () {
      dispatch({
        type: 'cashEntryReport/setListNull'
      })
    },
    onDateChange (from, to) {
      dispatch({
        type: 'cashEntryReport/queryTrans',
        payload: {
          from,
          to,
          field: 'id,transNo,transDate,reference,amountIn,amountOut'
        }
      })
      dispatch({
        type: 'cashEntryReport/setDate',
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
  cashEntryReport: PropTypes.object
}

export default connect(({ cashEntryReport, app }) => ({ cashEntryReport, app }))(Report)
