import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Service = ({ service, loading, dispatch, location, app }) => {
  const { list, listServiceType, modalType, currentItem, activeKey, disable, show } = service
  const { user, storeInfo } = app
  const filterProps = {
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch({
        type: 'service/query',
        payload: {
          ...value
        }
      })
    },
    onResetClick () {
      dispatch({ type: 'service/resetServiceList' })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    loading: loading.effects['service/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'service/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
    },
    deleteItem (id) {
      dispatch({
        type: 'service/delete',
        payload: id
      })
    }
  }

  const tabProps = {
    activeKey,
    changeTab (key) {
      dispatch({
        type: 'service/updateState',
        payload: {
          activeKey: key,
          modalType: 'add',
          currentItem: {},
          disable: ''
        }
      })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          activeKey: key
        }
      }))
      dispatch({ type: 'service/resetServiceList' })
    },
    clickBrowse () {
      dispatch({
        type: 'service/updateState',
        payload: {
          activeKey: '1'
        }
      })
    },
    onShowHideSearch () {
      dispatch({
        type: 'service/updateState',
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
    listServiceType,
    item: currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `service/${modalType}`,
        payload: {
          id,
          data
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
    </div>
  )
}

Service.propTypes = {
  service: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ service, loading, app }) => ({ service, loading, app }))(Service)
