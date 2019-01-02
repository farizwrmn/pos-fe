import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs, Dropdown, Menu } from 'antd'
import _ from 'lodash'
import Form from './Form'
import List from './List'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'
import ModalBrowse from './Modal'

const TabPane = Tabs.TabPane

const CustomerUnit = ({ customer, customerunit, loading, dispatch, location, app }) => {
  const { listUnit, listUnitAll, modalType, currentItem, activeKey, disable, customerInfo } = customerunit
  const { user, storeInfo } = app
  const { list, listCustomer, modalVisible, dataCustomer, searchText, pagination } = customer

  const modalProps = {
    listCustomer,
    searchText,
    pagination,
    loading,
    modalVisible,
    visible: modalVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    onSearch () {
      dispatch({
        type: 'customer/query',
        payload: {
          page: 1,
          q: searchText
        }
      })
    },
    onReset () {
      dispatch({
        type: 'customer/query'
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          searchText: ''
        }
      })
    },
    onClickRow (record) {
      if (activeKey === '1') {
        dispatch({
          type: 'customerunit/query',
          payload: {
            code: record.memberCode
          }
        })
      }
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          customerInfo: record
        }
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          modalVisible: false,
          activeKey: '1',
          dataCustomer: record
        }
      })
    },
    changeText (text) {
      dispatch({
        type: 'customer/updateState',
        payload: {
          searchText: text
        }
      })
    },
    onChange (page) {
      dispatch({
        type: 'customer/query',
        payload: {
          q: searchText,
          page: page.current,
          pageSize: page.pageSize
        }
      })
    }
  }

  const listProps = {
    dataSource: listUnit,
    loading: loading.effects['customerunit/query'],
    editItem (item) {
      dispatch({
        type: 'customerunit/changeTab',
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
    deleteItem (policeNo) {
      dispatch({
        type: 'customerunit/delete',
        payload: {
          member: customerInfo,
          policeNo
        }
      })
    }
  }

  const openModal = () => {
    dispatch({
      type: 'customer/updateState',
      payload: {
        modalVisible: true,
        listCustomer: list
      }
    })
  }

  const formProps = {
    customerunit,
    dispatch,
    item: currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    listItem: listUnit,
    modalType,
    customerInfo,
    openModal,
    filter: {
      ...location.query
    },
    onSubmit (data) {
      dispatch({
        type: `customerunit/${modalType}`,
        payload: data
      })
      dispatch({
        type: 'customer/updateState',
        payload: {
          dataCustomer: {}
        }
      })
    }
  }

  const changeTab = (key) => {
    dispatch({
      type: 'customerunit/changeTab',
      payload: {
        activeKey: key,
        modalType: 'add',
        currentItem: {},
        disable: '',
        listUnit: [],
        customerInfo: {},
        pagination: {
          total: 0
        }
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
    dispatch({
      type: 'customer/updateState',
      payload: {
        dataCustomer: {}
      }
    })
  }

  const clickBrowse = () => {
    dispatch({
      type: 'customerunit/updateState',
      payload: {
        activeKey: '1',
        customerInfo: {}
      }
    })
  }

  const printProps = {
    dataSource: _.uniqBy(listUnit, 'memberId').map(data => ({
      ...data,
      memberUnit: listUnit.filter(x => x.memberId === data.memberId)
    })),
    dataCustomer,
    user,
    storeInfo
  }

  const getMemberUnitData = ({ key }) => {
    if (key === '5' && listUnitAll.length === 0 && !loading.effects['customerunit/getAll']) {
      dispatch({
        type: 'customerunit/getAll'
      })
    }
  }
  const dataAll = _.uniqBy(listUnitAll, 'memberId').map(data => ({
    ...data,
    memberUnit: listUnitAll.filter(x => x.memberId === data.memberId)
  }))
  const menu = (
    <Menu onClick={getMemberUnitData}>
      {_.uniqBy(listUnit, 'memberId').length === 1 ? <Menu.Item key="1"><PrintPDF name="PDF (current)" {...printProps} /></Menu.Item> : null}
      {_.uniqBy(listUnit, 'memberId').length === 1 ? <Menu.Item disabled={listUnit.length === 0} key="2"><PrintXLS name="XLS (current)" {...printProps} /></Menu.Item> : null}
      {listUnitAll.length > 0 && listUnitAll.length <= 500 && <Menu.Item key="3"><PrintPDF name="PDF (all)" {...printProps} dataSource={dataAll} /></Menu.Item>}
      {listUnitAll.length > 0 && <Menu.Item key="4"><PrintXLS name="XLS (all)" {...printProps} dataSource={dataAll} dataList={dataAll} /></Menu.Item>}
      {listUnitAll.length === 0 && <Menu.Item key="5">Get All</Menu.Item>}
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ?
    <Button onClick={() => clickBrowse()}>Browse</Button>
    :
    (<Dropdown overlay={menu}>
      <Button icon={loading.effects['customerunit/getAll'] ? 'loading' : 'printer'} style={{ marginLeft: 8 }}>
        Print
      </Button>
    </Dropdown>)

  return (
    <div className="content-inner">
      {modalVisible && <ModalBrowse {...modalProps} />}
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab="Form" key="0" >
          {activeKey === '0' && <Form {...formProps} />}
        </TabPane>
        <TabPane tab="Browse" key="1" >
          <Button type="primary" size="large" onClick={openModal} style={{ marginBottom: 15 }}>Find Customer</Button>
          <List {...listProps} />
        </TabPane>
      </Tabs>
    </div>
  )
}

CustomerUnit.propTypes = {
  customerunit: PropTypes.object,
  customer: PropTypes.object,
  loading: PropTypes.object,
  app: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ customerunit, customer, loading, app }) => ({ customerunit, customer, loading, app }))(CustomerUnit)
