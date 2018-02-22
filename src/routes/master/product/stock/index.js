import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { NewForm } from '../../../components'
import Form from './Form'

const ProductStock = ({ productstock, productcategory, productbrand, loading, dispatch, location, app }) => {
  const { list, newItem, display, isChecked, modalType, currentItem, activeKey, disable, show, showModal, stickerQty, logo } = productstock
  const { listCategory } = productcategory
  const { listBrand } = productbrand
  const { user, storeInfo } = app
  const filterProps = {
    display,
    isChecked,
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch({
        type: 'productstock/query',
        payload: {
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'productstock/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      dispatch({ type: 'productstock/resetProductStockList' })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    loading: loading.effects['productstock/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'productstock/updateState',
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
      dispatch({
        type: 'productbrand/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'productstock/delete',
        payload: id
      })
    }
  }

  const tabProps = {
    activeKey,
    showModal,
    stickerQty,
    changeQty (qty) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          stickerQty: qty || 1
        }
      })
    },
    changeTab (key) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: ''
        }
      })
      dispatch({ type: 'productstock/resetProductStockList' })
    },
    clickBrowse () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          activeKey: '1'
        }
      })
    },
    onShowHideSearch () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          show: !show
        }
      })
    },
    onShowModal () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          showModal: true
        }
      })
    },
    onCloseModal () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          showModal: false
        }
      })
    }
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...listProps,
    listCategory,
    listBrand,
    modalType,
    logo,
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    convertImage (url) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          logo: url
        }
      })
    },
    onSubmit (id, data) {
      dispatch({
        type: `productstock/${modalType}`,
        payload: {
          id,
          data
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

  const page = (boolean) => {
    let currentPage
    if (boolean) {
      const newFormProps = {
        onClickNew () {
          dispatch({
            type: 'productstock/updateState',
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

ProductStock.propTypes = {
  productstock: PropTypes.object,
  productcategory: PropTypes.object,
  productbrand: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productstock, productcategory, productbrand, loading, app }) => ({ productstock, productcategory, productbrand, loading, app }))(ProductStock)
