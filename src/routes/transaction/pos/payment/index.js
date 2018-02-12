import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import config from 'config'
import { routerRedux } from 'dva/router'
import {
  Form,
  // Table,
  Row, Col,
  // Card,
  // Cascader,
  Button,
  Modal
} from 'antd'
import moment from 'moment'
// import ModalCredit from './ModalCreditCard'
import FormPayment from './Form'
// import PaymentMethod from './PaymentMethod'

const { prefix } = config
const FormItem = Form.Item
// const dataTrans = () => {
//   let product = localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans'))
//   let service = localStorage.getItem('service_detail') === null ? [] : JSON.parse(localStorage.getItem('service_detail'))
//   const cashier_trans = product.concat(service)
//   let arrayProd = []
//   for (let n = 0; n < cashier_trans.length; n += 1) {
//     arrayProd.push({
//       no: n + 1,
//       code: cashier_trans[n].code,
//       disc1: cashier_trans[n].disc1,
//       disc2: cashier_trans[n].disc2,
//       disc3: cashier_trans[n].disc3,
//       discount: cashier_trans[n].discount,
//       name: cashier_trans[n].name,
//       price: cashier_trans[n].price,
//       qty: cashier_trans[n].qty,
//       typeCode: cashier_trans[n].typeCode,
//       total: cashier_trans[n].total
//     })
//   }
//   return (arrayProd)
// }

