import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import List from './List'

const ImportStock = ({ loading, dispatch, importstock }) => {
  const { list, pagination } = importstock
  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['importstock/query'],
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
    }
  }

  return (
    <div className="content-inner">
      <List {...listProps} />
    </div>
  )
}

export default connect(
  ({
    loading,
    importstock
  }) => ({
    loading,
    importstock
  })
)(ImportStock)
