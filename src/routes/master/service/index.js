import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
// import { routerRedux } from 'dva/router'
import Form from './Form'

const Service = ({ service, loading, dispatch, location, app }) => {
  const { list, listServiceType, modalType, currentItem, activeKey, disable, show, pagination,
    listPrintAllService, showPDFModal, mode, changed, serviceLoading } = service
  const { user, storeInfo } = app
  const filterProps = {
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      // dispatch({
      //   type: 'service/query',
      //   payload: {
      //     ...value
      //   }
      // })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...value,
          page: 1
        }
      }))
    },
    // onResetClick () {
    // dispatch({ type: 'service/resetServiceList' })
    // }
    onResetClick () {
      const { query, pathname } = location
      const { activeKey } = query

      dispatch(routerRedux.push({
        pathname,
        query: {
          page: 1,
          activeKey: activeKey || '0'
        }
      }))
      dispatch({
        type: 'service/updateState',
        payload: {
          searchText: null
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    pagination,
    storeInfo,
    loading: loading.effects['service/query'],
    location,
    onChange (page) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
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
    list,
    listPrintAllService,
    showPDFModal,
    mode,
    changed,
    serviceLoading,
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
    },
    onShowPDFModal (mode) {
      dispatch({
        type: 'service/updateState',
        payload: {
          showPDFModal: true,
          mode
        }
      })
    },
    onHidePDFModal () {
      dispatch({
        type: 'service/updateState',
        payload: {
          showPDFModal: false,
          changed: false,
          listPrintAllService: []
        }
      })
    },
    getAllService () {
      dispatch({
        type: 'service/queryAllService',
        payload: {
          type: 'all'
        }
      })
      setTimeout(() => {
        dispatch({
          type: 'service/updateState',
          payload: {
            changed: true
          }
        })
      }, 1000)
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
