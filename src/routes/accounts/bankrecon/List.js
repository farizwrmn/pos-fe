import React from 'react'
import PropTypes from 'prop-types'
import {
  currencyFormatter
} from 'utils/string'
import { Row, Col, Card, Button, Modal } from 'antd'

const List = ({
  loading,
  summaryBankRecon,
  listBankRecon,
  onSubmit
}) => {
  return (
    <div>
      <Row>
        <Col md={24} lg={12}>
          {summaryBankRecon && summaryBankRecon[0] && (
            <div>
              <Card
                title="Journal"
                style={{ marginBottom: '1em' }}
              >
                <div>
                  {`Saldo: ${currencyFormatter(summaryBankRecon[0].amount)}`}
                </div>
              </Card>
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={24} lg={12}>
          {listBankRecon && listBankRecon.map((item) => {
            return (
              <div>
                <Card
                  title={item.transactionType}
                  extra={
                    item.recon === 0 ? (
                      <Button
                        shape="circle"
                        type="primary"
                        loading={loading.effects['bankentry/updateBankRecon']}
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
                      <div>{item.transDate}</div>
                    </Col>
                    <Col span={12}>
                      {item.debit && <div>{`(DB) ${currencyFormatter(item.debit)}`}</div>}
                      {item.credit && <div>{`(CR) ${currencyFormatter(item.credit)}`}</div>}
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
