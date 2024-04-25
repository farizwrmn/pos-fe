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

const ContractType = ({ contractType, loading, dispatch, location, app }) => {
  const { list, modalType, currentItem, activeKey, disable, show } = contractType
  const { user, storeInfo } = app
  const filterProps = {
    show,
    filter: {
      ...location.query
    },
    onFilterChange (value) {
      dispatch({
        type: 'contractType/query',
        payload: {
          ...value
        }
      })
    },
    onResetClick () {
      dispatch({ type: 'contractType/resetCityList' })
    }
  }

  const listProps = {
    dataSource: list,
    user,
    storeInfo,
    loading: loading.effects['contractType/query'],
    location,
    editItem (item) {
      dispatch({
        type: 'contractType/updateState',
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
        type: 'contractType/query'
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'contractType/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'contractType/updateState',
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
    dispatch({ type: 'contractType/resetCityList' })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'contractType/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const onShowHideSearch = () => {
    dispatch({
      type: 'contractType/updateState',
      payload: {
        show: !show
      }
    })
  }

  const formProps = {
    listContractType: list,
    dispatch,
    modalType,
    item: currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data) {
      dispatch({
        type: `contractType/${modalType}`,
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
        type: 'contractType/updateState',
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

ContractType.propTypes = {
  contractType: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ contractType, loading, app }) => ({ contractType, loading, app }))(ContractType)
