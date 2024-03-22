import React from 'react'
import { Form, Table, InputNumber, Row, Col } from 'antd'
import { currencyFormatter } from 'utils/string'

const FormItem = Form.Item
const Column = Table.Column

const column = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const FormComponent = ({
  dispatch,
  list = [],
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

  const tableProps = {
    pagination: false,
    defaultExpandAllRows: true,
    dataSource: list
  }

  return (
    <Row>
      <Col {...column}>
        <Table {...tableProps}>
          <Column
            title="JUMLAH LEMBAR"
            dataIndex="JUMLAH_LEMBAR"
            key="JUMLAH_LEMBAR"
            render={(text, column) => (
              <div style={{ textAlign: 'right' }}>
                <FormItem hasFeedback>
                  {getFieldDecorator(`${column.name}-${column.type}`, {
                    initialValue: column && column.qty ? column.qty : 0
                  })(<InputNumber min={0} onChange={value => onChangeInput(column, value)} />)}
                </FormItem>
              </div>
            )}
          />
          <Column
            title="LEMBAR"
            dataIndex="LEMBAR"
            key="LEMBAR"
            render={(text, column) => (
              <div>
                <p>{column.type}</p>
              </div>
            )}
          />
          <Column
            title="PECAHAN"
            dataIndex="name"
            key="name"
            render={(text, column) => (
              <div>
                <p>{column.name}</p>
              </div>
            )}
          />
          <Column
            title="TOTAL"
            dataIndex="amount"
            key="amount"
            render={(text, column) => (
              <div>
                <p>{column.amount ? currencyFormatter(column.amount) : 0}</p>
              </div>
            )}
          />
        </Table>
        {/* <table style={{ 'border-collapse': 'collapse', width: '100%', marginLeft: '10em' }}>
          <tr>
            <th>JUMLAH LEMBAR</th>
            <th>LEMBAR</th>
            <th>PECAHAN</th>
            <th>TOTAL</th>
          </tr>
          <tr>
            <td style={{ alignItems: 'center' }}>
              {list && list.length > 0 && list.map((column) => {
                return (
                  <div>
                    <FormItem hasFeedback>
                      {getFieldDecorator(`${column.name}-${column.type}`, {
                        initialValue: column && column.qty ? column.qty : 0
                      })(<InputNumber min={0} onChange={value => onChangeInput(column, value)} />)}
                    </FormItem>
                  </div>
                )
              })}
            </td>
            <td>
              {list && list.length > 0 && list.map((column) => {
                return (
                  <div style={{ margin: '2em', alignItems: 'center' }}>
                    <p>{column.type}</p>
                  </div>
                )
              })}
            </td>
            <td>
              {list && list.length > 0 && list.map((column) => {
                return (
                  <div style={{ margin: '2em 2em 2em 0', alignItems: 'center' }}>
                    <p>{column.name}</p>
                  </div>
                )
              })}
            </td>
            <td>
              {list && list.length > 0 && list.map((column) => {
                return (
                  <div style={{ margin: '2em', alignItems: 'center' }}>
                    <p>{column.amount ? currencyFormatter(column.amount) : 0}</p>
                  </div>
                )
              })}
            </td>
          </tr>
          <tr>
            <td colSpan={3}><p style={{ fontWeight: 'bold' }}>Subtotal</p></td>
            <td>
              <p style={{ fontWeight: 'bold' }}>
                {list && list.length > 0 && currencyFormatter(list.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0))}
              </p>
            </td>
          </tr>
        </table> */}
      </Col>
    </Row>
  )
}


export default Form.create()(FormComponent)
