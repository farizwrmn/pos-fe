import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const CustomerUnit = ({ customer, customerunit, loading, dispatch, location }) => {
  const { listUnit, pagination, display, isChecked, modalType, currentItem, activeKey, disable } = customerunit
  const { pageSize } = pagination
  const { list, listCustomer } = customer
  const filterProps = {
    display,
    isChecked,
    filter: {
      ...location.query,
    },
    // onFilterChange (value) {
    //   dispatch(routerRedux.push({
    //     pathname: location.pathname,
    //     query: {
    //       ...value,
    //       page: 1,
    //       pageSize,
    //     },
    //   }))
    // },
    onFilterChange (value) {
      dispatch({
        type: 'customerunit/query',
        payload: {
          ...value,
        },
      })
    },
    switchIsChecked () {
      dispatch({ type: 'customerunit/switchIsChecked' })
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
        payload: value,
      })
    },
  }

  const listProps = {
    dataSource: listUnit,
    loading: loading.effects['customerunit/query'],
    pagination,
    location,
    ...inputSearchProps,
    onChange (page) {
      dispatch({
        type: 'customerunit/query',
        payload: {
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
    onSubmit (data) {
      dispatch({
        type: `customerunit/${modalType}`,
        payload: data,
      })
    },
    resetItem () {
      dispatch({
        type: 'customerunit/resetItem',
        payload: {
          modalType: 'add',
          activeKey: '0',
          currentItem: {},
          disable: '',
        },
      })
    },
  }

  const tabProps = {
    ...listProps,
    ...formProps,
    ...filterProps,
    ...inputSearchProps,
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
            current: '',
            pageSize: '',
            total: '',
          },
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
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ customerunit, customer, loading }) => ({ customerunit, customer, loading }))(CustomerUnit)
