/**
 * Created by Veirry on 09/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Sales } from './components'
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
    loading: loading.effects['posReport/queryInterval']
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
        type: 'posReport/queryInterval',
        payload: {
          fromDate: data.transDate.from,
          toDate: data.transDate.to,
          ...data
        }
      })
      dispatch({
        type: 'posReport/updateState',
        payload: {
          filterModalVisible: false
        }
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
  let dataCustomer = []
  let dataIn = 0
  for (let n = 0; n < 24; n += 1) {
    const CustomerIn = listTrans.reduce((prev, next) => parseInt(prev, 10) + parseInt(next[`countIn${n + 1}`], 10), 0)
    const CustomerOut = listTrans.reduce((prev, next) => parseInt(prev, 10) + parseInt(next[`count${n + 1}`], 10), 0)
    dataIn += CustomerIn
    dataIn -= CustomerOut
    dataCustomer.push({
      name: n.toString(),
      title: n.toString(),
      CustomerIn,
      CustomerOut,
      CurrentCustomer: dataIn >= 0 ? dataIn : 0
    })
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <Sales data={dataCustomer} />
      <br />
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
