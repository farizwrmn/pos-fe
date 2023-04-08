import { Card, Checkbox, Col, Row } from 'antd'
import { getName } from 'utils/link'
import { currencyFormatter } from 'utils/string'

const checkRowKeys = (selectedRowKeys, transactionId) => {
  const filteredRow = selectedRowKeys.filter(filtered => filtered.transactionId === transactionId)
  if (filteredRow && filteredRow[0]) {
    return true
  }
  return false
}

const PaymentList = ({
  selectedPaymentRowKeys,
  conflictedPayment,
  dispatch
}) => {
  const onSelect = (transactionId, isChecked) => {
    if (isChecked) {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          selectedPaymentRowKeys: selectedPaymentRowKeys.filter(filtered => filtered.transactionId !== transactionId)
        }
      })
      return
    }
    dispatch({
      type: 'autorecon/updateState',
      payload: {
        selectedPaymentRowKeys: [{ transactionId }]
      }
    })
  }

  return (
    <div>
      {conflictedPayment && conflictedPayment[0] && (
        <div
          style={{
            padding: '10px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          TIDAK ADA PADA CSV
        </div>
      )}
      <Row style={{ zIndex: 1 }}>
        <Col md={24} lg={16}>
          {conflictedPayment && conflictedPayment.map((item) => {
            const isChecked = checkRowKeys(selectedPaymentRowKeys, item.transactionId)
            return (
              <div>
                <Card
                  title={(
                    <div>
                      <Checkbox style={{ marginRight: '10px' }} onChange={() => onSelect(item.transactionId, isChecked)} checked={isChecked} />
                      {getName(item.transactionType)}
                    </div>
                  )}
                  style={{ marginBottom: '1em' }}
                >
                  <Row>
                    <Col span={12}>
                      <div>Trans No:</div>
                    </Col>
                    <Col span={12}>
                      {item.transNo}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <div>{`${item.transDate}, ${item.transTime}`}</div>
                    </Col>
                    <Col span={12}>
                      {item.debit && item.debit != null ? <div>{`(DB) ${currencyFormatter(Number(item.debit))}`}</div> : null}
                      {item.credit && item.credit != null ? <div>{`(CR) ${currencyFormatter(Number(item.credit))}`}</div> : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <div>Description:</div>
                    </Col>
                    <Col span={12}>
                      {item.description}
                    </Col>
                  </Row>
                </Card>
              </div>
            )
          })}
        </Col>
        <Col md={24} lg={12} />
      </Row>
    </div>
  )
}

export default PaymentList
