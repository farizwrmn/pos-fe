import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { message, Icon } from 'antd'
import { color, lstorage } from 'utils'
import moment from 'moment'
import Form from './Form'

const Cash = ({ bankentry, accountCode, customer, supplier, dispatch, location }) => {
  const { listItem, modalVisible, inputType, modalType, currentItem, currentItemList } = bankentry

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
  const { listAccountCode, listAccountCodeExpense } = accountCode

  const modalProps = {
    title: modalType === 'add' ? 'Add Detail' : 'Edit Detail',
    item: currentItemList,
    visible: modalVisible,
    modalType,
    listAccountCode: listAccountCodeExpense,
    onCancel () {
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: false
        }
      })
    },
    addModalItem (data) {
      data.no = (listItem || []).length + 1
      listItem.push(data)
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: false,
          modalType: 'add',
          listItem,
          currentItemList: {}
        }
      })
      message.success('success add item')
    },
    editModalItem (data) {
      listItem[data.no - 1] = data
      dispatch({
        type: 'bankentry/updateState',
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
  const listDetailProps = {
    dataSource: listItem
  }
  let timeout
  const formProps = {
    listAccountCode,
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
    onSubmit (data, resetFields) {
      dispatch({
        type: 'bankentry/transfer',
        payload: {
          data,
          resetFields
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
        type: 'bankentry/updateState',
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
        type: 'bankentry/updateState',
        payload: {
          currentItem: data
        }
      })
    },
    modalShow (value) { // string
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          modalVisible: true,
          modalType: 'add',
          inputType: value
        }
      })
    },
    resetListItem (value) {
      dispatch({
        type: 'bankentry/updateState',
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
        type: 'bankentry/updateState',
        payload: {
          modalVisible: true,
          modalType: 'edit',
          currentItemList: record
        }
      })
    }
  }

  return (
    <div className="content-inner">
      <Form {...formProps} />
    </div>
  )
}

Cash.propTypes = {
  bankentry: PropTypes.object,
  paymentOpts: PropTypes.object,
  bank: PropTypes.object,
  pos: PropTypes.object.isRequired,
  loading: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({
  bankentry,
  accountCode,
  customer,
  supplier,
  loading,
  pos }) => ({ bankentry, accountCode, customer, supplier, loading, pos }))(Cash)
