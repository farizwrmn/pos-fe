import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

function Detail ({ consignmentStockFlow, consignmentOutlet, dispatch, loading }) {
  const {
    list,
    activeKey,

    consignmentId,

    q,
    typeFilter,
    statusFilter,
    pagination
  } = consignmentStockFlow
  const { selectedOutlet } = consignmentOutlet

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentStockFlow/updateState',
      payload: {
        activeKey: key
      }
    })
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
      query: {
        ...query,
        activeKey: key
      }
    }))
  }

  if (!consignmentId) {
    return (
      <div>Consignment not linked to this store, please contact your administrator</div>
    )
  }

  const listProps = {
    dataSource: list,
    dispatch,
    pagination,
    selectedOutlet,
    loading: loading.effects['consignmentStockFlow/query'],
    onFilterChange ({ status, type, pagination }) {
      dispatch({
        type: 'consignmentStockFlow/query',
        payload: {
          statusFilter: status,
          typeFilter: type,
          pagination,
          q: q || ''
        }
      })
    }
  }

  const filterProps = {
    onFilterChange (value) {
      const query = value.q
      dispatch({
        type: 'consignmentStockFlow/query',
        payload: {
          q: query,
          typeFilter,
          statusFilter
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab={'List'} key="0" >
          {activeKey === '0' &&
            <div>
              <Filter {...filterProps} />
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  consignmentStockFlow,
  consignmentOutlet,
  dispatch,
  loading
}) => ({ consignmentStockFlow, consignmentOutlet, dispatch, loading }))(Detail)
