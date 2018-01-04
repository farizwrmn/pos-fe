import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const ProductStock = ({ productstock, productcategory, productbrand, loading, dispatch, location }) => {
  const { list, pagination, display, isChecked, modalType, currentItem, activeKey, disable } = productstock
  const { listCategory } = productcategory
  const { listBrand } = productbrand
  const filterProps = {
    display,
    isChecked,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch({
        type: 'productstock/query',
        payload: {
          productCode: value.productName,
        },
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'productstock/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`,
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['productstock/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'productstock/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    editItem (item) {
      dispatch({
        type: 'productstock/changeTab',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled',
        },
      })
      dispatch({
        type: 'productcategory/query',
      })
      dispatch({
        type: 'productbrand/query',
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'productstock/delete',
        payload: id,
      })
    },
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'productstock/changeTab',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: '',
        },
      })
      if (key === '1') {
        dispatch({
          type: 'productstock/query',
        })
      }
    },
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...listProps,
    listCategory,
    listBrand,
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `productstock/${modalType}`,
        payload: {
          id,
          data,
        },
      })
    },
    resetItem () {
      dispatch({
        type: 'productstock/resetItem',
        payload: {
          modalType: 'add',
          activeKey: '0',
          currentItem: {},
          disable: '',
        },
      })
    },
    showBrands () {
      dispatch({
        type: 'productbrand/query',
      })
    },
    showCategories () {
      dispatch({
        type: 'productcategory/query',
      })
    },
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
    </div>
  )
}

ProductStock.propTypes = {
  productstock: PropTypes.object,
  productcategory: PropTypes.object,
  productbrand: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ productstock, productcategory, productbrand, loading }) => ({ productstock, productcategory, productbrand, loading }))(ProductStock)
