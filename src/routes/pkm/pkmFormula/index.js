import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import List from './List'

const Counter = ({ pkmFormula, loading, dispatch, location, app }) => {
  const { list, pagination } = pkmFormula
  const { user, storeInfo } = app

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['pkmFormula/query'],
    location,
    onChange (page) {
      dispatch({
        type: 'pkmFormula/updateState',
        payload: {
          pagination: {
            page: page.current,
            pageSize: page.pageSize
          }
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
        type: 'pkmFormula/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'pkmFormula/delete',
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
  pkmFormula: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ pkmFormula, loading, app }) => ({ pkmFormula, loading, app }))(Counter)
