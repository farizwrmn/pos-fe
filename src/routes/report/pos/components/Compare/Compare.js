/**
 * Created by boo on 05/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, posReport, productbrand, productcategory, app }) => {
  const { listPOSCompareSvsI, fromDate, toDate, productCode, category, brand, paramDate, diffDay } = posReport
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
    paramDate,
    diffDay,
    productCode
  }

  const filterProps = {
    listPOSCompareSvsI,
    listCategory,
    listBrand,
    user,
    storeInfo,
    // fromDate,
    // toDate,
    paramDate,
    diffDay,
    productCode,
    category,
    brand,
    onListReset () {
      console.log('aaa1')
      dispatch({
        type: 'posReport/setListNull'
      })
    },
    onDateChange (from, to) {
      dispatch({
        type: 'posReport/setValue',
        payload: {
          from,
          to,
          listPOSCompareSvsI
        }
      })
    },
    onSearch (data) {
      dispatch({
        type: 'posReport/queryCompareSalesInventory',
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
