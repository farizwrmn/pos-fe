import { Button, Card, Col, Icon, Modal, Row, message } from 'antd'
import moment from 'moment'
import { getName } from 'utils/link'
import { currencyFormatter } from 'utils/string'
import ModalCanceled from './ModalCanceled'

const cardContentColumnProps = {
  xs: 24,
  sm: 24,
  md: 11,
  lg: 11,
  xl: 11
}

const parentContentColumnProps = {
  xs: 24,
  sm: 24,
  md: 16,
  lg: 16,
  xl: 16
}

const FormConflicted = ({
  location,
  dispatch,
  canceledModalVisible,
  canceledReconciledPayment,
  selectedCsvRowKeys,
  selectedPaymentRowKeys,
  conflictedCSV,
  conflictedPayment,
  loading,
  conflictModalVisible,
  insertPaymentConflict,
  handleModal
}) => {
  const selectedPayment = conflictedPayment.filter((filtered) => {
    const isChecked = selectedPaymentRowKeys.find(record => record.transactionId === filtered.transactionId)
    if (isChecked) {
      return true
    }
    return false
  })

  const selectedCsv = conflictedCSV.filter((filtered) => {
    const isChecked = selectedCsvRowKeys.find(record => record.id === filtered.id)
    if (isChecked) {
      return true
    }
    return false
  })

  const PaymentItem = () => {
    return (
      <Col {...cardContentColumnProps}>
        {selectedPayment && selectedPayment[0] ? selectedPayment.map((record) => {
          return (
            <Card
              style={{ margin: '10px 10px 0 10px', minHeight: '120px' }}
              title={getName(record.transactionType)}
            >
              <Row>
                <Col span={12}>
                  Trans No
                </Col>
                <Col span={12}>
                  {record.transNo}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  {`${record.transDate}, ${record.transTime}`}
                </Col>
                <Col span={12}>
                  {record.debit && record.debit != null ? <div>{`(DB) ${currencyFormatter(Number(record.debit))}`}</div> : null}
                  {record.credit && record.credit != null ? <div>{`(CR) ${currencyFormatter(Number(record.credit))}`}</div> : null}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  Description
                </Col>
                <Col span={12}>
                  {record.description}
                </Col>
              </Row>
            </Card>
          )
        }) : (
          <Card style={{ margin: '10px 10px 0 10px', minHeight: '120px' }}>
            No Payment Selected
          </Card>
        )}
      </Col>
    )
  }

  const PaymentImportItem = () => {
    return (
      <Col {...cardContentColumnProps}>
        {selectedCsv && selectedCsv[0] ? selectedCsv.map((record) => {
          return (
            <Card
              style={{ margin: '10px 10px 0 10px', minHeight: '120px' }}
              title={`( ${record.approvalCode} ) - ${record.merchantName}`}
            >
              <Row>
                <Col span={12}>
                  EDC Batch Number
                </Col>
                <Col span={12}>
                  {record.edcBatchNumber}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  {`${moment(record.transDate).format('DD MMM YYYY')}, ${record.transTime}`}
                </Col>
                <Col span={12}>
                  {`( ${record.recordSource} )( ${record.type} ) ${currencyFormatter(record.grossAmount || 0)}`}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  MDR Amount
                </Col>
                <Col span={12}>
                  {currencyFormatter(record.mdrAmount || 0)}
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  Redeem Amount
                </Col>
                <Col span={12}>
                  {currencyFormatter(record.redeemAmount || 0)}
                </Col>
              </Row>
            </Card>
          )
        }) : (
          <Card style={{ margin: '10px 10px 0 10px', minHeight: '120px' }}>
            No Payment Import Selected
          </Card>
        )}
      </Col>
    )
  }

  const handleSubmit = () => {
    if (!selectedCsvRowKeys[0] || !selectedPaymentRowKeys[0]) {
      message.error('You should select from both side.')
      return false
    }
    handleModal()
  }

  const handleModalCanceled = () => {
    dispatch({
      type: 'autorecon/updateState',
      payload: {
        canceledModalVisible: !canceledModalVisible
      }
    })
  }

  const modalCanceledProps = {
    loading,
    visible: canceledModalVisible,
    title: 'Canceled Reconciled Payment List',
    list: canceledReconciledPayment,
    onCancel: handleModalCanceled,
    ackPayment: (id) => {
      dispatch({
        type: 'autorecon/ackPayment',
        payload: {
          id,
          location
        }
      })
    }
  }

  return (
    <Col {...parentContentColumnProps}>
      <Modal
        title="Mark this payment as conflict?"
        width={1000}
        onOk={insertPaymentConflict}
        visible={conflictModalVisible}
        onCancel={handleModal}
        confirmLoading={loading.effects['autorecon/add']}
      >
        <Row type="flex" align="middle">
          <PaymentItem />
          <Col span={2} style={{ alignSelf: 'center', textAlign: 'center' }}>
            <Icon type="swap" style={{ fontSize: '24px' }} />
          </Col>
          <PaymentImportItem />
        </Row>
      </Modal>
      <Row>
        <Row style={{ marginBottom: '15px', marginTop: '15px' }}>
          {conflictedCSV && conflictedPayment && (conflictedCSV.length > 0 || conflictedPayment > 0) && (
            <Button
              type="primary"
              size="default"
              icon="rollback"
              onClick={() => handleSubmit()}
              disabled={!selectedCsvRowKeys[0] || !selectedPaymentRowKeys[0]}
              loading={loading.effects['autorecon/add'] || loading.effects['autorecon/autoRecon']}
            >
              Mark as Conflicted
            </Button>
          )
          }
          {canceledReconciledPayment && canceledReconciledPayment.length > 0 && (
            <Button
              type="ghost"
              size="default"
              icon="exclamation-circle-o"
              onClick={handleModalCanceled}
              style={{ marginLeft: '10px' }}
            >
              Canceled Reconciled Payment
            </Button>
          )}
        </Row>
      </Row>
      {canceledModalVisible && (
        <ModalCanceled {...modalCanceledProps} />
      )}
    </Col>
  )
}

export default FormConflicted
