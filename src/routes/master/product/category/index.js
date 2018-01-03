import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const ProductCategory = ({ productcategory, loading, dispatch, location }) => {
  const { listCategory, pagination, display, isChecked, modalType, currentItem, activeKey, disable } = productcategory
  const filterProps = {
    display,
    isChecked,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch({
        type: 'productcategory/query',
        payload: {
          userName: value.categoryName,
          ...value,
        },
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'productcategory/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`,
      })
    },
  }

  const listProps = {
    dataSource: listCategory,
    loading: loading.effects['productcategory/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'productcategory/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    editItem (item) {
      dispatch({
        type: 'productcategory/changeTab',
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
    },
    deleteItem (id) {
      dispatch({
        type: 'productcategory/delete',
        payload: id,
      })
    },
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'productcategory/changeTab',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: '',
        },
      })
      if (key === '1') {
        dispatch({
          type: 'productcategory/query',
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
        type: `productcategory/${modalType}`,
        payload: {
          id,
          data,
        },
      })
    },
    resetItem () {
      dispatch({
        type: 'productcategory/resetItem',
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

ProductCategory.propTypes = {
  productcategory: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ productcategory, loading }) => ({ productcategory, loading }))(ProductCategory)
