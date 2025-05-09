import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { Tabs } from 'antd'
import { connect } from 'dva'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane


const SupplierPrice = ({ app, dispatch, loading, supplierPrice, location, city }) => {
  const { activeKey, listSupplierPrice, pagination, currentItem, modalType, disable, display, isChecked, show } = supplierPrice
  const { listCity } = city
  const { user, storeInfo } = app
  const filterProps = {
    display,
    isChecked,
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      // dispatch({
      //   type: 'customer/query',
      //   payload: {
      //     ...value
      //   }
      // })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          ...value,
          page: 1
        }
      }))
    },
    switchIsChecked () {
      dispatch({
        type: 'supplier/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      const { query, pathname } = location
      const { q, createdAt, page, ...other } = query
      dispatch(routerRedux.push({
        pathname,
        query: {
          page: 1,
          ...other
        }
      }))
    }
  }
  // const importExcelProps = {
  //   data: [{ id: 1 }],
  //   user,
  //   storeInfo
  // }

  const formProps = {
    listCity,
    item: currentItem,
    modalType,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `supplierPrice/${modalType}`,
        payload: {
          id,
          data
        }
      })
    },
    onCancel () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'supplierPrice/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
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
          {/* <div style={{ marginLeft: '-10px' }}>
            <ImportExcel {...importExcelProps} />
          </div> */}
          <Filter {...filterProps} />
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
  dispatch: PropTypes.func,
  city: PropTypes.object
}

export default connect(({ supplierPrice, city, loading, app }) => ({ supplierPrice, city, loading, app }))(SupplierPrice)
