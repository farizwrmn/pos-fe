/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'
import FilterItem from './FilterItem'

const Report = ({ dispatch, marketingReport, loading, app }) => {
  const { listTrans, fromDate, toDate, productCode, filterModalVisible } = marketingReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listTrans,
    listTrans,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode,
    loading: loading.effects['marketingReport/queryHourly']
  }

  const filterProps = {
    listTrans,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    title: 'Filter',
    visible: filterModalVisible,
    onCancel () {
      dispatch({
        type: 'marketingReport/updateState',
        payload: {
          filterModalVisible: false
        }
      })
    },
    onListReset () {
      dispatch({
        type: 'marketingReport/setListNull'
      })
      dispatch({
        type: 'marketingReport/updateState',
        payload: {
          filterModalVisible: true
        }
      })
    },
    onDateChange (data) {
      dispatch({
        type: 'marketingReport/queryHourly',
        payload: {
          fromDate: data.transDate[0],
          toDate: data.transDate[1],
          ...data
        }
      })
      // dispatch({
      //   type: 'marketingReport/setDate',
      //   payload: {
      //     from,
      //     to
      //   }
      // })
    }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Browse {...browseProps} />
      {filterModalVisible && <FilterItem {...filterProps} />}
    </div>
  )
}

Report.propTyps = {
  dispatch: PropTypes.func.isRequired,
  app: PropTypes.object,
  marketingReport: PropTypes.object,
  loading: PropTypes.object.isRequired
}

export default connect(({ marketingReport, app, loading }) => ({ marketingReport, app, loading }))(Report)
