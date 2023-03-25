import React from 'react'
import { connect } from 'dva'
import { Modal, Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import Form from './Form'
import List from './List'

const TabPane = Tabs.TabPane

function Payments ({ consignmentPayment, consignmentOutlet, dispatch, loading }) {
  const { list, currentItem, activeKey, formType } = consignmentPayment
  const { selectedOutlet } = consignmentOutlet

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentPayment/updateState',
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

  const formProps = {
    formType,
    selectedOutlet,
    currentItem,
    loading: (loading.effects['consignmentPayment/queryAdd'] || loading.effects['consignmentPayment/queryEdit']),
    cancelEdit () {
      dispatch({
        type: 'consignmentPayment/updateState',
        payload: {
          formType: 'add',
          currentItem: {}
        }
      })
    },
    add (data, resetFields) {
      dispatch({
        type: 'consignmentPayment/queryAdd',
        payload: {
          method: data.payment,
          code: data.code,
          feeFood: data.feeFood,
          feeNonFood: data.feeNonFood,
          resetFields
        }
      })
    },
    edit (data, resetFields) {
      dispatch({
        type: 'consignmentPayment/queryEdit',
        payload: {
          id: currentItem.id,
          code: data.code,
          method: data.payment,
          feeFood: data.feeFood,
          feeNonFood: data.feeNonFood,
          resetFields
        }
      })
    }
  }

  const listProps = {
    dataSource: list,
    editItem (record) {
      dispatch({
        type: 'consignmentPayment/updateState',
        payload: {
          formType: 'edit',
          currentItem: record,
          activeKey: '0'
        }
      })
    },
    deleteItem (id) {
      Modal.confirm({
        title: 'Delete Payment',
        content: 'Are you sure to delete this payment?',
        onOk () {
          dispatch({
            type: 'consignmentPayment/queryDestroy',
            payload: {
              id
            }
          })
        },
        onCancel () {

        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' &&
            <div>
              <Form {...formProps} />
            </div>
          }
        </TabPane>
        <TabPane tab="List" key="1" >
          {activeKey === '1' &&
            <div>
              <List {...listProps} />
            </div>
          }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({
  consignmentPayment,
  consignmentOutlet,
  dispatch,
  loading
}) => ({ consignmentPayment, consignmentOutlet, dispatch, loading }))(Payments)
