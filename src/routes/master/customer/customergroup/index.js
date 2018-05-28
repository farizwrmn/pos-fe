import React from 'react'
import PropTypes from 'prop-types'
import { Tabs, Button, Icon, Dropdown, Menu } from 'antd'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const CustomerGroup = ({ customergroup, loading, dispatch, location, app }) => {
  const { listGroup, display, isChecked, modalType, currentItem, activeKey, disable, show } = customergroup
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
        type: 'customergroup/query',
        payload: {
          ...value
        }
      })
    },
    switchIsChecked () {
      dispatch({
        type: 'customergroup/switchIsChecked',
        payload: `${isChecked ? 'none' : 'block'}`
      })
    },
    onResetClick () {
      dispatch({
        type: 'customergroup/resetCustomerGroupList'
      })
    }
  }

  const listProps = {
    dataSource: listGroup,
    user,
    storeInfo,
    loading: loading.effects['customergroup/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'customergroup/updateState',
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
    },
    deleteItem (id) {
      dispatch({
        type: 'customergroup/delete',
        payload: id
      })
    }
  }

  const formProps = {
    item: currentItem,
    modalType,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `customergroup/${modalType}`,
        payload: data
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
        type: 'customergroup/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'customergroup/updateState',
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
    dispatch({ type: 'customergroup/resetCustomerGroupList' })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'customergroup/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const onShowHideSearch = () => {
    dispatch({
      type: 'customergroup/updateState',
      payload: {
        show: !show
      }
    })
  }

  const printProps = {
    dataSource: listGroup,
    user,
    storeInfo
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => clickBrowse()}>Browse</Button> : (<div> <Button onClick={() => onShowHideSearch()}>{`${show ? 'Hide' : 'Show'} Search`}</Button> <Dropdown overlay={menu}>
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

CustomerGroup.propTypes = {
  customergroup: PropTypes.object,
  loading: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ customergroup, loading, app }) => ({ customergroup, loading, app }))(CustomerGroup)
