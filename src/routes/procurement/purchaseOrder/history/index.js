import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'

const Counter = ({ purchaseOrder, purchase, loading, dispatch, location, app }) => {
  const { list, pagination } = purchaseOrder
  const { listSupplier } = purchase
  const { user, storeInfo } = app
  const filterProps = {
    supplierId: location.query.supplierId,
    from: location.query.from,
    to: location.query.to,
    listSupplier,
    location,
    onFilterChange (value) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...value
        }
      }))
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['purchaseOrder/query'],
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
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'purchaseOrder/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'purchaseOrder/delete',
        payload: id
      })
    }
  }

  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

Counter.propTypes = {
  purchaseOrder: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ purchaseOrder, purchase, loading, app }) => ({ purchaseOrder, purchase, loading, app }))(Counter)
