import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import Form from './Form'
import Filter from './Filter'
import List from './List'

const TabPane = Tabs.TabPane

function Users ({ consignmentUsers, consignmentOutlet, dispatch }) {
  const { activeKey, formType, list, selectedUser, q, pagination } = consignmentUsers
  const { list: outletList } = consignmentOutlet

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentUsers/updateState',
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
    editUser (record) {
      console.log('record', record)
      dispatch({
        type: 'consignmentUsers/updateState',
        payload: {
          formType: 'edit',
          activeKey: '0',
          selectedUser: record
        }
      })
    },
    onFilterChange ({ pagination }) {
      dispatch({
        type: 'consignmentUsers/query',
        payload: {
          q,
          pagination
        }
      })
    }
  }

  const formProps = {
    outletList,
    selectedUser,
    formType,
    cancelEdit () {
      dispatch({
        type: 'consignmentUsers/updateState',
        payload: {
          formType: 'add',
          selectedUser: {}
        }
      })
    },
    add (data, resetFields) {
      dispatch({
        type: 'consignmentUsers/queryAdd',
        payload: data,
        resetFields
      })
    },
    edit (data, resetFields) {
      console.log('selectedUser', selectedUser)
      dispatch({
        type: 'consignmentUsers/queryEdit',
        payload: {
          ...data,
          id: selectedUser.id,
          resetFields
        }
      })
    },
    resetPassword (password) {
      dispatch({
        type: 'consignmentUsers/queryResetPassword',
        payload: {
          id: selectedUser.id,
          password
        }
      })
    }
  }

  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'consignmentUsers/query',
        payload: {
          q: value
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
  consignmentUsers,
  consignmentOutlet,
  dispatch
}) => ({ consignmentUsers, consignmentOutlet, dispatch }))(Users)
