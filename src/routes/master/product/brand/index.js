import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const ProductBrand = ({ productbrand, loading, dispatch, location, app }) => {
  const { listBrand, display, isChecked, modalType, currentItem, activeKey, disable, show } = productbrand
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
        type: 'productbrand/query',
        payload: {
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'productbrand/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      dispatch({ type: 'productbrand/resetProductBrandList' })
    }
  }

  const listProps = {
    dataSource: listBrand,
    user,
    storeInfo,
    loading: loading.effects['productbrand/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'productbrand/updateState',
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
        type: 'productbrand/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'productbrand/delete',
        payload: id
      })
    }
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'productbrand/updateState',
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
      dispatch({ type: 'productbrand/resetProductBrandList' })
    },
    clickBrowse () {
      dispatch({
        type: 'productbrand/updateState',
        payload: {
          activeKey: '1'
        }
      })
    },
    onShowHideSearch () {
      dispatch({
        type: 'productbrand/updateState',
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
    item: currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `productbrand/${modalType}`,
        payload: {
          id,
          data
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

ProductBrand.propTypes = {
  productbrand: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productbrand, loading, app }) => ({ productbrand, loading, app }))(ProductBrand)
