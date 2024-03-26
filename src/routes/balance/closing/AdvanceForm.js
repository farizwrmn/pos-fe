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
  // listSetoran = [],
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
  //   dataSource: listSetoran
  // }

  // const listVoidProps = {
  //   pagination: false,
  //   defaultExpandAllRows: true,
  //   dataSource: listSetoran
  // }

  // const ListEdc = () => {
  //   let amountEDC = listSetoran.filter(filtered => filtered.status === 'A')
  //     .reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0)
  //   return (
  //     <div>
  //       <p style={{ fontWeight: 'bold' }}>Struk EDC (Kartu Kredit, Kartu Debit, QRIS APOS BCA)</p>
  //       <Table {...listEdcProps}>
  //         <Column
  //           title="JUMLAH TOTAL"
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
  //           title="TOTAL"
  //           dataIndex="TOTAL"
  //           key="TOTAL"
  //           render={(text, column) => (
  //             <div>
  //               <p>{column.total}</p>
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
  //             {listSetoran && listSetoran.length > 0 && currencyFormatterSetoran(amountEDC)}
  //           </p>
  //         </Col>
  //       </Row>
  //     </div>
  //   )
  // }

  // const ListVoid = () => {
  //   let amountVoid = listSetoran.filter(filtered => filtered.status === 'C')
  //     .reduce((cnt, o) => cnt + parseFloat(o.amount || 0), 0)
  //   return (
  //     <div>
  //       <p style={{ fontWeight: 'bold' }}>Struk Void / Cancel</p>
  //       <Table {...listVoidProps}>
  //         <Column
  //           title="JUMLAH TOTAL"
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
  //           title="TOTAL"
  //           dataIndex="TOTAL"
  //           key="TOTAL"
  //           render={(text, column) => (
  //             <div>
  //               <p>{column.total}</p>
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
  //             {listSetoran && listSetoran.length > 0 && currencyFormatterSetoran(amountVoid)}
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
            title="JUMLAH TOTAL"
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
            title="TOTAL"
            dataIndex="TOTAL"
            key="TOTAL"
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
