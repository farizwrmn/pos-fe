import React from 'react'
import { Table, Form, InputNumber, Row, Col } from 'antd'
import { currencyFormatter } from 'utils/string'

const FormItem = Form.Item
const Column = Table.Column

const ConfirmationDialog = ({
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

  const filterList = list.filter(fitlered => !!fitlered.amount)
  const tableProps = {
    pagination: false,
    defaultExpandAllRows: true,
    dataSource: filterList
  }

  return (
    <div style={{ margin: '0 12em' }}>
      <Table {...tableProps}>
        <Column
          title="JUMLAH LEMBAR"
          dataIndex="JUMLAH_LEMBAR"
          key="JUMLAH_LEMBAR"
          render={(text, column) => (
            <div>
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
            <div>
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
            <div>
              {column.amount ? (
                <p>{column.amount ? currencyFormatter(column.amount) : 0}</p>
              ) : null}
            </div>
          )}
        />
      </Table>
      <Row style={{ padding: '1em' }}>
        <Col span={20}>
          <p style={{ fontWeight: 'bold' }}>Subtotal</p>
        </Col>
        <Col span={4}>
          <p style={{ fontWeight: 'bold' }}>
            {list && list.length > 0 && currencyFormatter(list.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0))}
          </p>
        </Col>
      </Row>
      {/* <table style={{ 'border-collapse': 'collapse', width: '100%' }}>
          <tr>
            <th>JUMLAH LEMBAR</th>
            <th>Lembar</th>
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
                      })(<InputNumber disabled min={0} onChange={value => onChangeInput(column, value)} />)}
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
            <td colSpan={3}>Subtotal</td>
            <td>{list && list.length > 0 && currencyFormatter(list.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0))}</td>
          </tr>
        </table> */}
    </div>
  )
}


export default Form.create()(ConfirmationDialog)
