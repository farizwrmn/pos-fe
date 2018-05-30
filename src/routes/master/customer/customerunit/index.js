import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, Tabs, Dropdown, Menu, Icon } from 'antd'
import Form from './Form'
import List from './List'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'
import ModalBrowse from './Modal'

const TabPane = Tabs.TabPane

const CustomerUnit = ({ customer, customerunit, loading, dispatch, location, app }) => {
  const { listUnit, modalType, selected, currentItem, activeKey, disable, customerInfo, listBrand, listModel, listType } = customerunit
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
    dataCustomer,
    user,
    loading: loading.effects['customerunit/query'],
    storeInfo,
    location,
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
    deleteItem (code, id) {
      dispatch({
        type: 'customerunit/delete',
        payload: {
          memberCode: code,
          policeNo: id
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
    item: currentItem,
    disabled: `${modalType === 'edit' ? disable : ''}`,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    listItem: listUnit,
    modalType,
    customerInfo,
    openModal,
    listModel,
    listBrand,
    listType,
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
    },
    onCancelUpdate () {
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: '1'
        }
      }))
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          currentItem: {}
        }
      })
    },
    onFocusBrand () {
      dispatch({ type: 'customerunit/queryCarBrands' })
    },
    onFocusModel () {
      if (Object.keys(selected.brand).length) {
        dispatch({ type: 'customerunit/queryCarModels', payload: { code: selected.brand.key } })
      }
    },
    onFocusType () {
      if (Object.keys(selected.model).length) {
        dispatch({ type: 'customerunit/queryCarTypes', payload: { code: selected.model.key } })
      }
    },
    onSelectBrand (brand) {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          selected: {
            brand,
            model: selected.model,
            type: selected.type
          }
        }
      })
    },
    onSelectModel (model) {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          selected: {
            brand: selected.brand,
            model,
            type: selected.type
          }
        }
      })
    },
    onSelectType (type) {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          selected: {
            brand: selected.brand,
            model: selected.model,
            type
          }
        }
      })
    },
    resetCars () {
      dispatch({
        type: 'customerunit/updateState',
        payload: {
          listBrand: [],
          listModel: [],
          listType: []
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
    dataSource: listUnit,
    dataCustomer,
    user,
    storeInfo
  }

  const menu = (
    <Menu>
      <Menu.Item key="1"><PrintPDF {...printProps} /></Menu.Item>
      <Menu.Item key="2"><PrintXLS {...printProps} /></Menu.Item>
    </Menu>
  )

  const moreButtonTab = activeKey === '0' ? <Button onClick={() => clickBrowse()}>Browse</Button> : (listUnit.length > 0 ? (<Dropdown overlay={menu}>
    <Button style={{ marginLeft: 8 }}>
      <Icon type="printer" /> Print
    </Button>
  </Dropdown>) : '')

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
