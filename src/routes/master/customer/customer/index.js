import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'
import { NewForm } from '../../../components'

const Customer = ({ customer, customergroup, customertype, city, misc, loading, dispatch, location, app }) => {
  const { list, newItem, pagination, display, isChecked, modalType, currentItem, activeKey, disable, show } = customer
  const { listGroup } = customergroup
  const { listType } = customertype
  const { listCity } = city
  const { listLov, code } = misc
  const listIdType = listLov && listLov[code] ? listLov[code] : []
  const { user, storeInfo } = app
  const filterProps = {
    display,
    isChecked,
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      // dispatch({
      //   type: 'customer/query',
      //   payload: {
      //     ...value
      //   }
      // })
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
        type: 'customer/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      const { query, pathname } = location
      const { q, createdAt, ...other } = query
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...other
        }
      }))
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['customer/query'],
    location,
    onChange (page) {
      // dispatch({
      //   type: 'customer/query',
      //   payload: {
      //     pageSize: Number(e.pageSize),
      //     page: Number(e.current)
      //   }
      // })
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
        type: 'customer/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'customergroup/query'
      })
      dispatch({
        type: 'customertype/query'
      })
      dispatch({
        type: 'city/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'customer/delete',
        payload: id
      })
    }
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'customer/updateState',
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
      dispatch({ type: 'customer/resetCustomerList' })
    },
    onShowHideSearch () {
      dispatch({
        type: 'customer/updateState',
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
    listGroup,
    listType,
    listCity,
    listIdType,
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `customer/${modalType}`,
        payload: {
          id,
          data
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalType: 'add',
          currentItem: {}
        }
      })
    },
    showCustomerGroup () {
      dispatch({
        type: 'customergroup/query'
      })
    },
    showCustomerType () {
      dispatch({
        type: 'customertype/query'
      })
    },
    showIdType () {
      dispatch({
        type: 'misc/lov',
        payload: {
          code: 'IDTYPE'
        }
      })
    },
    showCity () {
      dispatch({
        type: 'city/query'
      })
    },
    clickBrowse () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          activeKey: '1'
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
            type: 'customer/updateState',
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

Customer.propTypes = {
  customer: PropTypes.object,
  app: PropTypes.object,
  customergroup: PropTypes.object,
  customertype: PropTypes.object,
  misc: PropTypes.object,
  city: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ customer, customergroup, customertype, city, misc, loading, app }) => ({ customer, customergroup, customertype, city, misc, loading, app }))(Customer)
