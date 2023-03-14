import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

function SalesReturn ({ consignmentSalesReturn, dispatch, loading }) {
  const {
    activeKey,
    q,
    filter,
    pagination,
    consignmentId,

    list,
    returnDetail
  } = consignmentSalesReturn

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentSalesReturn/updateState',
      payload: {
        activeKey: key,
        orderProductList: [],
        productOption: [],
        productList: [{
          productName: null,
          qty: 1,
          price: null
        }]
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
    returnDetail,
    filter,
    pagination,
    loading: loading.effects['consignmentSalesReturn/query'] || loading.effects['consignmentSalesReturn/queryById'],
    clearDetail () {
      dispatch({
        type: 'consignmentSalesReturn/updateState', payload: { returnDetail: {} }
      })
    },
    getDetail ({
      returnId,
      salesNumber
    }) {
      dispatch({
        type: 'consignmentSalesReturn/queryById', payload: { returnId, salesNumber }
      })
    },
    onFilterChange ({ filter, pagination }) {
      const { current, pageSize } = pagination
      dispatch({
        type: 'consignmentSalesReturn/query',
        payload: {
          filter,
          q: q || '',
          current,
          pageSize
        }
      })
    }
  }

  const filterProps = {
    onFilterChange ({ q }) {
      dispatch({
        type: 'consignmentSalesReturn/query',
        payload: { q, filter }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="List" key="0" >
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
  consignmentSalesReturn,
  dispatch,
  loading
}) => ({ consignmentSalesReturn, dispatch, loading }))(SalesReturn)
