import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Customer = ({ customer, customergroup, customertype, city, misc, loading, dispatch, location }) => {
  const { list, pagination, display, isChecked, modalType, currentItem, activeKey, disable } = customer
  const { listGroup } = customergroup
  const { listType } = customertype
  const { listCity } = city
  const { listLov, code } = misc
  const listIdType = listLov && listLov[code] ? listLov[code] : []
  const filterProps = {
    display,
    isChecked,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch({
        type: 'customer/query',
        payload: {
          ...value,
        },
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'customer/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`,
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['customer/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'customer/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    editItem (item) {
      dispatch({
        type: 'customer/changeTab',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled',
        },
      })
      dispatch({
        type: 'customergroup/query',
      })
      dispatch({
        type: 'customertype/query',
      })
      dispatch({
        type: 'city/query',
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'customer/delete',
        payload: id,
      })
    },
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'customer/changeTab',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: '',
        },
      })
      if (key === '1') {
        dispatch({
          type: 'customer/query',
        })
      }
    },
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
          data,
        },
      })
    },
    resetItem () {
      dispatch({
        type: 'customer/resetItem',
        payload: {
          modalType: 'add',
          activeKey: '0',
          currentItem: {},
          disable: '',
        },
      })
    },
    showCustomerGroup () {
      dispatch({
        type: 'customergroup/query',
      })
    },
    showCustomerType () {
      dispatch({
        type: 'customertype/query',
      })
    },
    showIdType () {
      dispatch({
        type: 'misc/lov',
        payload: {
          code: 'IDTYPE',
        },
      })
    },
    showCity () {
      dispatch({
        type: 'city/query',
      })
    },
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
    </div>
  )
}

Customer.propTypes = {
  customer: PropTypes.object,
  customergroup: PropTypes.object,
  customertype: PropTypes.object,
  misc: PropTypes.object,
  city: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ customer, customergroup, customertype, city, misc, loading }) => ({ customer, customergroup, customertype, city, misc, loading }))(Customer)
