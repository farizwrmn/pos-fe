import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, sellpriceReport, app, loading }) => {
  const { listInventoryTransfer, period, activeKey } = sellpriceReport
  const { user, storeInfo } = app

  const printProps = {
    listInventoryTransfer: listInventoryTransfer || [],
    user,
    storeInfo,
    period
  }

  const browseProps = {
    dataSource: listInventoryTransfer || [],
    loading: loading.effects['sellpriceReport/queryInventoryTransferIn']
  }

  const filterProps = {
    ...printProps,
    dispatch,
    activeKey,
    onListReset () {
      dispatch({
        type: 'sellpriceReport/setListNull'
      })
    },
    onDateChange (month, year, data) {
      const period = `${year}-${month}`
      const { query, pathname } = location
      dispatch({
        type: 'sellpriceReport/updateState',
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
          transNo: data,
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
  sellpriceReport: PropTypes.object
}

export default connect(({ sellpriceReport, app, loading }) => ({ sellpriceReport, app, loading }))(Report)
