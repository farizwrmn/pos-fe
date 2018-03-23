import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, inventoryReport, app, loading }) => {
  const { listInventoryTransfer, period, activeKey } = inventoryReport
  const { user, storeInfo } = app

  const printProps = {
    listInventoryTransfer,
    user,
    storeInfo,
    period
  }

  const browseProps = {
    dataSource: listInventoryTransfer,
    loading: loading.effects['inventoryReport/queryInventoryTransferIn']
  }

  const filterProps = {
    ...printProps,
    dispatch,
    activeKey,
    onListReset () {
      dispatch({
        type: 'inventoryReport/setListNull'
      })
    },
    onDateChange (month, year) {
      const period = `${year}-${month}`
      const { query, pathname } = location
      dispatch({
        type: 'inventoryReport/updateState',
        payload: {
          period
        }
      })
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          activeKey,
          period: month,
          year
        }
      }))
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
