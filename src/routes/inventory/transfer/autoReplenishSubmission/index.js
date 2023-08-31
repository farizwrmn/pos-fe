import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import List from './List'


const Counter = ({ autoReplenishSubmission, loading, dispatch, location }) => {
  const { list } = autoReplenishSubmission

  const listProps = {
    dataSource: list,
    pagination: false,
    loading: loading.effects['accountCode/query'],
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
        type: 'accountCode/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'accountCode/delete',
        payload: id
      })
    }
  }

  return (
    <div className="content-inner">
      <List {...listProps} />
    </div>
  )
}

Counter.propTypes = {
  autoReplenishSubmission: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ autoReplenishSubmission, loading, app }) => ({ autoReplenishSubmission, loading, app }))(Counter)
