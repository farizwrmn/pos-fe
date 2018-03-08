import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, inventoryReport, app, loading }) => {
  const { listInventoryTO, period, pagination } = inventoryReport
  const { user, storeInfo } = app

  const printProps = {
    listInventoryTO,
    user,
    storeInfo,
    period
  }

  const browseProps = {
    dataSource: listInventoryTO,
    pagination,
    loading: loading.effects['inventoryReport/queryInventoryTransferOut']
  }

  const filterProps = {
    ...printProps,
    onListReset () {
      dispatch({
        type: 'inventoryReport/setListNull'
      })
    },
    onDateChange (month, year) {
      const period = `${year}-${month}`
      dispatch({
        type: 'inventoryReport/queryInventoryTransferOut',
        payload: {
          period: month,
          year
        }
      })
      dispatch({
        type: 'inventoryReport/updateState',
        payload: {
          period
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
  loading: PropTypes.object,
  inventoryReport: PropTypes.object
}

export default connect(({ inventoryReport, app, loading }) => ({ inventoryReport, app, loading }))(Report)
