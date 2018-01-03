import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Service = ({ service, loading, dispatch, location }) => {
  const { list, listServiceType, pagination, display, isChecked, modalType, currentItem, activeKey, disable } = service
  const filterProps = {
    display,
    isChecked,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch({
        type: 'service/query',
        payload: {
          service: value.serviceName,
          ...value,
        },
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'service/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`,
      })
    },
  }

  const listProps = {
    dataSource: list,
    loading: loading.effects['service/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'service/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    editItem (item) {
      dispatch({
        type: 'service/changeTab',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled',
        },
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'service/delete',
        payload: id,
      })
    },
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'service/changeTab',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: '',
        },
      })
      if (key === '1') {
        dispatch({
          type: 'service/query',
        })
      }
    },
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...listProps,
    listServiceType,
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `service/${modalType}`,
        payload: {
          id,
          data,
        },
      })
    },
    resetItem () {
      dispatch({
        type: 'service/resetItem',
        payload: {
          modalType: 'add',
          activeKey: '0',
          currentItem: {},
          disable: '',
        },
      })
    },
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
    </div>
  )
}

Service.propTypes = {
  service: PropTypes.object,
  city: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ service, city, loading }) => ({ service, city, loading }))(Service)
