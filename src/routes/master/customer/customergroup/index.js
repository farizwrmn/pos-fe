import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'
import { NewForm } from '../../../components'

const CustomerGroup = ({ customergroup, loading, dispatch, location, app }) => {
  const { listGroup, newItem, display, isChecked, modalType, currentItem, activeKey, disable, show } = customergroup
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
        type: 'customergroup/query',
        payload: {
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'customergroup/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      dispatch({
        type: 'customergroup/resetCustomerGroupList'
      })
    }
  }

  const listProps = {
    dataSource: listGroup,
    user,
    storeInfo,
    loading: loading.effects['customergroup/query'],
    location,
    onChange (page) {
      dispatch({
        type: 'customergroup/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    editItem (item) {
      dispatch({
        type: 'customergroup/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'customergroup/delete',
        payload: id
      })
    },
    clickBrowse () {
      dispatch({
        type: 'customergroup/updateState',
        payload: {
          activeKey: '1'
        }
      })
    }
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'customergroup/updateState',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: ''
        }
      })
      dispatch({ type: 'customergroup/resetCustomerGroupList' })
    },
    onShowHideSearch () {
      dispatch({
        type: 'customergroup/updateState',
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
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `customergroup/${modalType}`,
        payload: data
      })
      dispatch({
        type: 'customergroup/updateState',
        payload: {
          modalType: 'add',
          currentItem: {}
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
            type: 'customergroup/updateState',
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

CustomerGroup.propTypes = {
  customergroup: PropTypes.object,
  loading: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ customergroup, loading, app }) => ({ customergroup, loading, app }))(CustomerGroup)
