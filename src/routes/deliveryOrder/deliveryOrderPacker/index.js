import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'

const Counter = ({ deliveryOrderPacker, loading, dispatch, location, app }) => {
  const { list, pagination } = deliveryOrderPacker
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'deliveryOrderPacker/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['deliveryOrderPacker/query'],
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
        type: 'deliveryOrderPacker/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'deliveryOrderPacker/delete',
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
  deliveryOrderPacker: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ deliveryOrderPacker, loading, app }) => ({ deliveryOrderPacker, loading, app }))(Counter)
