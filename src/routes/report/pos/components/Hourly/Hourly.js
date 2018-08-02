/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'
import FilterItem from './FilterItem'

const Report = ({ dispatch, posReport, loading, app }) => {
  const { listTrans, transTime, fromDate, toDate, productCode, filterModalVisible } = posReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listTrans,
    listTrans,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode,
    transTime,
    loading: loading.effects['posReport/queryHourly']
  }

  const filterProps = {
    listTrans,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    title: 'Filter',
    transTime,
    visible: filterModalVisible,
    onCancel () {
      dispatch({
        type: 'posReport/updateState',
        payload: {
          filterModalVisible: false
        }
      })
    },
    onListReset () {
      dispatch({
        type: 'posReport/setListNull'
      })
      dispatch({
        type: 'posReport/updateState',
        payload: {
          filterModalVisible: true
        }
      })
    },
    onDateChange (data) {
      dispatch({
        type: 'posReport/queryHourly',
        payload: data
      })
      // dispatch({
      //   type: 'posReport/setDate',
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
  posReport: PropTypes.object,
  loading: PropTypes.object.isRequired
}

export default connect(({ posReport, app, loading }) => ({ posReport, app, loading }))(Report)
