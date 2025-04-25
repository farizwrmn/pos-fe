import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import { connect } from 'dva'
import ImportExcel from '../../procurement/purchaseOrder/main/ImportExcel'
import Form from './Form'
import List from './List'

const TabPane = Tabs.TabPane


const SupplierPrice = ({ app, dispatch, loading, resetFields, supplierPrice, location }) => {
  const { activeKey, listSupplierPrice, pagination } = supplierPrice
  const { user, storeInfo } = app
  const importExcelProps = {
    data: [{ id: 1 }],
    user,
    storeInfo
  }

  const formProps = {
    data: [{ id: 1 }],
    user,
    storeInfo,
    dispatch,
    loading,
    resetFields
  }

  const changeTab = (key) => {
    dispatch({
      type: 'supplierPrice/updateState',
      payload: {
        activeKey: key,
        modalType: 'add',
        currentItem: {},
        disable: ''
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
    // dispatch({ type: 'supplierActive/resetCityList' })
  }

  const listProps = {
    dataSource: listSupplierPrice,
    user,
    storeInfo,
    pagination,
    loading: loading.effects['supplierPrice/query'],
    location,
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
    },
    editItem (item) {
      dispatch({
        type: 'supplierPrice/updateState',
        payload: {
          modalType: 'edit',
          activeKey: '0',
          currentItem: item,
          disable: 'disabled'
        }
      })
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0
        }
      }))
      dispatch({
        type: 'city/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'supplierPrice/delete',
        payload: id
      })
    }
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} type="card">
        <TabPane tab="Form" key="0">
          {activeKey === '0' && <Form {...formProps} />
          }
        </TabPane>
        <TabPane tab="Browse" key="1">
          <ImportExcel {...importExcelProps} />
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

SupplierPrice.propTypes = {
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  supplierPrice: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ supplierPrice, city, loading, app }) => ({ supplierPrice, city, loading, app }))(SupplierPrice)
