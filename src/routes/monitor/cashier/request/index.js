import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Tabs, Modal } from 'antd'
import FormRequest from './Form'
import Browse from './Browse'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Request = ({ cashier, dispatch, loading }) => {
  const { currentItem, requestActiveTabKey, listClosedCashRegister, pagination } = cashier
  const formProps = {
    item: currentItem,
    submitRequest (id, data) {
      dispatch({
        type: 'cashier/sendRequestOpenCashRegister',
        payload: { id, data }
      })
    }
  }

  const filterProps = {
    filterByDate (date) {
      dispatch({ type: 'cashier/getClosedCashRegister', payload: { period: date } })
    }
  }

  const browseProps = {
    dataSource: listClosedCashRegister,
    loading: loading.effects['cashier/getClosedCashRegister'],
    pagination,
    onChange (page) {
      const { query, pathname } = location
      console.log(query)
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          page: page.current,
          pageSize: page.pageSize
        }
      }))
    },
    requestToOpenCashRegister (record) {
      dispatch({
        type: 'cashier/updateState',
        payload: {
          requestActiveTabKey: '0',
          currentItem: record
        }
      })
    }
  }

  const changeTab = (key) => {
    if (Object.keys(currentItem).length) {
      Modal.confirm({
        content: 'Switching tab will remove the saved item from the form. Do you still want to switch the tab?',
        onOk () {
          dispatch({
            type: 'cashier/updateState',
            payload: {
              requestActiveTabKey: key,
              currentItem: {}
            }
          })
          dispatch({ type: 'cashier/getClosedCashRegister' })
        },
        onCancel () { }
      })
    } else {
      dispatch({
        type: 'cashier/updateState',
        payload: {
          requestActiveTabKey: key
        }
      })
    }
  }
  return (
    <div className="content-inner" style={{ clear: 'both' }}>
      <Tabs activeKey={requestActiveTabKey} onChange={key => changeTab(key)}>
        <TabPane tab="Form" key="0" disabled={!Object.keys(currentItem).length}>
          <FormRequest {...formProps} />
        </TabPane>
        <TabPane tab="Browse" key="1" >
          <Filter {...filterProps} />
          <div style={{ height: 10 }} />
          <Browse {...browseProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default connect(({ cashier, loading }) => ({ cashier, loading }))(Request)
