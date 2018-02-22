import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'
import { NewForm } from '../../../components'

const CustomerType = ({ customertype, loading, dispatch, location, app }) => {
  const { listType, newItem, listSellprice, display, isChecked, modalType, currentItem, activeKey, disable, show } = customertype
  const { user, storeInfo } = app
  const filterProps = {
    display,
    isChecked,
    show,
    filter: {
      ...location.query
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
        type: 'customertype/query',
        payload: {
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({ type: 'customertype/switchIsChecked' })
    },
    onResetClick () {
      dispatch({ type: 'customertype/resetCustomerTypeList' })
    }
  }

  const listProps = {
    dataSource: listType,
    user,
    storeInfo,
    loading: loading.effects['customertype/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'customertype/updateState',
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
        type: 'customertype/delete',
        payload: id
      })
    },
    clickBrowse () {
      dispatch({
        type: 'customertype/updateState',
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
        type: 'customertype/updateState',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: ''
        }
      })
      dispatch({ type: 'customertype/resetCustomerTypeList' })
    },
    onShowHideSearch () {
      dispatch({
        type: 'customertype/updateState',
        payload: {
          show: !show
        }
      })
    }
  }

  const formProps = {
    ...listProps,
    ...tabProps,
    ...filterProps,
    listSellprice,
    item: modalType === 'add' ? {} : currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `customertype/${modalType}`,
        payload: data
      })
      dispatch({
        type: 'customertype/updateState',
        payload: {
          modalType: 'add',
          currentItem: {}
        }
      })
      // if (key === '1') {
      //   dispatch({
      //     type: 'customertype/query',
      //   })
      // }
    }
  }

  const page = (boolean) => {
    let currentPage
    if (boolean) {
      const newFormProps = {
        onClickNew () {
          dispatch({
            type: 'customertype/updateState',
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

CustomerType.propTypes = {
  customertype: PropTypes.object,
  app: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ customertype, loading, app }) => ({ customertype, loading, app }))(CustomerType)
