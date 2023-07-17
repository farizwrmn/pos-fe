import { Modal } from 'antd'
import React from 'react'
import { connect } from 'dva'
import { prefix } from 'utils/config.main'
import moment from 'moment'
import { APISOCKET } from 'utils/config.company'
import { lstorage } from 'utils'
import io from 'socket.io-client'
import QrisPayment from './qrisPayment'
import Success from './qrisPayment/Success'
import Failed from './qrisPayment/Failed'

const getDate = (mode) => {
  let today = new Date()
  let dd = today.getDate()
  let mm = today.getMonth() + 1 // January is 0!
  let yyyy = today.getFullYear()
  if (dd < 10) {
    dd = `0${dd}`
  }
  if (mm < 10) {
    mm = `0${mm}`
  }
  if (mode === 1) {
    today = dd + mm + yyyy
  } else if (mode === 2) {
    today = mm + yyyy
  } else if (mode === 3) {
    today = `${yyyy}-${mm}-${dd}`
  }

  return today
}

const checkTime = (i) => {
  if (i < 10) { i = `0${i}` } // add zero in front of numbers < 10
  return i
}

const setTime = () => {
  let today = new Date()
  let h = today.getHours()
  let m = today.getMinutes()
  let s = today.getSeconds()
  m = checkTime(m)
  s = checkTime(s)

  return `${h}:${m}:${s}`
}

const options = {
  upgrade: true,
  transports: ['websocket'],
  pingTimeout: 100,
  pingInterval: 100
}

const socket = io(APISOCKET, options)

const handleUnload = () => {
  return 'Are you sure you want to leave this page?' // Confirmation message
}

const handleBeforeUnload = (event) => {
  event.preventDefault()
  event.returnValue = '' // Required for Chrome
}

class ModalQrisPayment extends React.Component {
  componentDidMount () {
    const { payment, dispatch } = this.props
    const { paymentTransactionId } = payment
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)
    const url = `payment_transaction/${paymentTransactionId}`
    socket.on(url, () => {
      lstorage.removeDynamicQrisImage()
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalQrisPaymentType: 'success'
        }
      })
    })
  }

  componentWillUnmount () {
    const { dispatch, payment } = this.props
    const { paymentTransactionId } = payment
    const url = `payment_transaction/${paymentTransactionId}`
    socket.off(url)
    dispatch({
      type: 'payment/hidePaymentModal'
    })
    window.removeEventListener('beforeunload', handleBeforeUnload)
    window.removeEventListener('unload', handleUnload)
  }

  createPayment () {
    const {
      pos,
      payment,
      app,
      loading,
      dispatch
    } = this.props
    const {
      memberInformation,
      mechanicInformation,
      curTotalDiscount,
      curTotal,
      curRounding,
      curShift,
      curCashierNo
    } = pos
    const {
      totalPayment,
      totalChange,
      lastTransNo,
      listAmount,
      taxInfo,
      woNumber,
      companyInfo,
      paymentTransactionId
    } = payment
    const { user, setting } = app
    const curTotalPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)
    if (loading.effects['payment/create']) {
      return
    }
    const usageLoyalty = memberInformation.useLoyalty || 0
    const totalDiscount = usageLoyalty
    const curNetto = ((parseFloat(curTotal) - parseFloat(totalDiscount)) + parseFloat(curRounding)) || 0
    const paymentFiltered = listAmount ? listAmount.filter(filtered => filtered.typeCode !== 'C' && filtered.typeCode !== 'V') : []
    dispatch({
      type: 'payment/create',
      payload: {
        periode: moment().format('MMYY'),
        transDate: getDate(1),
        transDate2: getDate(3),
        transTime: setTime(),
        grandTotal: parseFloat(curTotal) + parseFloat(curTotalDiscount),
        totalPayment,
        creditCardNo: '',
        creditCardType: '',
        creditCardCharge: 0,
        curNetto,
        totalCreditCard: 0,
        transDatePrint: moment().format('DD MMM YYYY HH:mm'),
        company: localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : [],
        gender: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].gender : 'No Member',
        phone: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].phone : 'No Member',
        address: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].address01 : 'No Member',
        lastTransNo,
        lastMeter: localStorage.getItem('lastMeter') ? JSON.parse(localStorage.getItem('lastMeter')) : 0,
        // paymentVia: listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0) - (parseFloat(curTotal) + parseFloat(curRounding)) >= 0 ? 'C' : 'P',
        paymentVia: paymentFiltered && paymentFiltered[0] ? paymentFiltered[0].typeCode : 'C',
        totalChange,
        unitInfo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : {},
        totalDiscount: curTotalDiscount,
        policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : null,
        rounding: curRounding,
        memberCode: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].id : null,
        memberId: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberCode : 'No member',
        employeeName: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0].employeeName : 'No employee',
        memberName: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberName : 'No member',
        useLoyalty: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].useLoyalty : 0,
        technicianId: mechanicInformation.employeeCode,
        curShift,
        printNo: 1,
        curCashierNo,
        cashierId: user.userid,
        userName: user.username,
        taxInfo,
        setting,
        listAmount,
        companyInfo,
        curTotalPayment,
        curPayment: listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0),
        usingWo: !((woNumber === '' || woNumber === null)),
        woNumber: woNumber === '' ? null : woNumber,
        paymentTransactionId
      }
    })
  }

  render () {
    const {
      loading,
      selectedPaymentShortcut,
      acceptPayment,
      paymentFailed,
      payment,
      modalType,
      onCancel,
      ...modalProps
    } = this.props
    const {
      paymentTransactionLimitTime
    } = payment
    const qrisPaymentProps = {
      cancelQrisPayment: onCancel,
      selectedPaymentShortcut,
      paymentFailed,
      loading,
      paymentTransactionLimitTime
    }
    const qrisPaymentSuccess = {
      createPayment: () => {
        this.createPayment()
      },
      loading
    }
    const qrisPaymentFailed = {
      cancelQrisPayment: onCancel
    }
    return (
      <Modal
        closable={false}
        width="35%"
        style={{ minWidth: '600px' }}
        {...modalProps}
      >
        {modalType === 'waiting' && (
          <QrisPayment {...qrisPaymentProps} />
        )}
        {modalType === 'success' && (
          <Success {...qrisPaymentSuccess} />
        )}
        {modalType === 'failed' && (
          <Failed {...qrisPaymentFailed} />
        )}
      </Modal>
    )
  }
}

export default connect(({
  paymentOpts,
  paymentEdc,
  paymentCost,
  pos,
  payment,
  position,
  app,
  loading
}) => ({
  paymentOpts,
  paymentEdc,
  paymentCost,
  pos,
  payment,
  position,
  app,
  loading
}))(ModalQrisPayment)
