import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import ListTransfer from './ListTransferOut'
import ListDelivery from './ListDeliveryOrder'


const Transfer = ({ location, autoReplenishSubmission, transferOut, app, dispatch, loading }) => {
  const { listProducts, listTransOut, currentItemPrint, pagination, filter, sort, showPrintModal } = transferOut
  const { listTransferOut, listDeliveryOrder } = autoReplenishSubmission
  const { query } = location
  const { user, storeInfo } = app

  const listDeliveryProps = {
    dataSource: listDeliveryOrder,
    dispatch,
    listDeliveryOrder,
    listProducts,
    pagination,
    listTransOut,
    itemPrint: currentItemPrint,
    loading: loading.effects['transferOut/queryTransferOut'] || loading.effects['transferOut/queryProducts'] || loading.effects['autoReplenishSubmission/edit'],
    location,
    loadingEffect: loading.effects,
    deliveryOrderNo: query.deliveryOrderNo,
    filter,
    sort,
    storeInfo,
    showPrintModal,
    user,
    onClickPrinted (transferOutId) {
      const { pathname } = location
      dispatch({
        type: 'autoReplenishSubmission/edit',
        payload: {
          id: transferOutId,
          pathname,
          query: location.query
        }
      })
    },
    updateFilter (page, filters, sorts) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          filter: filters,
          sort: sorts,
          pagination: {
            payload: {
              current: Number(page.current) || 1,
              pageSize: Number(page.pageSize) || 10,
              total: listTransferOut.length
            }
          }
        }
      })
    },
    getTrans (transNo, storeId) {
      dispatch({
        type: 'transferOut/queryByTrans',
        payload: {
          transNo,
          storeId
        }
      })
    },
    onShowPrint () {
    },
    onClosePrint () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          showPrintModal: false
        }
      })
    }
  }

  const listTransferProps = {
    dataSource: listTransferOut,
    dispatch,
    listTransferOut,
    listProducts,
    pagination,
    listTransOut,
    itemPrint: currentItemPrint,
    loading: loading.effects['transferOut/queryTransferOut'] || loading.effects['transferOut/queryProducts'] || loading.effects['transferOut/edit'],
    location,
    loadingEffect: loading.effects,
    deliveryOrderNo: query.deliveryOrderNo,
    filter,
    sort,
    storeInfo,
    showPrintModal,
    user,
    onClickPrinted (transferOutId) {
      const { pathname } = location
      dispatch({
        type: 'autoReplenishSubmission/edit',
        payload: {
          id: transferOutId,
          pathname,
          query: location.query
        }
      })
    },
    updateFilter (page, filters, sorts) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          filter: filters,
          sort: sorts,
          pagination: {
            payload: {
              current: Number(page.current) || 1,
              pageSize: Number(page.pageSize) || 10,
              total: listTransferOut.length
            }
          }
        }
      })
    },
    getTrans (transNo, storeId) {
      dispatch({
        type: 'transferOut/queryByTrans',
        payload: {
          transNo,
          storeId
        }
      })
    },
    onShowPrint () {

    },
    onClosePrint () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          showPrintModal: false
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <ListTransfer {...listTransferProps} />
      <ListDelivery {...listDeliveryProps} />
    </div>
  )
}

Transfer.propTypes = {
  transferOut: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object
}


export default connect(({ transferOut, autoReplenishSubmission, app, loading }) => ({ transferOut, autoReplenishSubmission, app, loading }))(Transfer)
