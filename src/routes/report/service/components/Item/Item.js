/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'
import FilterItem from './FilterItem'

const Report = ({ dispatch, serviceReport, loading, app }) => {
  const { list, fromDate, toDate, filterModalVisible } = serviceReport
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: list,
    list,
    storeInfo,
    user,
    fromDate,
    toDate,
    loading: loading.effects['marketingReport/queryHourly']
  }

  const filterProps = {
    list,
    user,
    storeInfo,
    fromDate,
    toDate,
    title: 'Filter',
    visible: filterModalVisible,
    onCancel () {
      dispatch({
        type: 'serviceReport/updateState',
        payload: {
          filterModalVisible: false
        }
      })
    },
    onListReset () {
      dispatch({
        type: 'serviceReport/setListNull'
      })
      dispatch({
        type: 'serviceReport/updateState',
        payload: {
          filterModalVisible: true
        }
      })
    },
    onDateChange (data) {
      dispatch({
        type: 'serviceReport/queryHourly',
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
  serviceReport: PropTypes.object,
  loading: PropTypes.object.isRequired
}

export default connect(({ serviceReport, app, loading }) => ({ serviceReport, app, loading }))(Report)
