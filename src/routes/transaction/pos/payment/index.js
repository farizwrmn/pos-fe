import React from 'react'
import PropTypes from 'prop-types'
import { DataTable } from 'components'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Form, Input, Table, Row, Col, Card, Select, Button, Popconfirm, Modal } from 'antd'
import { Link } from 'dva/router'
import ModalCredit from './ModalCreditCard'
import moment from 'moment'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
}
const dataTrans = () => {
  return (localStorage.getItem('cashier_trans') === null ? [] : JSON.parse(localStorage.getItem('cashier_trans')))
}

const Payment = ({ location, loading, dispatch, pos, payment, app }) => {
  const { grandTotal, netto, totalPayment, totalChange, inputPayment, lastTransNo, creditCardNo, creditCardBank, creditCardType, creditCardTotal, creditCharge, modalCreditVisible, policeNo } = payment
  const { memberInformation, mechanicInformation, curTotalDiscount, curTotal, curRounding, curShift, curCashierNo, lastMeter} = pos
  const { user } = app
  //Tambah Kode Ascii untuk shortcut baru di bawah (hanya untuk yang menggunakan kombinasi seperti Ctrl + M)
  var keyShortcut = { 17: false, 16: false, 32: false }
  /*
   Ascii => Desc
   17 => Ctrl
   16 => Shift
   32 => Space
   */

  const modalCreditProps = {
    visible: modalCreditVisible,
    maskClosable: false,
    wrapClassName: 'vertical-center-modal',
    onCancel () {
      dispatch({
        type: 'payment/hideCreditModal',
      })
    },
  }

  const getDate = (mode) => {
    var today = new Date()
    var dd = today.getDate()
    var mm = today.getMonth()+1 //January is 0!
    var yyyy = today.getFullYear()

    if(dd<10) {
      dd='0'+dd
    }

    if(mm<10) {
      mm='0'+mm
    }

    if ( mode == 1 ) {
      today = dd+mm+yyyy
    }
    else if ( mode == 2 ) {
      today = mm+yyyy
    }
    else if ( mode == 3 ) {
      today = yyyy + '-' + mm + '-' + dd
    }

    return today
  }

  const setTime = () => {
    var today = new Date()
    var h = today.getHours()
    var m = today.getMinutes()
    var s = today.getSeconds()
    m = checkTime(m)
    s = checkTime(s)

    return h + ":" + m + ":" + s
  }

  const checkTime = (i) => {
    if (i < 10) {i = "0" + i}  // add zero in front of numbers < 10
    return i
  }

  const onChange = (e) => {
    const {value} = e.target
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      dispatch({
        type: 'payment/changePayment',
        payload: {
          netto: parseInt(curTotal) + parseInt(curRounding),
          totalPayment: value,
        },
      })
    }
  }

  const confirmPayment = () => {
    if ( (parseInt(totalPayment) < parseInt(curTotal) + parseInt(curRounding)) ) {
      Modal.error({
        title: 'Payment',
        content: 'Total Payment must be greater than Netto...!',
      })
    }
    else {
      dispatch({
        type: 'payment/create',
        payload: { periode: moment().format('MMYY'),
          transDate: getDate(1),
          transDate2: getDate(3),
          transTime: setTime(),
          grandTotal: parseInt(curTotal) + parseInt(curTotalDiscount),
          totalPayment: totalPayment,
          creditCardNo: '',
          creditCardType: '',
          creditCardCharge: 0,
          totalCreditCard: 0,
          lastMeter: lastMeter,
          totalChange: totalChange,
          totalDiscount: curTotalDiscount,
          policeNo: localStorage.getItem('memberUnit') ? localStorage.getItem('memberUnit') : '-----',
          rounding: curRounding,
          memberCode: localStorage.getItem('member') ? JSON.parse(localStorage.getItem('member'))[0].id : 'No Member',
          technicianId: mechanicInformation.mechanicCode,
          curShift: curShift,
          point: parseInt((parseInt(curTotal) - parseInt(curTotalDiscount))/10000),
          curCashierNo: curCashierNo,
          cashierId: user.userid
        }
      })
      dispatch({ type: 'pos/setAllNull' })
      dispatch(routerRedux.push('/transaction/pos'))
    }

  }

  const cancelPayment = () => {
    dispatch(routerRedux.push('/transaction/pos'))
  }

  const handleCreditCard = () => {
    console.log('input credit card')
    dispatch({
      type: 'payment/setCashPaymentNull',
    })

    dispatch({
      type: 'payment/listCreditCharge',
    })

    dispatch({
      type: 'payment/showCreditModal',
    })
  }

  const handleKeyDown = (e) => {
    const { value } = e.target

    if (e.keyCode in keyShortcut) {
      keyShortcut[e.keyCode] = true

      if (keyShortcut[17] && keyShortcut[32]) {
        keyShortcut[17] = false
        keyShortcut[32] = false
        handleCreditCard()
      }
    }
  }

  return (
    <div className="content-inner">
      <Row style={{ marginBottom: 16 }}>
        <Card bordered={false} title="Payment" bodyStyle={{ padding: 0 }}>
          <Form layout="horizontal">
            <FormItem>
              <Input size="large" autoFocus={true} style={{ fontSize: 24 }} value={inputPayment} onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => onChange(e)} placeholder="Input Payment Amount Here"/>
            </FormItem>
            {modalCreditVisible && <ModalCredit {...modalCreditProps} />}
          </Form>
        </Card>
      </Row>

      <Row style={{ marginBottom: 16 }} gutter={16}>
        <Col span={16}>
          <Card bordered={false} title="Point Information" bodyStyle={{ padding: 0 }}>
          <Table
            rowKey={(record, key) => key}
            bordered
            scroll={{ x: 1500 }}
            columns={[
              {
                title: 'No',
                dataIndex: 'no',
                width: 20,
              },
              {
                title: 'Code',
                dataIndex: 'code',
                width: 100,
              },
              {
                title: 'Product Name',
                dataIndex: 'name',
                width: 200,
              },
              {
                title: 'Qty',
                dataIndex: 'qty',
                width: 50,
              },
              {
                title: 'Price',
                dataIndex: 'price',
                width: 100,
              },
              {
                title: 'Disc 1(%)',
                dataIndex: 'disc1',
                width: 100,
              },
              {
                title: 'Disc 2(%)',
                dataIndex: 'disc2',
                width: 100,
              },
              {
                title: 'Disc 3(%)',
                dataIndex: 'disc3',
                width: 100,
              },
              {
                title: 'Discount',
                dataIndex: 'discount',
                width: 100,
              },
              {
                title: 'Total',
                dataIndex: 'total',
                width: 100,
              },
            ]}
            dataSource={dataTrans()}
            pagination={false}
            style={{ marginBottom: 4, marginLeft: 4, marginRight: 4, marginTop: 4 }}
          />
          </Card>
        </Col>
        <Col span={8}>
          <Form layout="horizontal">
            <FormItem style={{ fontSize: '20px' }} label="Grand Total" {...formItemLayout}>
              <Input value={parseInt(curTotal) + parseInt(curTotalDiscount)} defaultValue="0" style={{height: '40px', fontSize: '20pt'}} size="large" disabled />
            </FormItem>
            <FormItem style={{ fontSize: '20px' }} label="Discount" {...formItemLayout}>
              <Input value={curTotalDiscount} defaultValue="0" style={{height: '40px', fontSize: '20pt'}}  size="large" disabled />
            </FormItem>
            <FormItem style={{ fontSize: '20px' }} label="Rounding" {...formItemLayout}>
              <Input value={curRounding} defaultValue="0" style={{height: '40px', fontSize: '20pt'}} size="large" disabled />
            </FormItem>
            <FormItem style={{ fontSize: '20px' }} label="Credit Card" {...formItemLayout}>
              <Input value={creditCardTotal} defaultValue="0" style={{height: '40px', fontSize: '20pt'}} size="large" disabled />
            </FormItem>
            <FormItem style={{ fontSize: '20px' }} label="Credit Card Charge" {...formItemLayout}>
              <Input value={creditCharge} defaultValue="0" style={{height: '40px', fontSize: '20pt'}} size="large" disabled />
            </FormItem>
            <FormItem style={{ fontSize: '20px' }} label="Netto" {...formItemLayout}>
              <Input value={parseInt(curTotal) + parseInt(curRounding)} style={{height: '40px', fontSize: '20pt'}} size="large" disabled />
            </FormItem>
            <FormItem style={{ fontSize: '20px' }} label="Total Cash" {...formItemLayout}>
              <Input value={totalPayment} style={{height: '40px', fontSize: '20pt'}} size="large" disabled />
            </FormItem>
            <FormItem style={{ fontSize: '20px' }} label="Change" {...formItemLayout}>
              <Input value={totalChange} style={{height: '40px', fontSize: '20pt'}} size="large" disabled />
            </FormItem>
          </Form>
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
    </div>
  )
}

Payment.propTypes = {
  pos: PropTypes.object,
  app: PropTypes.object,
  position: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
  payment: PropTypes.object,
}

export default connect(({ pos, payment, position, app, loading }) => ({ pos, payment, position, app, loading }))(Payment)
