import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import ListTransfer from './ListTransferOut'


const Transfer = ({ location, autoReplenishSubmission, transferOut, app, dispatch, loading }) => {
  const { listProducts, listTransOut, currentItemPrint, pagination, filter, sort, showPrintModal } = transferOut
  const { listTransferOut } = autoReplenishSubmission
  const { query } = location
  const { user, storeInfo } = app

  const listTransferProps = {
    dataSource: listTransferOut,
    listTransferOut,
    listProducts,
    pagination,
    listTransOut,
    itemPrint: currentItemPrint,
    loading: loading.effects['transferOut/queryTransferOut'],
    location,
    deliveryOrderNo: query.deliveryOrderNo,
    filter,
    sort,
    storeInfo,
    showPrintModal,
    user,
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
    getProducts (transNo, storeId) {
      console.log('getProducts', transNo)
      dispatch({
        type: 'transferOut/queryProducts',
        payload: {
          transNo,
          storeId
        }
      })
    },
    getTrans (transNo, storeId) {
      console.log('getTrans', transNo, storeId)
      dispatch({
        type: 'transferOut/queryByTrans',
        payload: {
          transNo,
          storeId
        }
      })
    },
    onShowPrint () {
      dispatch({
        type: 'transferOut/updateState',
        payload: {
          showPrintModal: true
        }
      })
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
