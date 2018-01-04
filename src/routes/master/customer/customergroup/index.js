import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const CustomerGroup = ({ customergroup, loading, dispatch, location }) => {
  const { listGroup, pagination, display, isChecked, modalType, currentItem, activeKey, disable } = customergroup
  const { pageSize } = pagination
  const filterProps = {
    display,
    isChecked,
    filter: {
      ...location.query,
    },
    onFilterChange (value) {
      dispatch({
        type: 'customergroup/query',
        payload: {
          ...value,
        },
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'customergroup/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`,
      })
    },
  }

  const listProps = {
    dataSource: listGroup,
    loading: loading.effects['customergroup/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'customergroup/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize,
        },
      })
    },
    editItem (item) {
      dispatch({
        type: 'customergroup/changeTab',
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
        type: 'customergroup/delete',
        payload: id,
      })
    },
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'customergroup/changeTab',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: '',
        },
      })
      if (key === '1') {
        dispatch({
          type: 'customergroup/query',
        })
      }
    },
  }

  const formProps = {
    ...tabProps,
    ...filterProps,
    ...listProps,
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `customergroup/${modalType}`,
        payload: data,
      })
    },
    resetItem () {
      dispatch({
        type: 'customergroup/resetItem',
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

CustomerGroup.propTypes = {
  customergroup: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
}

export default connect(({ customergroup, loading }) => ({ customergroup, loading }))(CustomerGroup)
