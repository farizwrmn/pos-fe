import { Button, Card, Checkbox, Col, Modal, Row } from 'antd'
import { currencyFormatter } from 'utils/string'

const checkRowKeys = ({ selectedConflictedRowKeys, id }) => {
  const filteredRow = selectedConflictedRowKeys.filter(filtered => filtered.id === id)
  if (filteredRow && filteredRow[0]) {
    return true
  }
  return false
}

const getTotalSelected = ({ selectedConflictedRowKeys }) => {
  return selectedConflictedRowKeys.reduce((prev, next) => prev + next.total, 0) || 0
}

const ConflictedList = ({
  conflictedCSV,
  selectedConflictedRowKeys,
  loading,
  onSubmit,
  dispatch
}) => {
  const onSelect = ({ id, total, isChecked }) => {
    console.log('id', id)
    if (isChecked) {
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          selectedConflictedRowKeys: selectedConflictedRowKeys.filter(filtered => filtered.id !== id)
        }
      })
      return
    }
    dispatch({
      type: 'bankentry/updateState',
      payload: {
        selectedConflictedRowKeys: selectedConflictedRowKeys.concat([{ id, total }])
      }
    })
  }

  return (
    <div>
      <div style={{ position: 'fixed', minWidth: '300px', bottom: 10, right: 0, zIndex: 2 }}>
        {selectedConflictedRowKeys && selectedConflictedRowKeys.length > 0 && (
          <div>
            <Button
              type="primary"
              loading={loading}
              disabled={loading}
              icon="check"
              onClick={() => {
                Modal.confirm({
                  title: 'Approve multiple bank recon',
                  onOk () {
                    if (selectedConflictedRowKeys && selectedConflictedRowKeys.length > 0) {
                      onSubmit({ id: selectedConflictedRowKeys.map(item => item.id) })
                    }
                  }
                })
              }}
            >{`Approve ${currencyFormatter(getTotalSelected({ selectedConflictedRowKeys }))}`}</Button>
          </div>
        )}
      </div>
      <Row style={{ zIndex: 1 }}>
        <Col md={24} lg={12}>
          {conflictedCSV && conflictedCSV.map((item) => {
            const isChecked = checkRowKeys({ selectedConflictedRowKeys, id: item.id })
            return (
              <div>
                <Card
                  title={(
                    <div>
                      <Checkbox style={{ marginRight: '10px' }} onChange={() => onSelect({ id: item.id, total: item.grossAmount, isChecked })} checked={isChecked} />
                      {`( ${item.merchantId} ) - ${item.merchantName}`}
                    </div>
                  )}
                  extra={
                    item.recon === 0 ? (
                      <Button
                        shape="circle"
                        type="primary"
                        loading={loading}
                        disabled={loading}
                        icon="check"
                        onClick={() => {
                          Modal.confirm({
                            title: 'Approve bank recon',
                            onOk () {
                              onSubmit(item)
                            }
                          })
                        }}
                      />
                    ) : null
                  }
                  style={{ marginBottom: '1em' }}
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
                      <div>{item.transDate}</div>
                    </Col>
                    <Col span={12}>
                      {item.grossAmount && item.grossAmount != null ? <div>{`( ${item.type} ) ${currencyFormatter(Number(item.grossAmount))}`}</div> : null}
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

export default ConflictedList
