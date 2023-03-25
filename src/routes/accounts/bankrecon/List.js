import React from 'react'
import PropTypes from 'prop-types'
import {
  currencyFormatter
} from 'utils/string'
import { Row, Col, Card, Button, Modal, Checkbox } from 'antd'
import { getName, getLink } from 'utils/link'

const checkRowKeys = (selectedRowKeys, id) => {
  const filteredRow = selectedRowKeys.filter(filtered => filtered.id === id)
  if (filteredRow && filteredRow[0]) {
    return true
  }
  return false
}

const getTotalSelected = (selectedRowKeys) => {
  return selectedRowKeys.reduce((prev, next) => prev + next.total, 0) || 0
}

const List = ({
  loading,
  selectedRowKeys,
  summaryBankRecon,
  listBankRecon,
  dispatch,
  onSubmit
}) => {
  const onSelect = (id, total, isChecked) => {
    if (isChecked) {
      dispatch({
        type: 'bankentry/updateState',
        payload: {
          selectedRowKeys: selectedRowKeys.filter(filtered => filtered.id !== id)
        }
      })
      return
    }
    dispatch({
      type: 'bankentry/updateState',
      payload: {
        selectedRowKeys: selectedRowKeys.concat([{ id, total }])
      }
    })
  }

  return (
    <div>
      {listBankRecon && listBankRecon[0] && (
        <div
          style={{
            padding: '10px',
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          TIDAK ADA DI CSV
        </div>
      )}
      <div style={{ position: 'fixed', minWidth: '300px', bottom: 10, zIndex: 2 }}>
        {selectedRowKeys && selectedRowKeys.length > 0 && (
          <div>
            <Button
              type="primary"
              loading={loading.effects['bankentry/updateBankRecon']}
              disabled={loading.effects['bankentry/updateBankRecon']}
              icon="check"
              onClick={() => {
                Modal.confirm({
                  title: 'Approve multiple bank recon',
                  onOk () {
                    if (selectedRowKeys && selectedRowKeys.length > 0) {
                      onSubmit({ id: selectedRowKeys.map(item => item.id) })
                    }
                  }
                })
              }}
            >{`Approve ${currencyFormatter(getTotalSelected(selectedRowKeys))}`}</Button>
          </div>
        )}
      </div>
      <Row style={{ zIndex: 1 }}>
        <Col md={24} lg={12}>
          {summaryBankRecon && summaryBankRecon[0] && (
            <div>
              <Card
                title="Journal"
                style={{ marginBottom: '1em' }}
              >
                <div>
                  {`Balance: ${currencyFormatter(summaryBankRecon[0].amount)}`}
                </div>
              </Card>
            </div>
          )}
        </Col>
      </Row>
      <Row style={{ zIndex: 1 }}>
        <Col md={24} lg={12}>
          {listBankRecon && listBankRecon.map((item) => {
            const isChecked = checkRowKeys(selectedRowKeys, item.id)
            return (
              <div>
                <Card
                  title={(
                    <div>
                      <Checkbox style={{ marginRight: '10px' }} onChange={() => onSelect(item.id, ((item.debit || 0) - (item.credit || 0)), isChecked)} checked={isChecked} />
                      <a target="__blank" onClick={() => getLink(dispatch, { transactionType: item.transactionType, transactionId: item.transactionId })}>
                        {getName(item.transactionType)}
                      </a>
                    </div>
                  )}
                  extra={
                    item.recon === 0 ? (
                      <Button
                        shape="circle"
                        type="primary"
                        loading={loading.effects['bankentry/updateBankRecon']}
                        disabled={loading.effects['bankentry/updateBankRecon']}
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

List.propTypes = {
  summaryBankRecon: PropTypes.array.isRequired,
  listBankRecon: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default List
