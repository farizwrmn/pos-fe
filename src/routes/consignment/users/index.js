import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import Form from './Form'
import Filter from './Filter'
import List from './List'

const TabPane = Tabs.TabPane

function Users ({ consignmentUsers, consignmentOutlet, dispatch, loading }) {
  const { activeKey, formType, list, selectedUser, q, pagination, modalState } = consignmentUsers
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
    loading: loading.effects['consignmentUsers/query'],
    editUser (record) {
      dispatch({
        type: 'consignmentUsers/updateState',
        payload: {
          formType: 'edit',
          selectedUser: record
        }
      })
      changeTab('0')
    },
    onFilterChange ({ current, pageSize }) {
      dispatch({
        type: 'consignmentUsers/query',
        payload: {
          q,
          current,
          pageSize
        }
      })
    }
  }

  const formProps = {
    outletList,
    selectedUser,
    formType,
    modalState,
    loading: (loading.effects['consignmentUsers/queryAdd']
      || loading.effects['consignmentUsers/queryEdit']
      || loading.effects['consignmentUsers/queryResetPassword']
    ),
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
        payload: {
          ...data,
          resetFields
        }
      })
    },
    edit (data, resetFields) {
      dispatch({
        type: 'consignmentUsers/queryEdit',
        payload: {
          ...data,
          id: selectedUser.id,
          resetFields
        }
      })
    },
    resetPassword ({ password }) {
      dispatch({
        type: 'consignmentUsers/queryResetPassword',
        payload: {
          id: selectedUser.id,
          password
        }
      })
    },
    handleModal () {
      dispatch({
        type: 'consignmentUsers/updateState',
        payload: {
          modalState: !modalState
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
  dispatch,
  loading
}) => ({ consignmentUsers, consignmentOutlet, dispatch, loading }))(Users)
