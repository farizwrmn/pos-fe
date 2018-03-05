import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'
import { NewForm } from '../../../components'

const CustomerUnit = ({ customer, customerunit, loading, dispatch, location, app }) => {
  const { listUnit, newItem, modalType, currentItem, activeKey, disable } = customerunit
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
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    listItem: listUnit,
    dataCustomer,
    filter: {
      ...location.query
    },
    onSubmit (data) {
      dispatch({
        type: `customerunit/${modalType}`,
        payload: data
      })
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          modalType: 'add',
          currentItem: {}
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          dataCustomer: {}
        }
      })
    },
    clickBrowse () {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          activeKey: '1'
        }
      })
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
          pagination: {
            total: 0
          }
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          dataCustomer: {}
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
            type: 'customerunit/updateState',
            payload: {
              newItem: false
            }
          })
        }
      }
      currentPage = <NewForm {...newFormProps} />
    } else {
      currentPage = <Form {...tabProps} />
    }
    return currentPage
  }

  return (
    <div className="content-inner">
      {page(newItem)}
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
