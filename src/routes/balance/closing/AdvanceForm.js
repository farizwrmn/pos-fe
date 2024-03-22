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

const FormComponent = ({
  dispatch,
  list = [],
  // listEdc = [],
  // listVoid = [],
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

  // const listEdcProps = {
  //   pagination: false,
  //   defaultExpandAllRows: true,
  //   dataSource: listEdc
  // }

  // const listVoidProps = {
  //   pagination: false,
  //   defaultExpandAllRows: true,
  //   dataSource: listVoid
  // }

  // const ListEdc = () => {
  //   return (
  //     <div>
  //       <p style={{ fontWeight: 'bold' }}>Struk EDC (Kartu Kredit, Kartu Debit, QRIS APOS BCA)</p>
  //       <Table {...listEdcProps}>
  //         <Column
  //           title="JUMLAH LEMBAR"
  //           dataIndex="JUMLAH_LEMBAR"
  //           key="JUMLAH_LEMBAR"
  //           render={(text, column) => (
  //             <div style={{ textAlign: 'right' }}>
  //               <FormItem hasFeedback>
  //                 {getFieldDecorator(`${column.name}-${column.type}`, {
  //                   initialValue: column && column.qty ? column.qty : 0
  //                 })(<InputNumber min={0} onChange={value => onChangeInput(column, value)} />)}
  //               </FormItem>
  //             </div>
  //           )}
  //         />
  //         <Column
  //           title="LEMBAR"
  //           dataIndex="LEMBAR"
  //           key="LEMBAR"
  //           render={(text, column) => (
  //             <div>
  //               <p>{column.type}</p>
  //             </div>
  //           )}
  //         />
  //       </Table>

  //       <Row style={{ padding: '1em' }}>
  //         <Col span={20}>
  //           <p style={{ fontWeight: 'bold' }}>Subtotal</p>
  //         </Col>
  //         <Col span={4}>
  //           <p style={{ fontWeight: 'bold' }}>
  //             {listEdc && listEdc.length > 0 && currencyFormatterSetoran(list.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0))}
  //           </p>
  //         </Col>
  //       </Row>
  //     </div>
  //   )
  // }

  // const ListVoid = () => {
  //   return (
  //     <div>
  //       <p style={{ fontWeight: 'bold' }}>Struk Void / Cancel</p>
  //       <Table {...listVoidProps}>
  //         <Column
  //           title="JUMLAH LEMBAR"
  //           dataIndex="JUMLAH_LEMBAR"
  //           key="JUMLAH_LEMBAR"
  //           render={(text, column) => (
  //             <div style={{ textAlign: 'right' }}>
  //               <FormItem hasFeedback>
  //                 {getFieldDecorator(`${column.name}-${column.type}`, {
  //                   initialValue: column && column.qty ? column.qty : 0
  //                 })(<InputNumber min={0} onChange={value => onChangeInput(column, value)} />)}
  //               </FormItem>
  //             </div>
  //           )}
  //         />
  //         <Column
  //           title="LEMBAR"
  //           dataIndex="LEMBAR"
  //           key="LEMBAR"
  //           render={(text, column) => (
  //             <div>
  //               <p>{column.amount}</p>
  //             </div>
  //           )}
  //         />
  //       </Table>

  //       <Row style={{ padding: '1em' }}>
  //         <Col span={20}>
  //           <p style={{ fontWeight: 'bold' }}>Subtotal</p>
  //         </Col>
  //         <Col span={4}>
  //           <p style={{ fontWeight: 'bold' }}>
  //             {listVoid && listVoid.length > 0 && currencyFormatterSetoran(list.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0))}
  //           </p>
  //         </Col>
  //       </Row>
  //     </div>
  //   )
  // }

  return (
    <Row>
      <Col {...column}>
        <h3>SETORAN UANG TUNAI</h3>
        <Table {...tableProps}>
          <Column
            title="JUMLAH LEMBAR"
            dataIndex="JUMLAH_LEMBAR"
            key="JUMLAH_LEMBAR"
            render={(text, column) => (
              <div style={{ textAlign: 'center' }}>
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
              <div style={{ textAlign: 'center' }}>
                <p>{column.name}</p>
              </div>
            )}
          />
          <Column
            title="TOTAL"
            dataIndex="amount"
            key="amount"
            render={(text, column) => (
              <div style={{ textAlign: 'center' }}>
                <p>{column.amount ? currencyFormatterSetoran(column.amount) : 0}</p>
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
                    <p>{column.amount ? currencyFormatterSetoran(column.amount) : 0}</p>
                  </div>
                )
              })}
            </td>
          </tr>
          <tr>
            <td colSpan={3}><p style={{ fontWeight: 'bold' }}>Subtotal</p></td>
            <td>
              <p style={{ fontWeight: 'bold' }}>
                {list && list.length > 0 && currencyFormatterSetoran(list.reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0))}
              </p>
            </td>
          </tr>
        </table> */}
      </Col>
      {/* <Col {...column}>
        <Row>
          <Col>
            <ListEdc />
          </Col>
          <Col>
            <ListVoid />
          </Col>
        </Row>
      </Col> */}
    </Row>
  )
}


export default Form.create()(FormComponent)
