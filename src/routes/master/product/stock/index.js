import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { NewForm } from '../../../components'
import Form from './Form'

const ProductStock = ({ productstock, productcategory, productbrand, loading, dispatch, location, app }) => {
  const { list, listDummy, listPrintSelectedStock, listPrintAllStock, showPDFModal, mode, listUpdateDummy, newItem, display, isChecked, modalType, currentItem, activeKey,
    disable, show, showModal, searchText, logo, showModalProduct, modalProductType, auto, dummy, updateDummy, period, listSticker,
    selectedSticker, pagination } = productstock
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
        type: 'productstock/updateState',
        payload: {
          searchText: value.q
        }
      })
      dispatch({
        type: 'productstock/query',
        payload: {
          q: value.q,
          page: 1,
          pageSize: pagination.pageSize
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
      dispatch({
        type: 'productstock/updateState',
        payload: {
          searchText: null
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    pagination,
    storeInfo,
    loading: loading.effects['productstock/query'],
    location,
    onChange (e) {
      dispatch({
        type: 'productstock/query',
        payload: {
          q: searchText,
          page: e.current,
          pageSize: e.pageSize
        }
      })
    },
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
    // stickerQty,
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

  const modalProductProps = {
    showModalProduct,
    auto,
    dummy,
    updateDummy,
    period,
    listSticker,
    modalProductType,
    selectedSticker: selectedSticker || {},
    onShowModalProduct (key) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          showModalProduct: true,
          modalProductType: key,
          auto: [],
          selectedSticker: {}
        }
      })
    },
    onSelectSticker (sticker) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          selectedSticker: sticker
        }
      })
    },
    onCloseModalProduct () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          showModalProduct: false,
          modalProductType: ''
        }
      })
    },
    onAutoSearch (value) {
      if (modalProductType === 'all') {
        dispatch({
          type: 'productstock/getAutoText',
          payload: {
            text: value,
            data: listDummy
          }
        })
      } else {
        dispatch({
          type: 'productstock/getAutoText',
          payload: {
            text: value,
            data: listUpdateDummy
          }
        })
      }
    },
    pushSticker (stickers) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          listSticker: stickers
        }
      })
    },
    onSearchUpdateSticker (value) {
      if (value.updatedAt.length !== 0) {
        dispatch({
          type: 'productstock/queryUpdateAuto',
          payload: {
            ...value
          }
        })
      } else {
        dispatch({
          type: 'productstock/updateState',
          payload: {
            listUpdateDummy: []
          }
        })
      }
      dispatch({
        type: 'productstock/updateState',
        payload: {
          period: value.updatedAt
        }
      })
    }
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...listProps,
    ...modalProductProps,
    listPrintSelectedStock,
    listPrintAllStock,
    listCategory,
    listBrand,
    modalType,
    showPDFModal,
    mode,
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
    },
    onShowPDFModal (mode) {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          showPDFModal: true,
          mode
        }
      })
    },
    onHidePDFModal () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          showPDFModal: false
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
