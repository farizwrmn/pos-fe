import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, loading, posReport, app }) => {
  const { listPOS, listPOSDetail, fromDate, toDate } = posReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listPOSDetail,
    loading: loading.effects['posReport/queryPOSDetail']
  }

  const listData = _.map(listPOS, (item) => {
    return Object.assign(item, { items: _.filter(listPOSDetail, { transNo: item.transNo }) })
  })

  const filterProps = {
    listData,
    user,
    storeInfo,
    fromDate,
    toDate,
    onDateChange (from, to) {
      dispatch({
        type: 'posReport/queryPOS',
        payload: {
          startPeriod: from,
          endPeriod: to
        }
      })
      dispatch({
        type: 'posReport/queryPOSDetail',
        payload: {
          from,
          to
        }
      })
    },
    onListReset () {
      dispatch({
        type: 'posReport/setListNull'
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
  posReport: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ loading, posReport, app }) => ({ loading, posReport, app }))(Report)
