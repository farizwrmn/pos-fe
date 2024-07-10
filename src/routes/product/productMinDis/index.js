import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'
import ModalEdit from './ModalEdit'

const Counter = ({ productMinDis, loading, dispatch, location, app }) => {
  const { list, pagination, modalEditMindisVisible, modalEditMindisItem } = productMinDis
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          q: value.q
        }
      }))
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['productMinDis/query'],
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
        type: 'productMinDis/updateState',
        payload: {
          modalEditMindisItem: item,
          modalEditMindisVisible: true
        }
      })
    }
  }

  const modalEditMindisProps = {
    loading: loading.effects['productMinDis/edit'] || loading.effects['productMinDis/query'],
    visible: modalEditMindisVisible,
    item: modalEditMindisItem,
    onOk (data) {
      const { query } = location
      dispatch({
        type: 'productMinDis/edit',
        payload: {
          data,
          otherQuery: query
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'productMinDis/updateState',
        payload: {
          modalEditMindisItem: {},
          modalEditMindisVisible: false
        }
      })
    }
  }

  return (
    <div className="content-inner">
      {modalEditMindisVisible && <ModalEdit {...modalEditMindisProps} />}
      <Filter {...filterProps} />
      <List {...listProps} />
    </div>
  )
}

Counter.propTypes = {
  productMinDis: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productMinDis, loading, app }) => ({ productMinDis, loading, app }))(Counter)
