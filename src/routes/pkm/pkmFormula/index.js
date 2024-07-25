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
    onOpenModalPkm (record) {

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
