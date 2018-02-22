import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'
import { NewForm } from '../../components'

const Supplier = ({ supplier, city, loading, dispatch, location, app }) => {
  const { list, newItem, display, isChecked, modalType, currentItem, activeKey, disable, show } = supplier
  const { listCity } = city
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
        type: 'supplier/query',
        payload: {
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'supplier/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      dispatch({ type: 'supplier/resetSupplierList' })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    loading: loading.effects['supplier/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'supplier/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'city/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'supplier/delete',
        payload: id
      })
    }
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'supplier/updateState',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: ''
        }
      })
      // if (key === '1') {
      //   dispatch({
      //     type: 'supplier/query',
      //   })
      // }
      dispatch({ type: 'supplier/resetSupplierList' })
    },
    clickBrowse () {
      dispatch({
        type: 'supplier/updateState',
        payload: {
          activeKey: '1'
        }
      })
    },
    onShowHideSearch () {
      dispatch({
        type: 'supplier/updateState',
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
    listCity,
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `supplier/${modalType}`,
        payload: {
          id,
          data
        }
      })
      dispatch({
        type: 'supplier/updateState',
        payload: {
          modalType: 'add',
          currentItem: {}
        }
      })
    },
    showCities () {
      dispatch({
        type: 'city/query'
      })
    }
  }

  const page = (boolean) => {
    let currentPage
    if (boolean) {
      const newFormProps = {
        onClickNew () {
          dispatch({
            type: 'supplier/updateState',
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

Supplier.propTypes = {
  supplier: PropTypes.object,
  city: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ supplier, city, loading, app }) => ({ supplier, city, loading, app }))(Supplier)
