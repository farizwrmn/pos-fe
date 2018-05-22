/**
 * Created by boo on 05/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, posReport, productbrand, productcategory, app }) => {
  const { listPOSCompareSvsI, fromDate, toDate, productCode, category, brand } = posReport
  const { listCategory } = productcategory
  const { listBrand } = productbrand
  const { user, storeInfo } = app
  const browseProps = {
    dataSource: listPOSCompareSvsI,
    listPOSCompareSvsI,
    storeInfo,
    user,
    fromDate,
    toDate,
    productCode
  }

  const filterProps = {
    listPOSCompareSvsI,
    listCategory,
    listBrand,
    user,
    storeInfo,
    fromDate,
    toDate,
    productCode,
    category,
    brand,
    onListReset () {
      dispatch({
        type: 'posReport/setListNull'
      })
    },
    onDateChange (from, to) {
    //   dispatch({
    //     type: 'posReport/queryCompareSalesInventory',
    //     payload: {
    //       from,
    //       to
    //     }
    //   })
      dispatch({
        type: 'posReport/setDate',
        payload: {
          from,
          to
        }
      })
    },
    onFilterChange (data) {
      dispatch({
        type: 'posReport/queryCompareSalesInventory',
        payload: {
          ...data
        }
      })
      dispatch({
        type: 'posReport/setDate',
        payload: {
          ...data
        }
      })
    },
    showBrands () {
      dispatch({
        type: 'productbrand/query'
      })
    },
    showCategories () {
      dispatch({
        type: 'productcategory/query'
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

Report.propTypes = {
  dispatch: PropTypes.func,
  app: PropTypes.object,
  posReport: PropTypes.object,
  productbrand: PropTypes.object,
  productcategory: PropTypes.object

}

export default connect(({ posReport, productbrand, productcategory, app }) => ({ posReport, productbrand, productcategory, app }))(Report)
