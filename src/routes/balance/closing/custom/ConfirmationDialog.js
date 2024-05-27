import React, { Component } from 'react'
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

// const renderInputNumber = (initialValue, disabled) => {
//   const { form: { getFieldDecorator } } = this.props
//   return (
//     <FormItem hasFeedback>
//       {getFieldDecorator('amount', { initialValue })(<InputNumber disabled={disabled} style={{ width: 200 }} min={0} />)}
//     </FormItem>
//   )
// }


// const renderTableColumn = (title, dataIndex, render) => {
//   return <Column title={title} dataIndex={dataIndex} key={dataIndex} render={render} />
// }

// const renderSubtotalRow = (value) => {
//   return (
//     <Row style={{ padding: '1em' }}>
//       <Col span={18} style={{ textAlign: 'center' }}>
//         <p style={{ fontWeight: 'bold' }}>Subtotal</p>
//       </Col>
//       <Col span={6}>
//         <p style={{ fontWeight: 'bold' }}>{currencyFormatterSetoran(value)}</p>
//       </Col>
//     </Row>
//   )
// }

// const renderTable = (dataSource, columns) => {
//   return (
//     <Table pagination={false} defaultExpandAllRows dataSource={dataSource}>
//       {columns.map(col => renderTableColumn(col.title, col.dataIndex, col.render))}
//     </Table>
//   )
// }


// const renderTableWithSubtotal = (dataSource, columns, subtotalValue) => {
//   return (
//     <div>
//       {renderTable(dataSource, columns)}
//       {renderSubtotalRow(subtotalValue)}
//     </div>
//   )
// }

class ConfirmationDialog extends Component {
  filterListByStatus (status) {
    const { listSetoran } = this.props
    return listSetoran.filter(item => item.status === status)[0] || { edcAmount: 0, voidAmount: 0, grabAmount: 0 }
  }

  render () {
    const {
      listSetoran,
      list = [],
      form: {
        getFieldDecorator
      }
    } = this.props
    const filterList = list.filter(filtered => !!filtered.amount)

    // const edcData = this.filterListByStatus('A')
    // const voidData = this.filterListByStatus('C')
    // const grabData = this.filterListByStatus('G')
    const tableProps = {
      pagination: false,
      defaultExpandAllRows: true,
      dataSource: filterList
    }
    let edcData = listSetoran && listSetoran.find(item => item.status === 'A')
    let voidData = listSetoran && listSetoran.find(item => item.status === 'C')
    let grabData = listSetoran && listSetoran.find(item => item.status === 'G')
    let edcAmount = edcData && edcData.edcAmount ? edcData.edcAmount : 0
    let edcTotal = edcData && edcData.edcTotal ? edcData.edcTotal : 0
    let voidAmount = voidData && voidData.voidAmount ? voidData.voidAmount : 0
    let voidTotal = voidData && voidData.voidTotal ? voidData.voidTotal : 0
    let grabAmount = grabData && grabData.grabAmount ? grabData.grabAmount : 0
    // let grabTotal = grabData && grabData.grabTotal ? grabData.grabTotal : 0

    // console.log({
    //   edcData,
    //   voidData,
    //   grabData,
    //   edcAmount,
    //   edcTotal,
    //   voidAmount,
    //   voidTotal,
    //   grabAmount
    // })

    const subtotalValue = filterList.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0)