const Payment = ({ paymentOpts, dispatch, pos, payment, app }) => {
  const { totalPayment,
    totalChange,
    // inputPayment,
    lastTransNo,
    listAmount,
    // creditCardTotal,
    // creditCharge,
    // modalCreditVisible,
    modalType,
    typeTrans,
    itemPayment,
    woNumber } = payment
  const { memberInformation, mechanicInformation, curTotalDiscount, curTotal, curRounding, curShift, curCashierNo } = pos
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

  // const modalCreditProps = {
  //   visible: modalCreditVisible,
  //   maskClosable: false,
  //   wrapClassName: 'vertical-center-modal',
  //   onCancel () {
  //     dispatch({
  //       type: 'payment/hideCreditModal'
  //     })
  //   }
  // }

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

  // const onChange = (e) => {
  //   const { value } = e.target
  //   const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
  //   if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
  //     dispatch({
  //       type: 'payment/changePayment',
  //       payload: {
  //         netto: parseInt(curTotal, 10) + parseInt(curRounding, 10),
  //         totalPayment: value
  //       }
  //     })
  //   }
  // }

  // const onChangeCascader = (e) => {
  //   dispatch({
  //     type: 'payment/changeCascader',
  //     payload: {
  //       value: e
  //     }
  //   })
  // }
  const confirmPayment = () => {
    const product = localStorage.getItem('cashier_trans') ? JSON.parse(localStorage.getItem('cashier_trans')) : []
    const service = localStorage.getItem('service_detail') ? JSON.parse(localStorage.getItem('service_detail')) : []
    const dataPos = product.concat(service)
    let checkProductId = false
    for (let n = 0; n < dataPos.length; n += 1) {
      if (dataPos[n].productId === 0) {
        checkProductId = true
        break
      }
    }
    if ((parseInt(memberInformation.memberPendingPayment, 10) ? false : listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0) < parseInt(curTotal, 10) + parseInt(curRounding, 10)) || listAmount.length === 0) {
      Modal.error({
        title: 'Payment',
        content: 'Total Payment must be greater than Netto'
      })
    } else if (checkProductId) {
      console.log(checkProductId)
      Modal.error({
        title: 'Payment',
        content: 'Something Wrong with Product'
      })
    } else if (service.length > 0 && (woNumber === '' || woNumber === null)) {
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
          grandTotal: parseInt(curTotal, 10) + parseInt(curTotalDiscount, 10),
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
          paymentVia: typeTrans.toString(),
          totalChange,
          totalDiscount: curTotalDiscount,
          policeNo: localStorage.getItem('memberUnit') ? JSON.parse(localStorage.getItem('memberUnit')).policeNo : null,
          rounding: curRounding,
          memberCode: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].id : 'No Member',
          memberId: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberCode : 'No member',
          mechanicName: localStorage.getItem('mechanic') ? JSON.parse(localStorage.getItem('mechanic'))[0].mechanicName : 'No mechanic',
          memberName: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].memberName : 'No member',
          technicianId: mechanicInformation.mechanicCode,
          curShift,
          printNo: 1,
          point: parseInt((parseInt(curTotal, 10) - parseInt(curTotalDiscount, 10)) / 10000, 10),
          curCashierNo,
          cashierId: user.userid,
          userName: user.username,
          setting,
          listAmount,
          curNetto: parseFloat(curTotal) + parseFloat(curRounding),
          curPayment: listAmount.reduce((cnt, o) => cnt + parseFloat(o.amount), 0),
          usingWo: !((woNumber === '' || woNumber === null)),
          woNumber: woNumber === '' ? null : woNumber
        }
      })
      dispatch({ type: 'pos/setAllNull' })
      dispatch(routerRedux.push('/transaction/pos'))
    }
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

  // let options = []
  // if (listOpts ? listOpts.length > 0 : false) {
  //   for (let key in listOpts) {
  //     if (Object.prototype.hasOwnProperty.call(listOpts, key)) {
  //       options.push({
  //         value: listOpts[key].typeCode,
  //         label: listOpts[key].typeName
  //       })
  //     }
  //   }
  // } else {
  //   options = [
  //     {
  //       value: 'C',
  //       label: 'Cash'
  //     },
  //     {
  //       value: 'K',
  //       label: 'Credit Card'
  //     },
  //     {
  //       value: 'D',
  //       label: 'Debit Card'
  //     },
  //     {
  //       value: 'P',
  //       label: 'Pending'
  //     }
  //   ]
  // }

  // const handleCreditCard = () => {
  //   console.log('input credit card')
  //   dispatch({
  //     type: 'payment/setCashPaymentNull'
  //   })

  //   dispatch({
  //     type: 'payment/listCreditCharge'
  //   })

  //   dispatch({
  //     type: 'payment/showCreditModal'
  //   })
  // }

  // const handleKeyDown = (e) => {
  //   if (e.keyCode in keyShortcut) {
  //     keyShortcut[e.keyCode] = true

  //     if (keyShortcut[17] && keyShortcut[32]) {
  //       keyShortcut[17] = false
  //       keyShortcut[32] = false
  //       handleCreditCard()
  //     }
  //   }
  // }

  const formPaymentProps = {
    listAmount,
    modalType,
    item: itemPayment,
    curTotal,
    curTotalDiscount,
    curRounding,
    totalPayment,
    totalChange,
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
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          {/* <Card bordered={false} title="Payment" bodyStyle={{ padding: 0 }}> */}
          <FormPayment options={listOpts} {...formPaymentProps} />
          {/* <Form layout="horizontal">
              <FormItem>
                <Input
                  size="large"
                  style={{ fontSize: 24 }}
                  value={inputPayment}
                  onKeyDown={e => handleKeyDown(e)}
                  onChange={e => onChange(e)}
                  placeholder="Input Payment Amount Here"
                />
                <Cascader showSearch
                  options={options}
                  onChange={_value => onChangeCascader(_value)}
                  placeholder="Please select"
                  defaultValue={[typeTrans]}
                />
              </FormItem>
              {modalCreditVisible && <ModalCredit {...modalCreditProps} />}
            </Form> */}
          {/* </Card> */}
        </Col>
      </Row>
      <Row style={{ marginBottom: 16 }}>
        <Col xl={24} lg={24}>
          {/* <PaymentMethod autoFocus options={listOpts} /> */}
          {/* <Card noHovering bordered={false} title="Point Information" bodyStyle={{ padding: 0 }}>
            <Input value={localStorage.getItem('transNo') ? localStorage.getItem('transNo') : null} />
            <Table
              rowKey={(record, key) => key}
              bordered
              scroll={{ x: 1000 }}
              columns={[
                {
                  title: 'No',
                  dataIndex: 'no'
                },
                {
                  title: 'Code',
                  dataIndex: 'code'
                },
                {
                  title: 'Product Name',
                  dataIndex: 'name'
                },
                {
                  title: 'Qty',
                  dataIndex: 'qty'
                },
                {
                  title: 'Price',
                  dataIndex: 'price'
                },
                {
                  title: 'Disc 1(%)',
                  dataIndex: 'disc1'
                },
                {
                  title: 'Disc 2(%)',
                  dataIndex: 'disc2'
                },
                {
                  title: 'Disc 3(%)',
                  dataIndex: 'disc3'
                },
                {
                  title: 'Discount',
                  dataIndex: 'discount'
                },
                {
                  title: 'Total',
                  dataIndex: 'total'
                }
              ]}
              dataSource={dataTrans()}
              pagination={false}
              style={{ marginBottom: 4, marginLeft: 4, marginRight: 4, marginTop: 4 }}
            />
          </Card> */}
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form layout="vertical">
            {/* <FormItem>
              <Button size="large" onEnter={printPreview} onClick={printPreview} className="margin-right" width="100%" > Print Preview </Button>
            </FormItem> */}
            <FormItem>
              <Button type="primary" size="large" onEnter={cancelPayment} onClick={cancelPayment} className="margin-right" width="100%" > Back To Transaction Detail </Button>
            </FormItem>
            <FormItem>
              <Button type="primary" size="large" onEnter={confirmPayment} onClick={confirmPayment} className="margin-right" width="100%" > Confirm Payment </Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
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
