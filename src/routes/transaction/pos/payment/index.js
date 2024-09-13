import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { lstorage } from 'utils'
// import { routerRedux } from 'dva/router'
import { prefix } from 'utils/config.main'
import {
  Row,
  Col,
  message
} from 'antd'
import moment from 'moment'
import FormPayment from './Form'
import ModalPaymentConfirm from './ModalPaymentConfirm'

const Payment = ({
  paymentOpts,
  paymentEdc,
  paymentCost,
  loading,
  dispatch,
  pos,
  payment,
  app
}) => {
  const { totalPayment,
    totalChange,
    lastTransNo,
    listAmount,
    modalType,
    itemPayment,
    paymentModalVisible,
    modalPaymentConfirmVisible,
    taxInfo,
    woNumber,
    companyInfo } = payment
  const {
    paymentLov: listAllEdc,
    paymentLovFiltered: listEdc
  } = paymentEdc
  const {
    paymentLov: listAllCost,
    paymentLovFiltered: listCost
  } = paymentCost
  const { memberInformation,
    mechanicInformation,
    curTotalDiscount,
    curTotal,
    dineInTax,
    typePembelian,
    curRounding,
    curShift,
    curCashierNo,
    selectedPaymentShortcut,
    currentBundlePayment,
    currentGrabOrder,
    cashierBalance } = pos
  const { user, setting } = app
  const { listOpts } = paymentOpts
  // Tambah Kode Ascii untuk shortcut baru di bawah (hanya untuk yang menggunakan kombinasi seperti Ctrl + M)
  // const keyShortcut = { 17: false, 16: false, 32: false }
  /*
   Ascii => Desc
   17 => Ctrl
   16 => Shift
   32 => Space
   */

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

  const currentExpressOrder = lstorage.getExpressOrder()

  const confirmPayment = (taxInfo) => {
    dispatch({
      type: 'payment/updateState',
      payload: {
        taxInfo,
        modalPaymentConfirmVisible: true
      }
    })
  }

  const cancelPayment = () => {
    // dispatch(routerRedux.push('/transaction/pos'))
    dispatch({
      type: 'payment/hidePaymentModal'
    })
  }

  const onGetMachine = (paymentOption) => {
    dispatch({
      type: 'paymentEdc/updateState',
      payload: {
        paymentLovFiltered: listAllEdc.filter(filtered => filtered.paymentOption === paymentOption)
      }
    })
  }

  const onGetCost = (machineId) => {
    dispatch({
      type: 'paymentCost/updateState',
      payload: {
        paymentLovFiltered: listAllCost.filter(filtered => filtered.machineId === machineId)
      }
    })
  }

  const formPaymentProps = {
    currentExpressOrder,
    currentGrabOrder,
    currentBundlePayment,
    selectedPaymentShortcut,
    confirmPayment,
    cancelPayment,
    loading,
    listAmount,
    modalType,
    memberInformation,
    item: itemPayment,
    paymentModalVisible,
    curTotal,
    dineInTax,
    typePembelian,
    curTotalDiscount,
    curRounding,
    totalPayment,
    totalChange,
    cashierBalance,
    listEdc,
    listCost,
    dispatch,
    listAllEdc,
    listAllCost,
    onSubmit (data) {
      if (data.typeCode === 'V') {
        message.error('Cannot add voucher from this form')
        return
      }
      dispatch({
        type: 'payment/addMethod',
        payload: {
          listAmount,
          data
        }
      })
    },
    onEdit (data) {
      dispatch({
        type: 'payment/editMethod',
        payload: {
          data,
          modalType: 'add',
          itemPayment: {}
        }
      })
    },
    cancelEdit () {
      dispatch({
        type: 'payment/updateState',
        payload: {
          modalType: 'add',
          itemPayment: {}
        }
      })
    },
    editItem (data) {
      if (data && data.typeCode) {
        onGetMachine(data.typeCode)
        onGetCost(data.machine)
      }
      dispatch({
        type: 'payment/updateState',
        payload: {
          itemPayment: data,
          modalType: 'edit'
        }
      })
    }
  }

  const usageLoyalty = memberInformation.useLoyalty || 0
  const totalDiscount = usageLoyalty
  const curNetto = ((parseFloat(curTotal) - parseFloat(totalDiscount)) + parseFloat(curRounding)) || 0
  const curTotalPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)

  const modalConfirm = {
    visible: modalPaymentConfirmVisible && !loading.effects['payment/create'],
    loading,
    onOk () {
      dispatch({ type: 'payment/updateState', payload: { modalPaymentConfirmVisible: false, taxInfo: {} } })
      if (loading.effects['payment/create']) {
        return
      }
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
          woNumber: woNumber === '' ? null : woNumber
        }
      })
    },
    onCancel () {
      dispatch({ type: 'payment/updateState', payload: { modalPaymentConfirmVisible: false, taxInfo: {} } })
    }
  }

  return (
    <div className="content-inner">
      {modalPaymentConfirmVisible && !loading.effects['payment/create'] && <ModalPaymentConfirm {...modalConfirm} />}
      {listOpts.length > 0 && <div>
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <FormPayment options={listOpts} {...formPaymentProps} />
          </Col>
        </Row>
      </div>}
    </div>
  )
}

Payment.propTypes = {
  pos: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  payment: PropTypes.object.isRequired,
  paymentOpts: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
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
}))(Payment)
