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

  const onEDCVoidInputChange = (itemSelection, value) => {
    const updatedItem = listSetoran.find(item => item.type === itemSelection.type)

    const newItem = {
      type: itemSelection.type,
      status: itemSelection.type === 'EDC' ? 'A' : 'C',
      amount: value
    }

    const updatedList = updatedItem ?
      listSetoran.map(item => (item.type === updatedItem.type ? newItem : item)) :
      [...listSetoran, newItem]

    dispatch({
      type: 'posSetoran/updateState',
      payload: {
        list: updatedList
      }
    })
  }

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
  const ListEdc = () => {
    // let amountEDC = listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'A')
    //   .reduce((cnt, o) => cnt + parseFloat(o.total || 0), 0)
    let item = listSetoran && listSetoran.find(item => item.status === 'A')
    let edcAmount = item && item.edcAmount ? item.edcAmount : 0

    return (
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
                  })(<InputNumber disabled min={0} onChange={value => onEDCVoidInputChange({ type: 'EDC' }, value)} />)}
                </FormItem>
              </div>
            )}
          />
          <Column
            title="TOTAL"
            dataIndex="edcTotal"
            key="edcTotal"
            render={(text, column) => (
              <div style={{ textAlign: 'center' }}>
                <FormItem hasFeedback>
                  {getFieldDecorator('edcAmount', {
                    initialValue: currencyFormatterSetoran(column.edcTotal)
                  })(<InputNumber disabled min={0} onChange={value => onEDCVoidInputChange({ type: 'EDC' }, value)} />)}
                </FormItem>
              </div>
            )}
          />
        </Table>

        {/* <Row style={{ padding: '1em' }}>
          <Col span={18} style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold' }}>Subtotal</p>
          </Col>
          <Col span={6}>
            <p style={{ fontWeight: 'bold' }}>
              {listSetoran && listSetoran.length > 0 && currencyFormatterSetoran(amountEDC)}
            </p>
          </Col>
        </Row> */}
      </div>
    )
  }

  const ListVoid = () => {
    // let amountVoid = listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'C')
    //   .reduce((cnt, o) => cnt + parseFloat(o.total || 0), 0)
    let item = listSetoran && listSetoran.find(item => item.status === 'C')
    let voidAmount = item && item.voidAmount ? item.voidAmount : 0
    return (
      <div>
        <h3 style={{ fontWeight: 'bold' }}>Struk Void / Cancel</h3>

        <Table {...listVoidProps}>
          <Column
            title="JUMLAH LEMBAR"
            dataIndex="qty"
            key="qty"
            render={() => (
              <div style={{ textAlign: 'center' }}>
                <FormItem hasFeedback>
                  {getFieldDecorator('voidAmount', {
                    initialValue: voidAmount
                  })(<InputNumber disabled min={0} onChange={value => onEDCVoidInputChange({ type: 'VOID' }, value)} />)}
                </FormItem>
              </div>
            )}
          />
          <Column
            title="TOTAL"
            dataIndex="voidTotal"
            key="voidTotal"
            render={(text, column) => (
              <div style={{ textAlign: 'center' }}>
                <FormItem hasFeedback>
                  {getFieldDecorator('voidTotal', {
                    initialValue: currencyFormatterSetoran(column.voidTotal)
                  })(<InputNumber disabled min={0} onChange={value => onEDCVoidInputChange({ type: 'EDC' }, value)} />)}
                </FormItem>
              </div>
            )}
          />
        </Table>

        {/* <Row style={{ padding: '1em' }}>
          <Col span={18} style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold' }}>Subtotal</p>
          </Col>
          <Col span={6}>
            <p style={{ fontWeight: 'bold' }}>
              {listSetoran && listSetoran.length > 0 && currencyFormatterSetoran(amountVoid)}
            </p>
          </Col>
        </Row> */}
      </div>
    )
  }

  return (
    <Row>
      <Col {...column}>
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
              {list && list.length > 0 && currencyFormatterSetoran(list.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0))}
            </p>
          </Col>
        </Row>
      </Col>
      <Col {...column}>
        <Row>
          <Col>
            <ListEdc />
          </Col>
          <Col>
            <ListVoid />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}


export default Form.create()(ConfirmationDialog)
