import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'
import { NewForm } from '../../../components'

const ProductBrand = ({ productbrand, loading, dispatch, location, app }) => {
  const { listBrand, newItem, pagination, display, isChecked, modalType, currentItem, activeKey, disable, show } = productbrand
  const { user, storeInfo } = app
  const filterProps = {
    display,
    isChecked,
    show,
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
    onResetClick () {
      dispatch({ type: 'productbrand/resetProductBrandList' })
    },
  }

  const listProps = {
    dataSource: listBrand,
    user,
    storeInfo,
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
        type: 'productbrand/updateState',
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
        type: 'productbrand/updateState',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: '',
        },
      })
      // if (key === '1') {
      //   dispatch({
      //     type: 'productbrand/query',
      //   })
      // }
      dispatch({ type: 'productbrand/resetProductBrandList' })
    },
    clickBrowse () {
      dispatch({
        type: 'productbrand/updateState',
        payload: {
          activeKey: '1',
        },
      })
    },
    onShowHideSearch () {
      dispatch({
        type: 'productbrand/updateState',
        payload: {
          show: !show,
        }
      })
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
      dispatch({
        type: 'productbrand/updateState',
        payload: {
          modalType: 'add',
          currentItem: {},
        },
      })
    },
  }

  const page = (boolean) => {
    let currentPage
    if (boolean) {
      const newFormProps = {
        onClickNew () {
          dispatch({
            type: 'productbrand/updateState',
            payload: {
              newItem: false,
            },
          })
        },
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

ProductBrand.propTypes = {
  productbrand: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ productbrand, loading, app }) => ({ productbrand, loading, app }))(ProductBrand)
