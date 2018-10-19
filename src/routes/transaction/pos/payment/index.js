import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { configMain, isEmptyObject, color } from 'utils'
import {
  Form,
  // Table,
  Row,
  Col,
  Card,
  // Cascader,
  Button,
  Modal
} from 'antd'
import moment from 'moment'
import FormPayment from './Form'

const { prefix } = configMain
const FormItem = Form.Item

const Payment = ({ paymentOpts, dispatch, pos, payment, app }) => {
  const { totalPayment,
    totalChange,
    lastTransNo,
    listAmount,
    modalType,
    typeTrans,
    itemPayment,
    woNumber,
    companyInfo } = payment
  const { memberInformation,
    mechanicInformation,
    curTotalDiscount,
    curTotal,
    curRounding,
    curShift,
    curCashierNo,
    cashierInformation,
    cashierBalance } = pos
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
  const usagePoint = memberInformation.usePoint || 0
  const totalDiscount = usagePoint + curTotalDiscount
  const curNetto = ((parseFloat(curTotal) - parseFloat(totalDiscount)) + parseFloat(curRounding)) || 0
  const curTotalPayment = listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0)
  const confirmPayment = () => {
    Modal.confirm({
      title: 'Save Payment',
      content: 'are you sure ?',
      onOk () {
        const product = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
        const service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
        const workorder = localStorage.getItem('workorder') ? JSON.parse(localStorage.getItem('workorder')) : {}
        const dataPos = product.concat(service)
        let checkProductId = false
        for (let n = 0; n < dataPos.length; n += 1) {
          if (dataPos[n].productId === 0) {
            checkProductId = true
            break
          }
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
        if (service.length > 0 && (woNumber === '' || woNumber === null) && !workorder.id) {
          Modal.warning({
            title: 'Service Validation',
            content: 'You are giving service without WorkOrder'
          })
        } else if (typeTrans.toString().length === 0) {
          Modal.warning({
            title: 'Payment method',
            content: 'Your Payment method is empty'
          })
        } else {
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
              transDatePrint: moment().format('DD/MM/YYYY'),
              company: localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : [],
              gender: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].gender : 'No Member',
              phone: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].phone : 'No Member',
              address: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].address01 : 'No Member',
              lastTransNo,
              lastMeter: localStorage.getItem('lastMeter') ? JSON.parse(localStorage.getItem('lastMeter')) : 0,
              paymentVia: listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0) - (parseFloat(curTotal) + parseFloat(curRounding)) >= 0 ? 'C' : 'P',
              totalChange,
              unitInfo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')) : {},
              totalDiscount: curTotalDiscount,
              policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : null,
              rounding: curRounding,
              memberCode: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].id : null,
              memberId: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberCode : 'No member',
              employeeName: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0].employeeName : 'No mechanic',
              memberName: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberName : 'No member',
              usePoint: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].usePoint : 0,
              technicianId: mechanicInformation.employeeCode,
              curShift,
              printNo: 1,
              point: parseFloat((parseFloat(curTotal) - parseFloat(curTotalDiscount)) / 10000, 10),
              curCashierNo,
              cashierId: user.userid,
              userName: user.username,
              setting,
              listAmount,
              companyInfo,
              curNetto: parseFloat(curTotal) + parseFloat(curRounding),
              curPayment: listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0),
              usingWo: !((woNumber === '' || woNumber === null)),
              woNumber: woNumber === '' ? null : woNumber
            }
          })
          dispatch(routerRedux.push('/transaction/pos'))
        }
      },
      onCancel () {
        console.log('cancel')
      }
    })
  }

  // const printPreview = () => {
  //   dispatch({
  //     type: 'payment/printPayment',
  //     payload: {
  //       periode: moment().format('MMYY'),
  //       transDate: getDate(1),
  //       transDate2: getDate(3),
  //       transTime: setTime(),
  //       transDatePrint: moment().format('DD/MM/YYYY'),
  //       grandTotal: parseInt(curTotal, 10),
  //       totalPayment,
  //       company: localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)) : [],
  //       gender: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].gender : 'No Member',
  //       phone: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].phone : 'No Member',
  //       address: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].address01 : 'No Member',
  //       lastMeter: localStorage.getItem('lastMeter') ? JSON.parse(localStorage.getItem('lastMeter')) : 0,
  //       lastTransNo: localStorage.getItem('transNo') ? localStorage.getItem('transNo') : 'Please Insert TransNo',
  //       totalChange,
  //       totalDiscount: curTotalDiscount,
  //       policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : '-----',
  //       rounding: curRounding,
  //       dataPos: localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : [],
  //       dataService: localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : [],
  //       memberCode: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].id : 'No Member',
  //       memberId: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberCode : 'No member',
  //       memberName: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberName : 'No member',
  //       mechanicName: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0].mechanicName : 'No mechanic',
  //       technicianId: mechanicInformation.mechanicCode,
  //       curShift,
  //       printNo: 1,
  //       point: parseInt((parseInt(curTotal, 10) - parseInt(curTotalDiscount, 10)) / 10000, 10),
  //       curCashierNo,
  //       cashierId: user.userid,
  //       userName: user.username,
  //       listAmount,
  //       curNetto: parseFloat(curTotal) + parseFloat(curRounding),
  //       curPayment: listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0),
  //       woNumber
  //     }
  //   })
  // }

  const cancelPayment = () => {
    dispatch(routerRedux.push('/transaction/pos'))
  }

  const formPaymentProps = {
    listAmount,
    modalType,
    memberInformation,
    item: itemPayment,
    curTotal,
    curTotalDiscount,
    curRounding,
    totalPayment,
    totalChange,
    cashierInformation,
    cashierBalance,
    onSubmit (data) {
      dispatch({
        type: 'payment/addMethod',
        payload: {
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
      {listOpts.length > 0 && <div>
        <Row style={{ marginBottom: 16 }}>
          <Col span={24}>
            <FormPayment options={listOpts} {...formPaymentProps} />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form layout="vertical">
              <FormItem>
                <Button type="primary" size="large" onEnter={cancelPayment} onClick={cancelPayment} className="margin-right" width="100%" > Back To Transaction Detail </Button>
              </FormItem>
              <FormItem>
                <Button type="primary" size="large" onEnter={confirmPayment} onClick={confirmPayment} className="margin-right" width="100%" > Confirm Payment </Button>
              </FormItem>
            </Form>
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

export default connect(({ paymentOpts, pos, payment, position, app }) => ({ paymentOpts, pos, payment, position, app }))(Payment)