    const defaultList = [{ total: 0, qty: 0 }]
    const filterListEdc = listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'A')
    const filterListVoid = listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'C')
    const filterListGrab = listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'G')
    const listEdc = filterListEdc && filterListEdc.length > 0 ? filterListEdc : defaultList
    const listVoid = filterListVoid && filterListVoid.length > 0 ? filterListVoid : defaultList
    const listGrab = filterListGrab && filterListGrab.length > 0 ? filterListGrab : defaultList

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

    const listGrabProps = {
      pagination: false,
      defaultExpandAllRows: true,
      dataSource: listGrab
    }

    return (
      <React.StrictMode>
        <Row>
          <Col {...column} style={{ paddingRight: '1em' }}>
            <h3 style={{ fontWeight: 'bold' }}>SETORAN UANG TUNAI</h3>

            <Table {...tableProps}>
              <Column
                title="JUMLAH LEMBAR"
                dataIndex="JUMLAH_LEMBAR"
                key="JUMLAH_LEMBAR"
                render={(text, column) => {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      {column && column.qty ? (
                        <FormItem hasFeedback>
                          {getFieldDecorator(`${column.name}-${column.type}`, {
                            initialValue: column && column.qty ? column.qty : 0
                          })(<InputNumber disabled min={0} />)}
                        </FormItem>
                      ) : null}
                    </div>
                  )
                }}
              />
              <Column
                title="LEMBAR"
                dataIndex="LEMBAR"
                key="LEMBAR"
                render={(text, column) => {
                  return (
                    <div>
                      {column.type ? (
                        <p>{column.type}</p>
                      ) : null}
                    </div>
                  )
                }}
              />
              <Column
                title="PECAHAN"
                dataIndex="name"
                key="name"
                render={(text, column) => {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      {column.name ? (
                        <p>{column.name}</p>
                      ) : null}
                    </div>
                  )
                }}
              />
              <Column
                title="TOTAL"
                dataIndex="amount"
                key="amount"
                render={(text, column) => {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      {column.amount ? (
                        <p>{column.amount ? currencyFormatterSetoran(column.amount) : 0}</p>
                      ) : null}
                    </div>
                  )
                }}
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
            {/* {renderTableWithSubtotal(filterList, [
              {
                title: 'JUMLAH LEMBAR',
                dataIndex: 'JUMLAH_LEMBAR',
                // render: (text, column) => (
                //   <div style={{ textAlign: 'center' }}>
                //     {column.qty ? renderInputNumber(column.qty, false) : null}
                //   </div>
                // )
                render: (text, column) => {
                  return (
                    <div style={{ textAlign: 'center' }}>
                      {column && column.qty ? (
                        <FormItem hasFeedback>
                          {getFieldDecorator(`${column.name}-${column.type}`, {
                            initialValue: column && column.qty ? column.qty : 0
                          })(<InputNumber disabled min={0} />)}
                        </FormItem>
                      ) : null}
                    </div>
                  )
                }
              },
              {
                title: 'LEMBAR',
                dataIndex: 'LEMBAR',
                render: (text, column) => (
                  <div>{column.type ? <p>{column.type}</p> : null}</div>
                )
              },
              {
                title: 'PECAHAN',
                dataIndex: 'name',
                render: (text, column) => (
                  <div style={{ textAlign: 'center' }}>{column.name ? <p>{column.name}</p> : null}</div>
                )
              },
              {
                title: 'TOTAL',
                dataIndex: 'amount',
                render: (text, column) => (
                  <div style={{ textAlign: 'center' }}>
                    {column.amount ? <p>{currencyFormatterSetoran(column.amount)}</p> : null}
                  </div>
                )
              }
            ], subtotalValue)} */}
          </Col>
          <Col {...column} style={{ paddingLeft: '1em' }}>
            <Row>
              <Col>
                <div>
                  <h3 style={{ fontWeight: 'bold' }}>Struk EDC (Kartu Kredit, Kartu Debit, QRIS APOS BCA)</h3>
                  {/* {renderTable(filterList, [
                    {
                      title: 'JUMLAH LEMBAR',
                      dataIndex: 'edcAmount',
                      // render: () => (
                      //   <div style={{ textAlign: 'center' }}>{renderInputNumber(edcAmount, true)}</div>
                      // )
                      render: () => {
                        return (
                          <div style={{ textAlign: 'center' }}>
                            <FormItem hasFeedback>
                              {getFieldDecorator('edcAmount', {
                                initialValue: edcAmount
                              })(<InputNumber
                                disabled
                                style={{ width: 200 }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                min={0}
                              />)}
                            </FormItem>
                          </div>
                        )
                      }
                    },
                    {
                      title: 'TOTAL',
                      dataIndex: 'edcTotal',
                      // render: () => (
                      //   <div style={{ textAlign: 'center' }}>{renderInputNumber(edcTotal, true)}</div>
                      // )
                      render: () => {
                        return (
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
                              />)}
                            </FormItem>
                          </div>
                        )
                      }
                    }
                  ])}
                  <p style={{ fontWeight: 'bold' }}>{currencyFormatterSetoran(edcTotal)}</p>
                  {renderSubtotalRow(edcTotal)} */}

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
                      )
                      }
                    />

                    <Column
                      title="TOTAL"
                      dataIndex="edcTotal"
                      key="edcTotal"
                      render={() => {
                        return (
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
                        )
                      }}
                    />

                  </Table>
                  <Column
                    title="TOTAL"
                    dataIndex="total"
                    key="total"
                    render={(text, column) => (
                      <div style={{ textAlign: 'center' }}>
                        <p>{currencyFormatterSetoran(column.total)}</p>
                      </div>
                    )
                    }
                  />
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
                <div>
                  <h3 style={{ fontWeight: 'bold' }}>Struk Void / Cancel</h3>
                  {/* {renderTable(filterList, [
                    {
                      title: 'JUMLAH LEMBAR',
                      dataIndex: 'voidAmount',
                      // render: () => (
                      //   <div style={{ textAlign: 'center' }}>{renderInputNumber(voidData.voidAmount, true)}</div>
                      // )
                      render: () => {
                        return (
                          <div style={{ textAlign: 'center' }}>
                            <FormItem hasFeedback>
                              {getFieldDecorator('voidAmount', {
                                initialValue: voidAmount
                              })(<InputNumber
                                disabled
                                style={{ width: 200 }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                min={0}
                              />)}
                            </FormItem>
                          </div>
                        )
                      }
                    },
                    {
                      title: 'TOTAL',
                      dataIndex: 'voidTotal',
                      // render: () => (
                      //   <div style={{ textAlign: 'center' }}>{renderInputNumber(voidData.voidTotal, true)}</div>
                      // )
                      render: () => {
                        return (
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
                        )
                      }
                    }
                  ])}
                  <p style={{ fontWeight: 'bold' }}>{currencyFormatterSetoran(voidTotal)}</p>
                  {renderSubtotalRow(voidTotal)} */}
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
                      )
                      }
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
                      )
                      }
                    />
                  </Table>
                  <Column
                    title="TOTAL"
                    dataIndex="total"
                    key="total"
                    render={(text, column) => {
                      return (
                        <div style={{ textAlign: 'center' }}>
                          <p>{currencyFormatterSetoran(column.total)}</p>
                        </div>
                      )
                    }}
                  />
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
          <Col>
            <div>
              <h3 style={{ fontWeight: 'bold' }}>Struk Grabmart</h3>
              {/* {renderTable(filterList, [
                {
                  title: 'JUMLAH LEMBAR',
                  dataIndex: 'grabAmount',
                  // render: () => (
                  //   <div style={{ textAlign: 'center' }}>{renderInputNumber(grabAmount, false)}</div>
                  // )
                  render: () => {
                    return (
                      <div style={{ textAlign: 'center' }}>
                        <FormItem hasFeedback>
                          {getFieldDecorator('grabAmount', {
                            initialValue: grabAmount
                          })(<InputNumber disabled style={{ width: 200 }} min={0} />)}
                        </FormItem>
                      </div>
                    )
                  }
                }
              ])} */}
              <Table {...listGrabProps}>
                <Column
                  title="JUMLAH LEMBAR"
                  dataIndex="grabAmount"
                  key="grabAmount"
                  render={() => (
                    <div style={{ textAlign: 'center' }}>
                      <FormItem hasFeedback>
                        {getFieldDecorator('grabAmount', {
                          initialValue: grabAmount
                        })(<InputNumber disabled style={{ width: 200 }} min={0} />)}
                      </FormItem>
                    </div>
                  )
                  }
                />
              </Table>

            </div>
          </Col>
        </Row>
      </React.StrictMode>
    )
  }
}

export default Form.create()(ConfirmationDialog)
