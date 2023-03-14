import React from 'react'
import { connect } from 'dva'
import { Tabs, Modal, Input } from 'antd'
import { routerRedux } from 'dva/router'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane
const TextArea = Input.TextArea

const confirm = Modal.confirm

function PendingProduct ({ consignmentPendingProduct, dispatch, loading }) {
  const { list, activeKey, pagination, q } = consignmentPendingProduct

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentPendingProduct/updateState',
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
    loading: loading.effects['consignmentPendingProduct/query']
      || loading.effects['consignmentPendingProduct/queryApprove']
      || loading.effects['consignmentPendingProduct/queryReject'],
    showConfirm ({ type, id }) {
      let note
      confirm({
        title: `${type} product`,
        content: (
          <TextArea onChange={(event) => { note = event.target.value }} />
        ),
        onCancel () { },
        onOk () {
          if (type.toLowerCase() === 'approve') {
            dispatch({
              type: 'consignmentPendingProduct/queryApprove',
              payload: {
                id,
                note
              }
            })
          }
          if (type.toLowerCase() === 'reject') {
            dispatch({
              type: 'consignmentPendingProduct/queryReject',
              payload: {
                id,
                note
              }
            })
          }
        }
      })
    },
    onFilterChange ({ pagination }) {
      const { current, pageSize } = pagination
      dispatch({
        type: 'consignmentPendingProduct/query',
        payload: {
          q,
          current,
          pageSize
        }
      })
    }
  }

  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'consignmentPendingProduct/query',
        payload: {
          q: value
        }
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

export default connect(({ consignmentPendingProduct, dispatch, loading }) => ({ consignmentPendingProduct, dispatch, loading }))(PendingProduct)
