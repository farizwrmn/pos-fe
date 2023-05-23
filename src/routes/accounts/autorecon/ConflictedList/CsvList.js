import { Card, Checkbox, Col, Row } from 'antd'
import moment from 'moment'
import { currencyFormatter } from 'utils/string'

const checkRowKeys = (selectedRowKeys, id) => {
  const filteredRow = selectedRowKeys.filter(filtered => filtered.id === id)
  if (filteredRow && filteredRow[0]) {
    return true
  }
  return false
}

const CsvList = ({
  conflictedCSV,
  selectedCsvRowKeys,
  dispatch
}) => {
  const onSelect = (id, isChecked) => {
    if (isChecked) {
      dispatch({
        type: 'autorecon/updateState',
        payload: {
          selectedCsvRowKeys: selectedCsvRowKeys.filter(filtered => filtered.id !== id)
        }
      })
      return
    }
    dispatch({
      type: 'autorecon/updateState',
      payload: {
        selectedCsvRowKeys: selectedCsvRowKeys.concat([{ id }])
      }
    })
  }

  return (
    <div>
      {conflictedCSV && conflictedCSV[0] && (
        <div
          style={{
            padding: '10px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          TIDAK ADA PADA AKUN INI
        </div>
      )}
      <Row style={{ zIndex: 1 }}>
        <Col md={24} lg={16}>
          {conflictedCSV && conflictedCSV.map((item) => {
            const isChecked = checkRowKeys(selectedCsvRowKeys, item.id)
            return (
              <div style={{ marginBottom: '10px' }}>
                <Card
                  title={(
                    <div>
                      <Checkbox style={{ marginRight: '10px' }} onChange={() => onSelect(item.id, isChecked)} checked={isChecked} />
                      {`( ${item.approvalCode} ) - ${item.merchantName}`}
                    </div>
                  )}
                >
                  <Row>
                    <Col span={12}>
                      <div>EDC Batch Number:</div>
                    </Col>
                    <Col span={12}>
                      {item.edcBatchNumber}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <div>{`${moment(item.transDate).format('DD MMMM YYYY')}, ${item.transTime}`}</div>
                    </Col>
                    <Col span={12}>
                      {item.grossAmount && item.grossAmount != null ? <div>{`( ${item.recordSource} )( ${item.type} ) ${currencyFormatter(Number(item.grossAmount))}`}</div> : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <div>MDR Amount:</div>
                    </Col>
                    <Col span={12}>
                      {item.mdrAmount && item.mdrAmount != null ? <div>{`${currencyFormatter(Number(item.mdrAmount))}`}</div> : null}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <div>Redeem Amount:</div>
                    </Col>
                    <Col span={12}>
                      {item.redeemAmount && item.redeemAmount != null ? <div>{`${currencyFormatter(Number(item.redeemAmount))}`}</div> : currencyFormatter(0)}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <div>Reason:</div>
                    </Col>
                    <Col span={12}>
                      {item.reason}
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

export default CsvList
