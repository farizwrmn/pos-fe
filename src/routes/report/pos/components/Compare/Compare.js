/**
 * Created by boo on 05/19/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Browse from './Browse'
import Filter from './Filter'

const Report = ({ dispatch, posReport, productbrand, productcategory, app, loading }) => {
  const { listPOSCompareSvsI, tableHeader, fromDate, toDate, productCode, category, brand, paramDate, diffDay, selectedBrand } = posReport
  const { listCategory } = productcategory
  const { listBrand } = productbrand
  const { user, storeInfo } = app

  const browseProps = {
    dataSource: listPOSCompareSvsI,
    tableHeader,
    listPOSCompareSvsI,
    storeInfo,
    loading: loading.effects['posReport/queryCompareSalesInventory'],
    selectedBrand,
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
    tableHeader,
    listBrand,
    selectedBrand,
    user,
    storeInfo,
    fromDate,
    toDate,
    paramDate,
    diffDay,
    productCode,
    category,
    brand,
    countSelectedBrand (brand) {
      dispatch({
        type: 'posReport/addSelectedBrand',
        payload: {
          brand
        }
      })
    },
    deselectedBrand (brand) {
      dispatch({
        type: 'posReport/deselectedBrand',
        payload: {
          brand
        }
      })
    },
    onListReset () {
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
          ...data,
          category: data.category.key
        }
      })
      dispatch({
        type: 'posReport/updateState',
        payload: {
          category: data.category.label,
          fromDate: data.from,
          toDate: data.to,
          tableHeader: selectedBrand.map(x => x.key),
          brand: selectedBrand.map(x => x.label).join(', ')
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
  productcategory: PropTypes.object,
  loading: PropTypes.object.isRequired
}

export default connect(({ posReport, productbrand, loading, productcategory, app }) => ({ posReport, productbrand, loading, productcategory, app }))(Report)
