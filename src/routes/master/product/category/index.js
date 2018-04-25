import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const ProductCategory = ({ productcategory, loading, dispatch, location, app }) => {
  const { listCategory, listCategoryCurrent, expandedTree, display, isChecked, modalType, currentItem, activeKey, disable, show } = productcategory
  const { storeInfo, user } = app
  const filterProps = {
    display,
    isChecked,
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch({
        type: 'productcategory/query',
        payload: {
          // userName: value.categoryName,
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'productcategory/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      dispatch({ type: 'productcategory/resetProductCategoryList' })
    }
  }

  const listProps = {
    dataSource: listCategory,
    loading: loading.effects['productcategory/query'],
    user,
    storeInfo,
    location,
    editItem (item) {
      dispatch({
        type: 'productcategory/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'productcategory/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'productcategory/delete',
        payload: id
      })
    }
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'productcategory/updateState',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: ''
        }
      })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          activeKey: key
        }
      }))
      dispatch({ type: 'productcategory/resetProductCategoryList' })
    },
    clickBrowse () {
      dispatch({
        type: 'productcategory/updateState',
        payload: {
          activeKey: '1'
        }
      })
    },
    onShowHideSearch () {
      dispatch({
        type: 'productcategory/updateState',
        payload: {
          show: !show
        }
      })
    }
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...listProps,
    listCategory,
    listCategoryCurrent,
    expandedTree,
    item: currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `productcategory/${modalType}`,
        payload: {
          id,
          data
        }
      })
    },
    queryEditItem (categoryCode, id) {
      dispatch({
        type: 'productcategory/queryEditItem',
        payload: {
          id,
          categoryCode
        }
      })
    },
    showCategoriesParent () {
      dispatch({
        type: 'productcategory/query',
        payload: {
          type: 'lov',
          id: currentItem.id
        }
      })
    }
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
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productcategory, loading, app }) => ({ productcategory, loading, app }))(ProductCategory)
