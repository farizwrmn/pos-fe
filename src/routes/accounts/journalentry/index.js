import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, message, Modal, Tabs, Icon } from 'antd'
import { color, lstorage } from 'utils'
import moment from 'moment'
import Form from './Form'
import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane

const Cash = ({ journalentry, accountCode, customer, supplier, loading, dispatch, location, app }) => {
  const { listCash, listItem, pagination, modalVisible, modalType, modalItemType, currentItem, currentItemList, activeKey } = journalentry

  let currentCashier = {
    cashierId: null,
    employeeName: null,
    shiftId: null,
    shiftName: null,
    counterId: null,
    counterName: null,
    period: null,
    status: null,
    cashActive: null
  }

  let infoCashRegister = {}
  infoCashRegister.title = 'Cashier Information'
  infoCashRegister.titleColor = color.normal
  infoCashRegister.descColor = color.error
  infoCashRegister.dotVisible = false
  infoCashRegister.cashActive = ((currentCashier.cashActive || '0') === '1')
  let checkTimeDiff = lstorage.getLoginTimeDiff()
  if (checkTimeDiff > 500) {
    console.log('something fishy', checkTimeDiff)
  } else {
    const currentDate = moment(new Date(), 'DD/MM/YYYY').subtract(lstorage.getLoginTimeDiff(), 'milliseconds').toDate().format('yyyy-MM-dd')
    if (!currentCashier.period) {
      infoCashRegister.desc = '* Select the correct cash register'
      infoCashRegister.dotVisible = true
    } else if (currentCashier.period !== currentDate) {
      if (currentCashier.period && currentDate) {
        const diffDays = moment.duration(moment(currentCashier.period, 'YYYY-MM-DD').diff(currentDate)).asDays()
        infoCashRegister.desc = `${diffDays} day${Math.abs(diffDays) > 1 ? 's' : ''}`
        infoCashRegister.dotVisible = true
      }
    }
    infoCashRegister.Caption = infoCashRegister.title + infoCashRegister.desc
    infoCashRegister.CaptionObject =
      (<span style={{ color: infoCashRegister.titleColor }}>
        <Icon type={infoCashRegister.cashActive ? 'smile-o' : 'frown-o'} /> {infoCashRegister.title}
        <span style={{ display: 'block', color: infoCashRegister.descColor }}>
          {infoCashRegister.desc}
        </span>
      </span>)
  }
  const { listCustomer } = customer
  const { listSupplier } = supplier
  const { listAccountCodeLov } = accountCode
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'journalentry/query',
        payload: {
          ...value
        }
      })
    }
  }

  const listProps = {
    dataSource: listCash,
    user,
    pagination,
    storeInfo,
    listItem,
    loading: loading.effects['journalentry/query'],
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
      const { pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          activeKey: 0,
          edit: item.id
        }
      }))
    },
    deleteItem (id) {
      dispatch({
        type: 'journalentry/delete',
        payload: id
      })
    }
  }

  const changeTab = (key) => {
    if (key !== '0') {
      Modal.confirm({
        title: 'Reset unsaved process',
        content: 'this action will reset your current process',
        onOk () {
          dispatch({
            type: 'journalentry/changeTab',
            payload: { key }
          })
          const { query, pathname } = location
          dispatch(routerRedux.push({
            pathname,
            query: {
              ...query,
              activeKey: key
            }
          }))
          dispatch({ type: 'journalentry/updateState', payload: { listCash: [], listItem: [] } })
        }
      })
    } else {
      dispatch({
        type: 'journalentry/changeTab',
        payload: { key }
      })
      const { query, pathname } = location
      dispatch(routerRedux.push({
        pathname,
        query: {
          ...query,
          activeKey: key
        }
      }))
      dispatch({ type: 'journalentry/updateState', payload: { listCash: [], listItem: [] } })
    }
  }
  const clickBrowse = () => {
    dispatch({
      type: 'journalentry/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const modalProps = {
    title: modalItemType === 'add' ? 'Add Detail' : 'Edit Detail',
    item: currentItemList,
    visible: modalVisible,
    modalItemType,
    modalType,
    listAccountCode: listAccountCodeLov,
    onCancel () {
      dispatch({
        type: 'journalentry/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    addModalItem (data) {
      const { listItem } = journalentry
      data.no = (listItem || []).length + 1
      listItem.push(data)
      dispatch({
        type: 'journalentry/updateState',
        payload: {
          modalVisible: false,
          modalItemType: 'add',
          listItem,
          currentItemList: {}
        }
      })
      message.success('success add item')
    },
    editModalItem (data) {
      const { listItem } = journalentry
      listItem[data.no - 1] = data
      dispatch({
        type: 'journalentry/updateState',
        payload: {
          modalVisible: false,
          modalItemType: 'add',
          listItem,
          currentItemList: {}
        }
      })
      message.success('success edit item')
    }
  }
  const listDetailProps = {
    dataSource: listItem
  }
  let timeout
  const formProps = {
    dispatch,
    modalType,
    modalVisible,
    modalProps,
    listDetailProps,
    modalItemType,
    listItem,
    listCustomer,
    listSupplier,
    storeInfo,
    item: currentItem,
    loading: loading.effects['journalentry/add'] || loading.effects['journalentry/edit'] || loading.effects['journalentry/setEdit'],
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, detail, oldValue, reset) {
      dispatch({
        type: `journalentry/${modalType}`,
        payload: {
          data,
          detail,
          oldValue,
          reset
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
        type: 'journalentry/updateState',
        payload: {
          modalType: 'add',
          currentItem: {},
          listItem: []
        }
      })
    },
    showLov (models, data) {
      if (!data) {
        dispatch({
          type: `${models}/query`,
          payload: {
            pageSize: 5
          }
        })
      }
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }

      timeout = setTimeout(() => {
        dispatch({
          type: `${models}/query`,
          payload: {
            pageSize: 5,
            ...data
          }
        })
      }, 400)
    },
    updateCurrentItem (data) {
      dispatch({
        type: 'journalentry/updateState',
        payload: {
          currentItem: data
        }
      })
    },
    modalShow () { // string
      dispatch({
        type: 'journalentry/updateState',
        payload: {
          modalVisible: true,
          modalItemType: 'add'
        }
      })
    },
    resetListItem () {
      dispatch({
        type: 'journalentry/updateState',
        payload: {
          listItem: []
        }
      })
    },
    modalShowList (record) {
      dispatch({
        type: 'journalentry/updateState',
        payload: {
          modalVisible: true,
          modalItemType: 'edit',
          currentItemList: record
        }
      })
    }
  }

  let moreButtonTab
  if (activeKey === '0') {
    moreButtonTab = <Button onClick={() => clickBrowse()}>Browse</Button>
  }

  return (
    <div className="content-inner">
      <Tabs activeKey={activeKey} onChange={key => changeTab(key)} tabBarExtraContent={moreButtonTab} type="card">
        <TabPane tab={`Form ${modalType === 'add' ? 'Add' : 'Update'}`} key="0" >
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

Cash.propTypes = {
  journalentry: PropTypes.object,
  paymentOpts: PropTypes.object,
  bank: PropTypes.object,
  pos: PropTypes.object.isRequired,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(
  ({
    journalentry,
    accountCode,
    customer,
    supplier,
    loading,
    pos,
    app
  }) => ({
    journalentry,
    accountCode,
    customer,
    supplier,
    loading,
    pos,
    app
  }))(Cash)
