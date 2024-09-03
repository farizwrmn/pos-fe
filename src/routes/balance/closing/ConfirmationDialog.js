import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col } from 'antd'
import { currencyFormatterSetoran } from 'utils/string'

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '1em'
}

const thStyle = {
  borderBottom: '1px solid #ddd',
  padding: '8px',
  textAlign: 'center',
  backgroundColor: '#f4f4f4',
  fontWeight: 'bold'
}

const tdStyle = {
  borderBottom: '1px solid #ddd',
  padding: '8px',
  textAlign: 'center'
}

const inputStyle = {
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
  borderRadius: '4px',
  border: '1px solid #ddd',
  outline: 'none',
  textAlign: 'center'
}

const subtotalStyle = {
  padding: '8px',
  fontWeight: 'bold',
  textAlign: 'center'
}

const ConfirmationDialog = ({
  list = [],
  listSetoran = [],
  form: {
    getFieldDecorator
  }
}) => {
  const filterList = list.filter(fitlered => !!fitlered.amount)

  const defaultList = [{ total: 0, qty: 0 }]
  const filterListEdc = (listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'A')) || []
  const filterListVoid = (listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'C')) || []
  const filterListGrab = (listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'G')) || []
  const listEdc = filterListEdc && filterListEdc.length > 0 ? filterListEdc : defaultList
  const listVoid = filterListVoid && filterListVoid.length > 0 ? filterListVoid : defaultList
  const listGrab = filterListGrab && filterListGrab.length > 0 ? filterListGrab : defaultList

  let itemA = (listSetoran && listSetoran.find(item => item.status === 'A')) || {}
  let edcAmount = itemA && itemA.edcAmount ? itemA.edcAmount : 0
  let edcTotal = itemA && itemA.edcTotal ? itemA.edcTotal : 0
  let itemB = (listSetoran && listSetoran.find(item => item.status === 'C')) || {}
  let voidAmount = itemB && itemB.voidAmount ? itemB.voidAmount : 0
  let voidTotal = itemB && itemB.voidTotal ? itemB.voidTotal : 0
  let itemC = (listSetoran && listSetoran.find(item => item.status === 'G')) || {}
  let grabAmount = itemC && itemC.grabAmount ? itemC.grabAmount : 0
  let subtotalValue = (list || [])
    .filter(filtered => typeof filtered.amount === 'number' && !isNaN(filtered.amount))
    .reduce((cnt, o) => cnt + parseFloat(o.amount), 0)

  return (
    <Row>
      <Col {...column} style={{ paddingRight: '1em' }}>
        <h3 style={{ fontWeight: 'bold' }}>SETORAN UANG TUNAI</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>JUMLAH LEMBAR</th>
              <th style={thStyle}>LEMBAR</th>
              <th style={thStyle}>PECAHAN</th>
              <th style={thStyle}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {filterList.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>
                  {getFieldDecorator(`${item.name}-${item.type}`, {
                    initialValue: item.qty != null ? item.qty : 0
                  })(<input type="number" disabled style={inputStyle} min={0} />)}
                </td>
                <td style={tdStyle}>{item.type}</td>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>{item.amount != null ? currencyFormatterSetoran(item.amount) : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Row style={{ padding: '1em' }}>
          <Col span={18} style={subtotalStyle}>
            <p>Subtotal</p>
          </Col>
          <Col span={6} style={subtotalStyle}>
            <p>{currencyFormatterSetoran(subtotalValue)}</p>
          </Col>
        </Row>
      </Col>
      <Col {...column} style={{ paddingLeft: '1em' }}>
        <Row>
          <Col>
            <div>
              <h3 style={{ fontWeight: 'bold' }}>Struk EDC (Kartu Kredit, Kartu Debit, QRIS APOS BCA, BNI)</h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>JUMLAH LEMBAR</th>
                    <th style={thStyle}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {listEdc.map((item, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>
                        {getFieldDecorator('edcAmount', {
                          initialValue: edcAmount
                        })(<input type="number" disabled style={inputStyle} min={0} />)}
                      </td>
                      <td style={tdStyle}>
                        {getFieldDecorator('edcTotal', {
                          initialValue: edcTotal
                        })(<input
                          type="number"
                          disabled
                          style={inputStyle}
                          value={currencyFormatterSetoran(edcTotal)}
                          min={0}
                        />)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Row style={{ padding: '1em' }}>
                <Col span={18} style={subtotalStyle}>
                  <p>Subtotal</p>
                </Col>
                <Col span={6} style={subtotalStyle}>
                  <p>{currencyFormatterSetoran(edcTotal)}</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col>
            <div>
              <h3 style={{ fontWeight: 'bold' }}>Struk Void / Cancel</h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>JUMLAH LEMBAR</th>
                    <th style={thStyle}>TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  {listVoid.map((item, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>
                        {getFieldDecorator('voidAmount', {
                          initialValue: voidAmount
                        })(<input type="number" disabled style={inputStyle} min={0} />)}
                      </td>
                      <td style={tdStyle}>
                        {getFieldDecorator('voidTotal', {
                          initialValue: voidTotal
                        })(<input
                          type="number"
                          disabled
                          style={inputStyle}
                          value={currencyFormatterSetoran(voidTotal)}
                          min={0}
                        />)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Row style={{ padding: '1em' }}>
                <Col span={18} style={subtotalStyle}>
                  <p>Subtotal</p>
                </Col>
                <Col span={6} style={subtotalStyle}>
                  <p>{currencyFormatterSetoran(voidTotal)}</p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Col>
      <Col>
        <div>
          <h3 style={{ fontWeight: 'bold' }}>Struk Grabmart</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>JUMLAH LEMBAR</th>
              </tr>
            </thead>
            <tbody>
              {listGrab.map((item, index) => (
                <tr key={index}>
                  <td style={tdStyle}>
                    {getFieldDecorator('grabAmount', {
                      initialValue: grabAmount
                    })(<input type="number" disabled style={inputStyle} min={0} />)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Col>
    </Row>
  )
}
ConfirmationDialog.propTypes = {
  list: PropTypes.array,
  listSetoran: PropTypes.array
}

export default Form.create()(ConfirmationDialog)
