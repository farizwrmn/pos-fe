import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'
import { NewForm } from '../../../components'

const ProductCategory = ({ productcategory, loading, dispatch, location, app }) => {
  const { listCategory, newItem, display, isChecked, modalType, currentItem, activeKey, disable, show } = productcategory
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
      // if (key === '1') {
      //   dispatch({
      //     type: 'productcategory/query',
      //   })
      // }
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
    item: modalType === 'add' ? {} : currentItem,
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
      dispatch({
        type: 'productcategory/updateState',
        payload: {
          modalType: 'add',
          currentItem: {}
        }
      })
    }
  }

  const page = (boolean) => {
    let currentPage
    if (boolean) {
      const newFormProps = {
        onClickNew () {
          dispatch({
            type: 'productcategory/updateState',
            payload: {
              newItem: false
            }
          })
        }
      }
      currentPage = <NewForm {...newFormProps} />
    } else {
      currentPage = <Form {...formProps} />
    }
    return currentPage
  }

  return (
    <div className="content-inner">
      {page(newItem)}
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
