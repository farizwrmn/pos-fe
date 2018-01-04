import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Employee = ({ employee, jobposition, city, loading, dispatch, location }) => {
  const { list, pagination, display, isChecked, modalType, currentItem, activeKey, disable } = employee
  const { listLovJobPosition } = jobposition
  const { listCity } = city
  const filterProps = {
    display,
    isChecked,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch({
        type: 'employee/query',
        payload: {
          ...value,
        },
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'employee/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`,
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['employee/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'employee/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    editItem (item) {
      dispatch({
        type: 'employee/changeTab',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled',
        },
      })
      dispatch({
        type: 'jobposition/lov',
      })
      dispatch({
        type: 'city/query',
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'employee/delete',
        payload: id,
      })
    },
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'employee/changeTab',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: '',
        },
      })
      if (key === '1') {
        dispatch({
          type: 'employee/query',
        })
      }
    },
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...listProps,
    listLovJobPosition,
    listCity,
    item: currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `employee/${modalType}`,
        payload: {
          id,
          data,
        },
      })
    },
    resetItem () {
      dispatch({
        type: 'employee/resetItem',
        payload: {
          modalType: 'add',
          activeKey: '0',
          currentItem: {},
          disable: '',
        },
      })
    },
    showPosition () {
      dispatch({
        type: 'jobposition/lov',
      })
    },
    showCities () {
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

Employee.propTypes = {
  employee: PropTypes.object,
  jobposition: PropTypes.object,
  city: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ employee, jobposition, city, loading }) => ({ employee, jobposition, city, loading }))(Employee)
