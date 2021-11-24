import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
// import { routerRedux } from 'dva/router'
import { configMain, lstorage } from 'utils'
import {
  Row,
  Col,
  Modal,
  message
} from 'antd'
import moment from 'moment'
import FormPayment from './Form'

const { getCashierTrans } = lstorage
const { prefix } = configMain

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
    typeTrans,
    itemPayment,
    paymentModalVisible,
    woNumber,
    companyInfo } = payment
  const {
    listPayment: listEdc
  } = paymentEdc
  const {
    listPayment: listCost
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
    cashierInformation,
    selectedPaymentShortcut,
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

  const usageLoyalty = memberInformation.useLoyalty || 0
  const totalDiscount = usageLoyalty
  const curNetto = ((parseFloat(curTotal) - parseFloat(totalDiscount)) + parseFloat(curRounding)) || 0
  const curTotalPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)
  const confirmPayment = (taxInfo) => {
    Modal.confirm({
      title: 'Save Payment',
      content: 'are you sure ?',
      onOk () {
        const product = getCashierTrans()
        const service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
        // const workorder = localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')) : {}
        const dataPos = product.concat(service)
        let checkProductId = false
        for (let n = 0; n < dataPos.length; n += 1) {
          if (dataPos[n].productId === 0) {
            checkProductId = true
            break
          }
        }
        if (!memberInformation || JSON.stringify(memberInformation) === '{}') {
          const modal = Modal.warning({
            title: 'Warning',
            content: 'Member Not Found...!'
          })
          setTimeout(() => modal.destroy(), 1000)
          return
        }
        if ((memberInformation.memberPendingPayment === '1' ? false : curTotalPayment < curNetto)) {
          Modal.error({
            title: 'Payment pending restricted',
            content: 'This member type cannot allow to pending'
          })
          return
        }
        if (checkProductId) {
          console.log(checkProductId)
          Modal.error({
            title: 'Payment',
            content: 'Something Wrong with Product'
          })
          return
        }
        if (typeTrans.toString().length === 0) {
          Modal.warning({
            title: 'Payment method',
            content: 'Your Payment method is empty'
          })
        } else {
          const paymentFiltered = listAmount ? listAmount.filter(filtered => filtered.typeCode !== 'C') : []
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
              curNetto: parseFloat(curTotal) + parseFloat(curRounding),
              curPayment: listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0),
              usingWo: !((woNumber === '' || woNumber === null)),
              woNumber: woNumber === '' ? null : woNumber
            }
          })
          // dispatch(routerRedux.push('/transaction/pos'))
        }
      },
      onCancel () {
        console.log('cancel')
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
        listPayment: []
      }
    })
    dispatch({
      type: 'paymentEdc/query',
      payload: {
        paymentOption,
        storeId: lstorage.getCurrentUserStore()
      }
    })
  }

  const onGetCost = (machineId) => {
    dispatch({
      type: 'paymentCost/updateState',
      payload: {
        listPayment: []
      }
    })
    dispatch({
      type: 'paymentCost/query',
      payload: {
        machineId,
        relationship: 1
      }
    })
  }

  const onResetMachine = () => {
    dispatch({
      type: 'paymentEdc/updateState',
      payload: {
        listPayment: []
      }
    })
    dispatch({
      type: 'paymentCost/updateState',
      payload: {
        listPayment: []
      }
    })
  }

  const formPaymentProps = {
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
    cashierInformation,
    cashierBalance,
    listEdc,
    listCost,
    onGetMachine,
    onGetCost,
    onResetMachine,
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
      onResetMachine()
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

  return (
    <div className="content-inner">
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
