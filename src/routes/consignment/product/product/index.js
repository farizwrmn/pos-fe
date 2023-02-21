import React from 'react'
import { connect } from 'dva'
import { Tabs, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const confirm = Modal.confirm

function Product ({ consignmentProduct, dispatch, loading }) {
  const {
    list,
    activeKey,
    q,
    pagination
  } = consignmentProduct

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentProduct/updateState',
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

  const listProps = {
    dataSource: list,
    pagination,
    loading: loading.effects['consignmentProduct/query'],
    showConfirm ({ type, id }) {
      confirm({
        title: `${String(type).at(0).toUpperCase() + String(type).slice(1)} product`,
        content: `Are you sure to ${type} this product?`,
        onCancel () { },
        onOk () {
          if (type === 'edit') {
            dispatch(
              routerRedux.push(`/integration/consignment/product/${id}`)
            )
          }
          if (type === 'delete') {
            dispatch({
              type: 'consignmentProduct/queryDestroy',
              payload: {
                id
              }
            })
          }
        }
      })
    },
    onFilterChange ({ pagination }) {
      dispatch({
        type: 'consignmentProduct/query',
        payload: {
          q,
          pagination
        }
      })
    }
  }

  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'consignmentProduct/query',
        payload: {
          q: value
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="List" key="0">
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
  consignmentProduct,
  dispatch,
  loading
}) => ({ consignmentProduct, loading, dispatch }))(Product)
