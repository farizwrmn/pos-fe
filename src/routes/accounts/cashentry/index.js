import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Button, message, Modal, Tabs, Icon, Row, Col, Card } from 'antd'
import { color, isEmptyObject, lstorage } from 'utils'
import moment from 'moment'
import Form from './Form'
import List from './List'
import Filter from './Filter'
import ModalShift from './ModalShift'

const TabPane = Tabs.TabPane

const Cash = ({ cashentry, accountCode, pos, shift, counter, customer, supplier, loading, dispatch, location, app }) => {
  const { listCash, listItem, pagination, modalVisible, inputType, modalType, currentItem, currentItemList, activeKey } = cashentry
  const {
    modalShiftVisible,
    dataCashierTrans,
    listCashier,
    curCashierNo,
    cashierBalance,
    cashierInformation
  } = pos

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

  if (!isEmptyObject(cashierInformation)) currentCashier = cashierInformation
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
    if (!currentCashier.period) {
      infoCashRegister.desc = '* Select the correct cash register'
      infoCashRegister.dotVisible = true
    } else if (currentCashier.period !== moment(new Date(), 'DD/MM/YYYY').subtract(lstorage.getLoginTimeDiff(), 'milliseconds').toDate().format('yyyy-MM-dd')) {
      infoCashRegister.desc = '* The open cash register date is different from current date'
      infoCashRegister.dotVisible = true
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
  const { listShift } = shift
  const { listCounter } = counter
  const { listCustomer } = customer
  const { listSupplier } = supplier
  const { listAccountCode } = accountCode
  const { user, storeInfo } = app
  const filterProps = {
    onFilterChange (value) {
      dispatch({
        type: 'cashentry/query',
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
    loading: loading.effects['cashentry/query'],
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
          activeKey: 0
        }
      }))
      dispatch({
        type: 'cashentry/editItem',
        payload: { item }
      })
    },
    deleteItem (id) {
      dispatch({
        type: 'cashentry/delete',
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
            type: 'cashentry/changeTab',
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
          dispatch({ type: 'cashentry/updateState', payload: { listCash: [], listItem: [] } })
        }
      })
    } else {
      dispatch({
        type: 'cashentry/changeTab',
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
      dispatch({ type: 'cashentry/updateState', payload: { listCash: [], listItem: [] } })
    }
  }
  const clickBrowse = () => {
    dispatch({
      type: 'cashentry/updateState',
      payload: {
        activeKey: '1'
      }
    })
  }

  const modalProps = {
    title: modalType === 'add' ? 'Add Detail' : 'Edit Detail',
    item: currentItemList,
    visible: modalVisible,
    modalType,
    listAccountCode,
    onCancel () {
      dispatch({
        type: 'cashentry/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    addModalItem (data, inputType) {
      data.no = (listItem || []).length + 1
      const currentTotal = listItem.reduce((cnt, o) => cnt + parseFloat(o.amountOut || 0), 0)
      if ((parseFloat(currentTotal) + parseFloat(data.amountOut || 0) + parseFloat(cashierBalance.cashOut || 0)) > (parseFloat(cashierBalance.cashIn || 0) + parseFloat(cashierInformation.openingBalance || 0)) && inputType === 'E') {
        Modal.warning({
          title: 'Cash out is bigger than current balance',
          content: 'Please recount your cash'
        })
      } else {
        listItem.push(data)
        dispatch({
          type: 'cashentry/updateState',
          payload: {
            modalVisible: false,
            modalType: 'add',
            listItem,
            currentItemList: {}
          }
        })
        message.success('success add item')
      }
    },
    editModalItem (data, inputType) {
      const currentTotal = listItem.reduce((cnt, o) => cnt + parseFloat(o.amountOut || 0), 0)
      if (((currentTotal - listItem[data.no - 1].amountOut) + parseFloat(data.amountOut || 0) + parseFloat(cashierBalance.cashOut || 0)) > (parseFloat(cashierBalance.cashIn || 0) + parseFloat(cashierInformation.openingBalance || 0)) && inputType === 'E') {
        Modal.warning({
          title: 'Cash out is bigger than current balance',
          content: 'Please recount your cash'
        })
      } else {
        listItem[data.no - 1] = data
        dispatch({
          type: 'cashentry/updateState',
          payload: {
            modalVisible: false,
            modalType: 'add',
            listItem,
            currentItemList: {}
          }
        })
        message.success('success edit item')
      }
    }
  }
  const listDetailProps = {
    dataSource: listItem
  }
  let timeout
  const formProps = {
    modalType,
    modalVisible,
    modalProps,
    inputType,
    listDetailProps,
    listItem,
    listCustomer,
    listSupplier,
    item: currentItem,
    button: `${modalType === 'add' ? 'Add' : 'Update'}`,
    onSubmit (data, detail, oldValue) {
      dispatch({
        type: `cashentry/${modalType}`,
        payload: {
          cashierBalance,
          cashierInformation,
          inputType,
          data,
          detail,
          oldValue
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
        type: 'cashentry/updateState',
        payload: {
          currentItem: {}
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
        type: 'cashentry/updateState',
        payload: {
          currentItem: data
        }
      })
    },
    modalShow (value) { // string
      dispatch({
        type: 'cashentry/updateState',
        payload: {
          modalVisible: true,
          modalType: 'add',
          inputType: value
        }
      })
    },
    resetListItem (value) {
      dispatch({
        type: 'cashentry/updateState',
        payload: {
          listItem: [],
          inputType: value
        }
      })
    },
    modalShowList (record) {
      dispatch({
        type: 'accountCode/query',
        payload: {
          pageSize: 5,
          id: record.accountId.key
        }
      })
      dispatch({
        type: 'cashentry/updateState',
        payload: {
          modalVisible: true,
          modalType: 'edit',
          currentItemList: record
        }
      })
    }
  }

  const modalShiftProps = {
    item: dataCashierTrans,
    listCashier,
    listShift,
    listCounter,
    curCashierNo,
    currentCashier,
    visible: modalShiftVisible,
    cashierId: user.userid,
    infoCashRegister,
    dispatch,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    getCashier () {
      dispatch({
        type: 'pos/loadDataPos'
      })
    },
    onBack () {
      dispatch({ type: 'pos/backPrevious' })
    },
    onCancel () {
      Modal.error({
        title: 'Error',
        content: 'Please Use Confirm Button...!'
      })
    },
    onOk (data) {
      dispatch({
        type: 'pos/cashRegister',
        payload: data
      })
    },
    findShift () {
      dispatch({ type: 'shift/query' })
    },
    findCounter () {
      dispatch({ type: 'counter/query' })
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
          <Row>
            <Card bordered={false} noHovering style={{ fontWeight: '600', color: color.charcoal }}>
              <Row>
                <Col span={2}># {currentCashier.id} </Col>
                <Col md={5} lg={5}>Opening Balance : {currentCashier.openingBalance}</Col>
                <Col md={5} lg={5}>Cash In : {cashierBalance.cashIn}</Col>
                <Col md={5} lg={5}>Cash Out : {cashierBalance.cashOut}</Col>
                <Col md={5} lg={5}>Date : {currentCashier.period}</Col>
              </Row>
            </Card>
          </Row>
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
      {modalShiftVisible && <ModalShift {...modalShiftProps} />}
    </div>
  )
}

Cash.propTypes = {
  cashentry: PropTypes.object,
  paymentOpts: PropTypes.object,
  bank: PropTypes.object,
  pos: PropTypes.object.isRequired,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({
  cashentry,
  accountCode,
  customer,
  supplier,
  loading,
  pos,
  shift,
  counter,
  app }) => ({ cashentry, accountCode, customer, supplier, loading, pos, shift, counter, app }))(Cash)
