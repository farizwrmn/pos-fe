import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'

const Counter = ({ purchaseSafetyStock, purchaseRequisition, loading, dispatch, location }) => {
  const {
    // list,
    // pagination,
    paginationSafety,
    modalType,
    currentItem,
    activeKey,
    listItem,
    listSafetySupplier,
    listSafetyBrand,
    listSafetyCategory,
    listSafety
  } = purchaseRequisition
  const {
    listStore,
    listDistributionCenter
  } = purchaseSafetyStock
  // const { user, storeInfo } = app
  // const filterProps = {
  //   onFilterChange (value) {
  //     dispatch({
  //       type: 'purchaseRequisition/query',
  //       payload: {
  //         ...value
  //       }
  //     })
  //   }
  // }

  // const listProps = {
  //   dataSource: list,
  //   user,
  //   storeInfo,
  //   pagination,
  //   loading: loading.effects['purchaseRequisition/query'],
  //   location,
  //   onChange (page) {
  //     const { query, pathname } = location
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         ...query,
  //         page: page.current,
  //         pageSize: page.pageSize
  //       }
  //     }))
  //   },
  //   editItem (item) {
  //     const { pathname } = location
  //     dispatch(routerRedux.push({
  //       pathname,
  //       query: {
  //         activeKey: 0
  //       }
  //     }))
  //     dispatch({
  //       type: 'purchaseRequisition/editItem',
  //       payload: { item }
  //     })
  //   },
  //   deleteItem (id) {
  //     dispatch({
  //       type: 'purchaseRequisition/delete',
  //       payload: id
  //     })
  //   }
  // }

  const listSafetyProps = {
    listSafetySupplier,
    listSafetyBrand,
    listSafetyCategory,
    dataSource: listSafety,
    pagination: paginationSafety,
    loading: loading.effects['purchaseRequisition/querySafetyStock']
      || loading.effects['purchaseRequisition/queryDetailSafety']
      || loading.effects['purchaseRequisition/querySupplierSafety']
      || loading.effects['purchaseRequisition/queryBrandSafety']
      || loading.effects['purchaseRequisition/queryCategorySafety'],
    location,
    onChange (page) {
      dispatch({
        type: 'purchaseRequisition/queryDetailSafety',
        payload: {
          page: page.current,
          pageSize: page.pageSize
        }
      })
    },
    editItem (item) {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'purchaseRequisition/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'purchaseRequisition/delete',
        payload: id
      })
    }
  }

  const listItemProps = {
    listItem
  }

  const formProps = {
    listItemProps,
    listSafetyProps,
    modalType,
    item: currentItem,
    listStore,
    listDistributionCenter,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, reset) {
      dispatch({
        type: 'purchaseRequisition/create',
        payload: {
          data,
          reset
        }
      })
    },
    onCancel () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'purchaseRequisition/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  return (
    <div className="content-inner">
      {activeKey === '0' && <Form {...formProps} />}
    </div>
  )
}

Counter.propTypes = {
  purchaseRequisition: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseSafetyStock, purchaseRequisition, loading, app }) => ({ purchaseSafetyStock, purchaseRequisition, loading, app }))(Counter)
