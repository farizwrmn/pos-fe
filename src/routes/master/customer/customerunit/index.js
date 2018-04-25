import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const CustomerUnit = ({ customer, customerunit, loading, dispatch, location, app }) => {
  const { listUnit, modalType, currentItem, activeKey, disable, customerInfo } = customerunit
  const { user, storeInfo } = app
  const { list, listCustomer, modalVisible, dataCustomer } = customer
  const modalProps = {
    customer,
    location,
    modalVisible,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    openModal () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: true,
          listCustomer: list
        }
      })
    }
  }

  const inputSearchProps = {
    listCustomer,
    disableInputSearch: `${modalType === 'edit' ? disable : ''}`,
    findItem (value) {
      dispatch({
        type: 'customer/onSearch',
        payload: {
          search: value,
          data: list
        }
      })
    },
    resetUnit () {
      dispatch({
        type: 'customerunit/resetUnit'
      })
    },
    showItem (value) {
      dispatch({
        type: 'customerunit/query',
        payload: {
          code: value
        }
      })
    }
  }

  const listProps = {
    dataSource: listUnit,
    dataCustomer,
    user,
    loading: loading.effects['customerunit/query'],
    storeInfo,
    location,
    editItem (item) {
      dispatch({
        type: 'customerunit/changeTab',
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
    deleteItem (code, id) {
      dispatch({
        type: 'customerunit/delete',
        payload: {
          memberCode: code,
          policeNo: id
        }
      })
    }
  }

  const formProps = {
    item: currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    listItem: listUnit,
    modalType,
    customerInfo,
    filter: {
      ...location.query
    },
    onSubmit (data) {
      dispatch({
        type: `customerunit/${modalType}`,
        payload: data
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          dataCustomer: {}
        }
      })
    },
    onCancelUpdate () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    clickBrowse () {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          activeKey: '1',
          customerInfo: {}
        }
      })
    },
    onFocusBrand () {
      dispatch({ type: 'customerunit/queryBrands' })
    }
  }

  const tabProps = {
    ...listProps,
    ...formProps,
    ...inputSearchProps,
    ...modalProps,
    modalVisible,
    activeKey,
    listCustomer,
    changeTab (key) {
      dispatch({
        type: 'customerunit/changeTab',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: '',
          listUnit: [],
          customerInfo: {},
          pagination: {
            total: 0
          }
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
      dispatch({
        type: 'customer/updateState',
        payload: {
          dataCustomer: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...tabProps} />
    </div>
  )
}

CustomerUnit.propTypes = {
  customerunit: PropTypes.object,
  customer: PropTypes.object,
  loading: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ customerunit, customer, loading, app }) => ({ customerunit, customer, loading, app }))(CustomerUnit)
