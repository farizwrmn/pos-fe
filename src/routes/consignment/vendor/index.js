import React from 'react'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { routerRedux } from 'dva/router'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

function Vendor ({ consignmentVendor, consignmentCategory, dispatch, loading }) {
  const { list, selectedVendor, lastVendor, activeKey, formType, pagination, q } = consignmentVendor
  const { list: categoryList } = consignmentCategory

  const changeTab = (key) => {
    dispatch({
      type: 'consignmentVendor/updateState',
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
    formType,
    dataSource: list,
    pagination,
    loading: loading.effects['consignmentVendor/query'],
    edit (record) {
      dispatch({
        type: 'consignmentVendor/updateState',
        payload: {
          formType: 'edit',
          activeKey: '0',
          selectedVendor: record
        }
      })
    },
    onFilterChange ({ pagination }) {
      dispatch({
        type: 'consignmentVendor/query',
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
        type: 'consignmentVendor/query',
        payload: {
          q: value
        }
      })
    }
  }

  const formProps = {
    formType,
    selectedVendor,
    lastVendor,
    categoryList,
    cancelEdit () {
      dispatch({
        type: 'consignmentVendor/updateState',
        payload: {
          selectedVendor: {},
          formType: 'add'
        }
      })
    },
    add (data, resetFields) {
      dispatch({
        type: 'consignmentVendor/add',
        payload: {
          ...data,
          resetFields
        }
      })
    },
    edit (data, resetFields) {
      dispatch({
        type: 'consignmentVendor/edit',
        payload: {
          ...data,
          id: selectedVendor.id,
          resetFields
        }
      })
    },
    resetPassword (password) {
      dispatch({
        type: 'consignmentVendor/resetPassword',
        payload: {
          id: selectedVendor.id,
          password
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
  consignmentVendor,
  consignmentCategory,
  dispatch,
  loading
}) => ({ consignmentVendor, consignmentCategory, dispatch, loading }))(Vendor)
