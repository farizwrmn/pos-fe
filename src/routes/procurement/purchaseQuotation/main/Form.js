import React from 'react'
import PropTypes from 'prop-types'
import { Form, Collapse, Row, Col, Spin } from 'antd'
import { Link } from 'dva/router'

const { Panel } = Collapse

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormCounter = ({
  listTrans,
  listSupplier,
  onGetDataSupplier,
  loading
}) => {
  const onGetSupplier = (value) => {
    if (value) {
      onGetDataSupplier(value)
    }
  }

  return (
    <Form layout="horizontal">
      <Row>
        <Col {...column}>
          {listTrans && listTrans.length > 0 ? (
            <Collapse accordion onChange={onGetSupplier}>
              {listTrans.map(item => (
                <Panel header={`${item.transNo} Total: Rp ${item.total.toLocaleString()} Count: ${item.countProduct}`} key={item.id}>
                  {listSupplier && !loading.effects['purchaseQuotation/querySupplierCount'] ? listSupplier.map((supplier) => {
                    return (
                      <div>
                        <div><Link to={`/transaction/procurement/quotation/${item.id}?supplierId=${supplier.id}`}>{`${supplier.supplierName} Total: Rp ${supplier.total.toLocaleString()} Count: ${supplier.countSupplier} ${supplier.hasRFQ ? '(RFQ)' : ''}`}</Link></div>
                      </div>
                    )
                  }) : <Spin />}
                </Panel>
              ))}
            </Collapse>
          ) : <div>No Transaction. To create new <Link to="/transaction/procurement/requisition">click here</Link></div>}
        </Col>
      </Row>
    </Form>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default Form.create()(FormCounter)
