import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'
import { NewForm } from '../../components'

const Employee = ({ employee, jobposition, city, loading, dispatch, location, app }) => {
  const { list, newItem, pagination, display, isChecked, sequence, modalType, currentItem, activeKey, show } = employee
  const { listLovJobPosition } = jobposition
  const { listCity } = city
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
        type: 'employee/query',
        payload: {
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'employee/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      dispatch({
        type: 'employee/resetEmployeeList'
      })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    loading: loading.effects['employee/query'],
    pagination,
    location,
    onChange (page) {
      dispatch({
        type: 'employee/query',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    editItem (item) {
      dispatch({
        type: 'employee/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          sequence: item.employeeId,
          disable: 'disabled'
        }
      })
      dispatch({
        type: 'jobposition/lov'
      })
      dispatch({
        type: 'city/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'employee/delete',
        payload: id
      })
    }
  }

  const tabProps = {
    activeKey,
    loading: loading.effects['employee/querySequenceEmployee'],
    changeTab (key) {
      if (key === '0') {
        dispatch({
          type: 'employee/querySequenceEmployee'
        })
        dispatch({
          type: 'employee/updateState',
          payload: {
            activeKey: key,
            modalType: 'add',
            disable: ''
          }
        })
      } else {
        dispatch({
          type: 'employee/updateState',
          payload: {
            activeKey: key,
            modalType: 'add',
            disable: '',
            currentItem: {}
          }
        })
      }
      // if (key === '1') {
      //   dispatch({
      //     type: 'employee/query',
      //   })
      // }
      dispatch({
        type: 'employee/querySequence',
        payload: {
          seqCode: 'EMP',
          type: 1 // storeId
        }
      })
      dispatch({
        type: 'employee/resetEmployeeList'
      })
    },
    clickBrowse () {
      dispatch({
        type: 'employee/updateState',
        payload: {
          activeKey: '1'
        }
      })
      dispatch({
        type: 'employee/resetEmployeeList'
      })
    },
    onShowHideSearch () {
      dispatch({
        type: 'employee/updateState',
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
    listLovJobPosition,
    listCity,
    item: currentItem,
    sequence,
    disabled: true,
    loading: loading.effects['employee/querySequenceEmployee'],
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `employee/${modalType}`,
        payload: {
          id,
          data
        }
      })
      dispatch({
        type: 'employee/updateState',
        payload: {
          modalType: 'add',
          activeKey: '0',
          currentItem: {},
          disable: ''
        }
      })
      dispatch({ type: 'employee/querySequenceEmployee' })
    },
    showPosition () {
      dispatch({
        type: 'jobposition/lov'
      })
    },
    showCities () {
      dispatch({
        type: 'city/query'
      })
    }
  }

  const page = (boolean) => {
    let currentPage
    if (boolean) {
      const newFormProps = {
        onClickNew () {
          dispatch({
            type: 'employee/updateState',
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

Employee.propTypes = {
  employee: PropTypes.object,
  jobposition: PropTypes.object,
  city: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ employee, jobposition, city, loading, app }) => ({ employee, jobposition, city, loading, app }))(Employee)
