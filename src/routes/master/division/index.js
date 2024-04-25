import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs, Menu, Icon, Dropdown } from 'antd'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const TabPane = Tabs.TabPane

const Division = ({ employee, division, loading, dispatch, location, app }) => {
  const { list, modalType, currentItem, activeKey, disable, show } = division
  const { list: listManager /* modalType, currentItem, activeKey, disable, show */ } = employee
  const { user, storeInfo } = app
  const filterProps = {
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch({
        type: 'division/query',
        payload: {
          ...value
        }
      })
    },
    onResetClick () {
      dispatch({ type: 'division/resetCityList' })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    loading: loading.effects['division/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'division/updateState',
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
        type: 'division/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'division/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'division/updateState',
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
    dispatch({ type: 'division/resetCityList' })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'division/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const onShowHideSearch = () => {
    dispatch({
      type: 'division/updateState',
      payload: {
        show: !show
      }
    })
  }

  const formProps = {
    listDivision: list,
    listManager,
    dispatch,
    modalType,
    item: currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `division/${modalType}`,
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
        type: 'division/updateState',
        payload: {
          currentItem: {}
        }
      })
    }
  }

  const printProps = {
    dataSource: list,
    user,
    storeInfo
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

Division.propTypes = {
  employee: PropTypes.object,
  division: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ employee, division, loading, app }) => ({ employee, division, loading, app }))(Division)
