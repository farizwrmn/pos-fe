/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, serviceReport, app }) => {
  const { list, fromDate, toDate, productCode } = serviceReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: list,
    list,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode
  }

  const filterProps = {
    list,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    onListReset () {
      dispatch({
        type: 'serviceReport/setListNull'
      })
    },
    onDateChange (from, to) {
      dispatch({
        type: 'serviceReport/query',
        payload: {
          from,
          to
        }
      })
      dispatch({
        type: 'serviceReport/setDate',
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
  dispatch: PropTypes.func,
  app: PropTypes.app,
  serviceReport: PropTypes.object
}

export default connect(({ serviceReport, app }) => ({ serviceReport, app }))(Report)
