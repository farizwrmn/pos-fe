/**
 * Created by Veirry on 30/11/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import moment from 'moment'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, posReport, app, loading }) => {
  const { listDaily, listDailyTempBrands, listDailyTempCategories, fromDate, toDate, category, brand, modalFilterPOSByDaily } = posReport
  const { user, storeInfo } = app

  const showFilter = () => {
    dispatch({
      type: 'posReport/updateState',
      payload: {
        modalFilterPOSByDaily: !modalFilterPOSByDaily
      }
    })
  }

  const browseProps = {
    dataSource: listDaily,
    loading: loading.effects['posReport/queryDaily']
  }

  const modalProps = {
    modalFilterPOSByDaily,
    visible: modalFilterPOSByDaily,
    date: [moment(fromDate, 'YYYY-MM-DD'), moment(toDate, 'YYYY-MM-DD')],
    title: 'Filter',
    onCancel () {
      showFilter()
    },
    onSubmitFilter (data) {
      if (category !== 'ALL CATEGORY') data.category = category
      if (brand !== 'ALL BRAND') data.brand = brand
      const { date, ...other } = data
      dispatch({
        type: 'posReport/queryDaily',
        payload: {
          from: moment(date[0]).format('YYYY-MM-DD'),
          to: moment(date[1]).format('YYYY-MM-DD'),
          ...other,
          mode: 'pbc'
        }
      })
      dispatch({
        type: 'posReport/setDate',
        payload: {
          from: moment(date[0]).format('YYYY-MM-DD'),
          to: moment(date[1]).format('YYYY-MM-DD')
        }
      })
      showFilter()
    },
    onDateChange (date) {
      dispatch({
        type: 'posReport/queryDailyGetCategories',
        payload: {
          from: moment(date[0]).format('YYYY-MM-DD'),
          to: moment(date[1]).format('YYYY-MM-DD'),
          mode: 'pbc'
        }
      })
    }
  }

  const filterProps = {
    modalProps,
    listDaily,
    listDailyTempCategories,
    listDailyTempBrands,
    user,
    storeInfo,
    fromDate,
    toDate,
    category,
    brand,
    showFilter,
    onListReset () {
      dispatch({
        type: 'posReport/setListNull'
      })
      dispatch({
        type: 'cashier/resetFilter'
      })
    },
    selectCategory (value) {
      dispatch({
        type: 'posReport/queryDailyRetrieveBrands',
        payload: {
          from: fromDate,
          to: toDate,
          category: value,
          mode: 'pbc'
        }
      })
    },
    selectBrand (value) {
      dispatch({
        type: 'posReport/updateState',
        payload: {
          brand: value
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
  app: PropTypes.object,
  posReport: PropTypes.object
}

export default connect(({ posReport, app, loading }) => ({ posReport, app, loading }))(Report)
