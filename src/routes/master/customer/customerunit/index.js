import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'

const CustomerUnit = ({ customer, customerunit, loading, dispatch, location, app }) => {
  const { listUnit, pagination, modalType, currentItem, activeKey, disable } = customerunit
  const { pageSize } = pagination
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
          modalVisible: false,
        },
      })
    },
    openModal () {
      dispatch({
        type: 'customer/showModal',
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          searchText: '',
          listCustomer: list,
        },
      })
    },
  }

  const inputSearchProps = {
    listCustomer,
    disableInputSearch: `${modalType === 'edit' ? disable : ''}`,
    findItem (value) {
      dispatch({
        type: 'customer/onSearch',
        payload: {
          search: value,
          data: list,
        },
      })
    },
    resetUnit () {
      dispatch({
        type: 'customerunit/resetUnit',
      })
    },
    showItem (value) {
      dispatch({
        type: 'customerunit/query',
        payload: {
          code: value,
        },
      })
    },
  }

  const listProps = {
    dataSource: listUnit,
    user,
    loading: loading.effects['customerunit/query'],
    storeInfo,
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'customerunit/query',
        payload: {
          code: listUnit[0].memberCode,
          page: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    editItem (item) {
      dispatch({
        type: 'customerunit/changeTab',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled',
        },
      })
    },
    deleteItem (code, id) {
      dispatch({
        type: 'customerunit/delete',
        payload: {
          memberCode: code,
          policeNo: id,
        },
      })
    },
  }

  const formProps = {
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    listItem: listUnit,
    dataCustomer,
    filter: {
      ...location.query,
    },
    onSubmit (data) {
      dispatch({
        type: `customerunit/${modalType}`,
        payload: data,
      })
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          modalType: 'add',
          currentItem: {},
        },
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          dataCustomer: {},
        },
      })
    },
    clickBrowse () {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          activeKey: '1',
        },
      })
    },
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
            total: 0,
          },
        },
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          dataCustomer: {},
        },
      })
    },
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
  dispatch: PropTypes.func,
}

export default connect(({ customerunit, customer, loading, app }) => ({ customerunit, customer, loading, app }))(CustomerUnit)
