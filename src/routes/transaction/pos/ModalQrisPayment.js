import { Modal } from 'antd'
import React from 'react'
import { connect } from 'dva'
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

const handleUnload = (event) => {
  if (event) {
    event.preventDefault()
  }
  return 'Are you sure you want to leave this page?'
}

const handleBeforeUnload = (event) => {
  event.preventDefault()
  const confirmationMessage = 'Are you sure you want to leave this page?'
  event.returnValue = confirmationMessage
  return confirmationMessage
}

class ModalQrisPayment extends React.Component {
  state = {
    ctrlKeyDown: false
  }

  componentDidMount () {
    const { payment, dispatch } = this.props
    const { paymentTransactionId } = payment
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    window.addEventListener('keydown', event => this.keydown(event, this.state.ctrlKeyDown))
    window.addEventListener('keyup', event => this.keyup(event))

    const url = `payment_dev_pos_1/${paymentTransactionId}`
    socket.on(url, () => {
      lstorage.removeDynamicQrisImage()
      this.createPayment()
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
    const url = `payment_dev_pos_1/${paymentTransactionId}`
    socket.off(url)
    dispatch({
      type: 'payment/hidePaymentModal'
    })
    window.removeEventListener('beforeunload', handleBeforeUnload)
    window.removeEventListener('unload', handleUnload)
  }

  keydown (event, ctrlKeyDown) {
    console.log('event.keyCode', event.keyCode, ctrlKeyDown)
    if ((event.which || event.keyCode) === 116 || ((event.which || event.keyCode) === 82 && ctrlKeyDown)) {
      // Pressing F5 or Ctrl+R
      event.preventDefault()
    } else if ((event.which || event.keyCode) === 17 || (event.which || event.keyCode) === 91) {
      // Pressing  only Ctrl
      this.setState({ ctrlKeyDown: true })
    }
  }

  keyup (event) {
    // Key up Ctrl
    if ((event.which || event.keyCode) === 17 || (event.which || event.keyCode) === 91) {
      this.setState({ ctrlKeyDown: false })
    }
  }

  render () {
    const {
      dispatch,
      loading,
      selectedPaymentShortcut,
      acceptPayment,
      paymentFailed,
      payment,
      modalType,
      onCancel,
      pos,
      app,
      ...modalProps
    } = this.props
    const {
      paymentTransactionLimitTime,
      paymentTransactionId
    } = payment
    const qrisPaymentProps = {
      cancelQrisPayment: onCancel,
      selectedPaymentShortcut,
      paymentFailed,
      loading,
      paymentTransactionLimitTime,
      refreshPayment: () => {
        dispatch({
          type: 'pos/refreshDynamicQrisPayment',
          payload: {
            paymentTransactionId,
            getDate,
            setTime,
            pos,
            payment,
            app
          }
        })
      }
    }
    const qrisPaymentSuccess = {
      createPayment: () => {
        dispatch({
          type: 'pos/updateState',
          payload: {
            modalQrisPaymentVisible: false,
            modalQrisPaymentType: 'waiting'
          }
        })
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
