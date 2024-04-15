import React from 'react'
import { Form, Table, InputNumber, Row, Col } from 'antd'
import { currencyFormatterSetoran } from 'utils/string'

const FormItem = Form.Item
const Column = Table.Column

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const ConfirmationDialog = ({
  dispatch,
  list = [],
  listSetoran = [],
  setCashValue,
  form: {
    // getFieldsValue,
    getFieldDecorator
  }
}) => {
  const onChangeInput = (itemSelection, value) => {
    let currentList = list && list.length > 0 && list.map((item) => {
      if (item.name === itemSelection.name && item.type === itemSelection.type) {
        return {
          ...item,
          physicalMoneyId: itemSelection.id,
          qty: value,
          amount: itemSelection.value * value
        }
      }
      return item
    })

    dispatch({
      type: 'physicalMoney/updateState',
      payload: {
        list: currentList
      }
    })
    let amount = currentList && currentList.length > 0 && currentList.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0)
    setCashValue(amount)
  }

  const filterList = list.filter(fitlered => !!fitlered.amount)
  const tableProps = {
    pagination: false,
    defaultExpandAllRows: true,
    dataSource: filterList
  }

  const defaultList = [{ total: 0, qty: 0 }]
  const filterListEdc = listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'A')
  const filterListVoid = listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'C')
  const listEdc = filterListEdc && filterListEdc.length > 0 ? filterListEdc : defaultList
  const listVoid = filterListVoid && filterListVoid.length > 0 ? filterListVoid : defaultList

  const listEdcProps = {
    pagination: false,
    defaultExpandAllRows: true,
    dataSource: listEdc
  }

  const listVoidProps = {
    pagination: false,
    defaultExpandAllRows: true,
    dataSource: listVoid
  }

  let itemA = listSetoran && listSetoran.find(item => item.status === 'A')
  let edcAmount = itemA && itemA.edcAmount ? itemA.edcAmount : 0
  let edcTotal = itemA && itemA.edcTotal ? itemA.edcTotal : 0
  let itemB = listSetoran && listSetoran.find(item => item.status === 'C')
  let voidAmount = itemB && itemB.voidAmount ? itemB.voidAmount : 0
  let voidTotal = itemB && itemB.voidTotal ? itemB.voidTotal : 0
  let subtotalValue = (list || [])
    .filter(filtered => typeof filtered.amount === 'number' && !isNaN(filtered.amount))
    .reduce((cnt, o) => cnt + parseFloat(o.amount), 0)

  return (
    <Row>
      <Col {...column} style={{ paddingRight: '1em' }}>
        <h3 style={{ fontWeight: 'bold' }}>SETORAN UANG TUNAI</h3>
        <Table {...tableProps}>
          <Column
            title="JUMLAH LEMBAR"
            dataIndex="JUMLAH_LEMBAR"
            key="JUMLAH_LEMBAR"
            render={(text, column) => (
              <div style={{ textAlign: 'center' }}>
                {column && column.qty ? (
                  <FormItem hasFeedback>
                    {getFieldDecorator(`${column.name}-${column.type}`, {
                      initialValue: column && column.qty ? column.qty : 0
                    })(<InputNumber disabled min={0} onChange={value => onChangeInput(column, value)} />)}
                  </FormItem>
                ) : null}
              </div>
            )}
          />
          <Column
            title="LEMBAR"
            dataIndex="LEMBAR"
            key="LEMBAR"
            render={(text, column) => (
              <div>
                {column.type ? (
                  <p>{column.type}</p>
                ) : null}
              </div>
            )}
          />
          <Column
            title="PECAHAN"
            dataIndex="name"
            key="name"
            render={(text, column) => (
              <div style={{ textAlign: 'center' }}>
                {column.name ? (
                  <p>{column.name}</p>
                ) : null}
              </div>
            )}
          />
          <Column
            title="TOTAL"
            dataIndex="amount"
            key="amount"
            render={(text, column) => (
              <div style={{ textAlign: 'center' }}>
                {column.amount ? (
                  <p>{column.amount ? currencyFormatterSetoran(column.amount) : 0}</p>
                ) : null}
              </div>
            )}
          />
        </Table>
        <Row style={{ padding: '1em' }}>
          <Col span={4} />
          <Col span={16}>
            <p style={{ fontWeight: 'bold' }}>Subtotal</p>
          </Col>
          <Col span={4}>
            <p style={{ fontWeight: 'bold' }}>
              {currencyFormatterSetoran(subtotalValue)}
            </p>
          </Col>
        </Row>
      </Col>
      <Col {...column} style={{ paddingLeft: '1em' }}>
        <Row>
          <Col>
            {/* <ListEdc {...listEdcProps} /> */}
            <div>
              <h3 style={{ fontWeight: 'bold' }}>Struk EDC (Kartu Kredit, Kartu Debit, QRIS APOS BCA)</h3>
              <Table {...listEdcProps}>
                <Column
                  title="JUMLAH LEMBAR"
                  dataIndex="edcAmount"
                  key="edcAmount"
                  render={() => (
                    <div style={{ textAlign: 'center' }}>
                      <FormItem hasFeedback>
                        {getFieldDecorator('edcAmount', {
                          initialValue: edcAmount
                        })(<InputNumber disabled style={{ width: 200 }} min={0} />)}
                      </FormItem>
                    </div>
                  )}
                />
                <Column
                  title="TOTAL"
                  dataIndex="edcTotal"
                  key="edcTotal"
                  render={() => (
                    <div style={{ textAlign: 'center' }}>
                      <FormItem hasFeedback>
                        {getFieldDecorator('edcTotal', {
                          initialValue: edcTotal
                        })(<InputNumber
                          disabled
                          style={{ width: 200 }}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          min={0}
                        // onChange={value => updateSetoran({ key: 'A', type: 'edcTotal' }, value)}
                        />)}
                      </FormItem>
                    </div>
                  )}
                />
              </Table>
              {/* <Column
                      title="TOTAL"
                      dataIndex="total"
                      key="total"
                      render={(text, column) => (
                        <div style={{ textAlign: 'center' }}>
                          <p>{currencyFormatterSetoran(column.total)}</p>
                        </div>
                      )}
                    /> */}
              <Row style={{ padding: '1em' }}>
                <Col span={18} style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 'bold' }}>Subtotal</p>
                </Col>
                <Col span={6}>
                  <p style={{ fontWeight: 'bold' }}>
                    {listSetoran && listSetoran.length > 0 && currencyFormatterSetoran(edcTotal)}
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col>
            {/* <ListVoid {...listVoidProps} /> */}
            <div>
              <h3 style={{ fontWeight: 'bold' }}>Struk Void / Cancel</h3>
              <Table {...listVoidProps}>
                <Column
                  title="JUMLAH LEMBAR"
                  dataIndex="voidAmount"
                  key="voidAmount"
                  render={() => (
                    <div style={{ textAlign: 'center' }}>
                      <FormItem hasFeedback>
                        {getFieldDecorator('voidAmount', {
                          initialValue: voidAmount
                        })(<InputNumber disabled style={{ width: 200 }} min={0} />)}
                      </FormItem>
                    </div>
                  )}
                />
                <Column
                  title="TOTAL"
                  dataIndex="voidTotal"
                  key="voidTotal"
                  render={() => (
                    <div style={{ textAlign: 'center' }}>
                      <FormItem hasFeedback>
                        {getFieldDecorator('voidTotal', {
                          initialValue: voidTotal
                        })(<InputNumber
                          disabled
                          style={{ width: 200 }}
                          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                          parser={value => value.replace(/\$\s?|(,*)/g, '')}
                          min={0}
                        />)}
                      </FormItem>
                    </div>
                  )}
                />
              </Table>
              {/* <Column
                    title="TOTAL"
                    dataIndex="total"
                    key="total"
                    render={(text, column) => (
                      <div style={{ textAlign: 'center' }}>
                        <p>{currencyFormatterSetoran(column.total)}</p>
                      </div>
                    )}
                  /> */}
              <Row style={{ padding: '1em' }}>
                <Col span={18} style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 'bold' }}>Subtotal</p>
                </Col>
                <Col span={6}>
                  <p style={{ fontWeight: 'bold' }}>
                    {listSetoran && listSetoran.length > 0 && currencyFormatterSetoran(voidTotal)}
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}


export default Form.create()(ConfirmationDialog)
