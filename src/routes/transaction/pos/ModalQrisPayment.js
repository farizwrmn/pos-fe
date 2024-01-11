import { Modal } from 'antd'
import React from 'react'
import { connect } from 'dva'
import { lstorage } from 'utils'
import { APISOCKET } from 'utils/config.company'
import io from 'socket.io-client'
import QrisPayment from './qrisPayment'
import Success from './qrisPayment/Success'
import Failed from './qrisPayment/Failed'
import ModalCancel from './qrisPayment/ModalCancel'

const {
  getDynamicQrisPosTransId,
  // getDynamicQrisPosTransNo,
  removeCurrentPaymentTransactionId
} = lstorage

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

    const url = `payment_transaction/${paymentTransactionId}`
    socket.on(url, () => {
      const posId = getDynamicQrisPosTransId()
      // const transNo = getDynamicQrisPosTransNo()
      dispatch({
        type: 'pos/updateState',
        payload: {
          modalQrisPaymentType: 'success'
        }
      })
      dispatch({
        type: 'pos/resetPosLocalStorage'
      })
      removeCurrentPaymentTransactionId()
      const invoiceWindow = window.open(`/transaction/pos/invoice/${posId}`)
      dispatch({
        type: 'payment/updateState',
        payload: {
          paymentTransactionInvoiceWindow: invoiceWindow
        }
      })

      // dispatch({
      //   type: 'payment/queryPosDirectPrinting',
      //   payload: {
      //     storeId: lstorage.getCurrentUserStore(),
      //     transNo
      //   }
      // })
      invoiceWindow.focus()
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

  keydown (event, ctrlKeyDown) {
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
      modalCancelQrisPaymentVisible,
      qrisPaymentCurrentTransNo
    } = pos
    const {
      paymentTransactionLimitTime,
      paymentTransactionId,
      paymentTransactionInvoiceWindow
    } = payment
    const qrisPaymentProps = {
      cancelQrisPayment: onCancel,
      selectedPaymentShortcut,
      paymentFailed,
      loading,
      paymentTransactionId,
      paymentTransactionLimitTime,
      refreshPayment: () => {
        dispatch({
          type: 'pos/refreshDynamicQrisPayment',
          payload: {
            paymentTransactionId
          }
        })
      }
    }
    const qrisPaymentSuccess = {
      createPayment: () => {
        if (paymentTransactionInvoiceWindow) {
          paymentTransactionInvoiceWindow.focus()
        }
      },
      CloseModal: () => {
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
      cancelQrisPayment: () => {
        dispatch({
          type: 'pos/updateState',
          payload: {
            modalQrisPaymentVisible: false,
            modalQrisPaymentType: 'waiting'
          }
        })
        dispatch({
          type: 'payment/updateState',
          payload: {
            paymentTransactionId: null
          }
        })
      }
    }
    const modalCancelProps = {
      loading,
      visible: modalCancelQrisPaymentVisible,
      maskClosable: false,
      invoiceCancel: qrisPaymentCurrentTransNo,
      title: 'Cancel the Transaction?',
      confirmLoading: loading.effects['payment/cancelDynamicQrisPayment'],
      wrapClassName: 'vertical-center-modal',
      onOk (data) {
        dispatch({
          type: 'payment/cancelDynamicQrisPayment',
          payload: {
            paymentTransactionId,
            pos: {
              transNo: qrisPaymentCurrentTransNo,
              memo: `Canceled Dynamic Qris Payment - Canceled By Cashier - ${data.memo}`,
              transactionMemo: data.memo
            }
          }
        })
      },
      onCancel () {
        dispatch({
          type: 'pos/updateState',
          payload: {
            modalCancelQrisPaymentVisible: false
          }
        })
      }
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
        {modalCancelQrisPaymentVisible && (
          <ModalCancel {...modalCancelProps} />
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
