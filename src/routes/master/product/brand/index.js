import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const ProductBrand = ({ productbrand, loading, dispatch, location }) => {
  const { listBrand, pagination, display, isChecked, modalType, currentItem, activeKey, disable } = productbrand
  const filterProps = {
    display,
    isChecked,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch({
        type: 'productbrand/query',
        payload: {
          userName: value.brandName,
          ...value,
        },
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'productbrand/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`,
      })
    },
  }

  const listProps = {
    dataSource: listBrand,
    loading: loading.effects['productbrand/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'productbrand/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    editItem (item) {
      dispatch({
        type: 'productbrand/changeTab',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled',
        },
      })
      dispatch({
        type: 'productbrand/query',
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'productbrand/delete',
        payload: id,
      })
    },
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'productbrand/changeTab',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: '',
        },
      })
      if (key === '1') {
        dispatch({
          type: 'productbrand/query',
        })
      }
    },
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...listProps,
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `productbrand/${modalType}`,
        payload: {
          id,
          data,
        },
      })
    },
    resetItem () {
      dispatch({
        type: 'productbrand/resetItem',
        payload: {
          modalType: 'add',
          activeKey: '0',
          currentItem: {},
          disable: '',
        },
      })
    },
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
    </div>
  )
}

ProductBrand.propTypes = {
  productbrand: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ productbrand, loading }) => ({ productbrand, loading }))(ProductBrand)
