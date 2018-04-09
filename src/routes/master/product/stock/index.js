import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const ProductStock = ({ productstock, productcategory, productbrand, loading, dispatch, location, app }) => {
  const { list, listItem, update, changed, listPrintAllStock, showPDFModal, mode, display, isChecked, modalType, currentItem, activeKey,
    disable, show, showModal, logo, showModalProduct, modalProductType, period, listSticker,
    selectedSticker, pagination, stockLoading } = productstock
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
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...value,
          page: 1
        }
      }))
    },
    switchIsChecked () {
      dispatch({
        type: 'productstock/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      const { query, pathname } = location
      const { q, createdAt, page, ...other } = query

      dispatch(routerRedux.push({
        pathname,
        query: {
          page: 1,
          ...other
        }
      }))
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
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
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
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
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
      const { query, pathname } = location
      switch (key) {
      case 1:
        dispatch(routerRedux.push({
          pathname,
          query: {
            ...query,
            activeKey: key
          }
        }))
        break
      default:
        dispatch(routerRedux.push({
          pathname,
          query: {
            activeKey: key
          }
        }))
      }

      // dispatch({ type: 'productstock/resetProductStockList' })
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
    listItem,
    update,
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
          update: false,
          showModalProduct: false,
          modalProductType: '',
          listItem: [],
          period: []
        }
      })
    },
    onAutoSearch (value) {
      if (value.length < 1) {
        dispatch({
          type: 'productstock/updateState',
          payload: {
            listItem: []
          }
        })
      } else if (value.length > 0) {
        dispatch({
          type: 'productstock/queryItem',
          payload: {
            q: value
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
          type: 'productstock/queryItem',
          payload: {
            ...value
          }
        })
      } else {
        dispatch({
          type: 'productstock/updateState',
          payload: {
            listItem: []
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
    list,
    listPrintAllStock,
    stockLoading,
    changed,
    listCategory,
    listBrand,
    modalType,
    showPDFModal,
    mode,
    logo,
    item: currentItem,
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
    getAllStock () {
      dispatch({
        type: 'productstock/updateState',
        payload: {
          changed: true
        }
      })
      dispatch({
        type: 'productstock/queryAllStock',
        payload: {
          type: 'all'
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
          showPDFModal: false,
          changed: false,
          listPrintAllStock: []
        }
      })
    }
  }

  return (
    <div className="content-inner" >
      <Form {...formProps} />
    </div >
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
