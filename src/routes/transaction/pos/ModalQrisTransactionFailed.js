import { Button, Modal, Table } from 'antd'
import moment from 'moment'
import React from 'react'
import { currencyFormatter } from 'utils/string'
import ModalCancelDynamicQrisTransaction from './ModalCancelDynamicQrisTransaction'

class ModalQrisTransactionFailed extends React.Component {
  state = {
    modalCancelVisible: false,
    qrisPaymentCurrentTransNo: null,
    paymentTransactionId: null
  }

  render () {
    const { dispatch, loading, list, onClose, ...modalProps } = this.props
    const { modalCancelVisible, qrisPaymentCurrentTransNo, paymentTransactionId } = this.state
    const tableProps = {
      dataSource: list
    }

    const handleVoid = ({ paymentTransactionId, transNo }) => {
      this.setState({
        modalCancelVisible: true,
        qrisPaymentCurrentTransNo: transNo,
        paymentTransactionId
      })
    }

    const columns = [
      {
        title: 'Invoice Number',
        dataIndex: 'transNo',
        key: 'transNo'
      },
      {
        title: 'Tanggal Transaksi',
        dataIndex: 'transDate',
        key: 'transDate',
        render: (value, record) => {
          console.log('record.transTime', record.transTime)
          return (
            <div>{`${moment(value).format('DD MMM YYYY')}, ${moment(record.transTime, 'HH:mm:ss').format('HH:mm:ss')}`}</div>
          )
        }
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: value => currencyFormatter(value)
      }, {
        title: 'Action',
        render: (value, record) => {
          const paymentTransactionId = record.paymentTransactionId
          const transNo = record.transNo
          return (
            <div style={{ textAlign: 'center' }}>
              <Button
                type="danger"
                onClick={() => handleVoid({ paymentTransactionId, transNo })}
                disabled={loading.effects['payment/cancelDynamicQrisPayment']}
                loading={loading.effects['payment/cancelDynamicQrisPayment']}
              >
                Void
              </Button>
            </div>
          )
        }
      }
    ]

    const handleModalCancel = () => {
      this.setState({
        modalCancelVisible: !modalCancelVisible
      })
    }

    const modalCancelProps = {
      loading,
      visible: modalCancelVisible,
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
        handleModalCancel()
      },
      onCancel () {
        handleModalCancel()
      }
    }

    return (
      <Modal
        {...modalProps}
        footer={[
          <Button
            type="primary"
            onClick={onClose}
            loading={loading.effects['payment/cancelDynamicQrisPayment']}
            disabled={loading.effects['payment/cancelDynamicQrisPayment']}
          >
            Close
          </Button>
        ]}
      >
        <Table
          {...tableProps}
          columns={columns}
          bordered
        />
        {modalCancelVisible && <ModalCancelDynamicQrisTransaction {...modalCancelProps} />}
      </Modal>
    )
  }
}

export default ModalQrisTransactionFailed
