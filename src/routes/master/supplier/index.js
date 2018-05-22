import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs, Dropdown, Menu, Icon } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const Supplier = ({ supplier, city, loading, dispatch, location, app }) => {
  const { list, display, isChecked, modalType, currentItem, activeKey, disable, show } = supplier
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
      dispatch({
        type: 'supplier/query',
        payload: {
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'supplier/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      dispatch({ type: 'supplier/resetSupplierList' })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    loading: loading.effects['supplier/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'supplier/updateState',
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
        type: 'supplier/delete',
        payload: id
      })
    }
  }

  const formProps = {
    listCity,
    item: currentItem,
    modalType,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (id, data) {
      dispatch({
        type: `supplier/${modalType}`,
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
        type: 'supplier/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    showCities () {
      dispatch({
        type: 'city/query'
      })
    }
  }

  const printProps = {
    dataSource: list,
    user,
    storeInfo
  }

  const clickBrowse = () => {
    dispatch({
      type: 'supplier/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const changeTab = (key) => {
    dispatch({
      type: 'supplier/updateState',
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
    // dispatch({ type: 'supplier/resetSupplierList' })
  }

  const onShowHideSearch = () => {
    dispatch({
      type: 'supplier/updateState',
      payload: {
        show: !show
      }
    })
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => clickBrowse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button><Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown> </div>)

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          <Filter {...filterProps} />
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

Supplier.propTypes = {
  supplier: PropTypes.object,
  city: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ supplier, city, loading, app }) => ({ supplier, city, loading, app }))(Supplier)
