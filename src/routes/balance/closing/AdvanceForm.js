/* eslint-disable operator-assignment */
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

const AdvanceForm = ({
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
    if (currentList && currentList.length >= 0) {
      let amount = currentList.reduce((cnt, o) => {
        if (o && typeof o.amount === 'number') {
          return cnt + o.amount
        }
        return cnt
      }, 0)
      setCashValue(amount)
    }
  }

  const tableProps = {
    pagination: false,
    defaultExpandAllRows: true,
    dataSource: list
  }

  const defaultList = [{
    edcAmount: 0,
    voidAmount: 0,
    edcTotal: 0,
    voidTotal: 0
  }]
  const filterListEdc = listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'A')
  const filterListVoid = listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'C')
  const filterListGrab = listSetoran && listSetoran.length > 0 && listSetoran.filter(filtered => filtered.status === 'G')
  const listEdc = filterListEdc && filterListEdc.length > 0 ? filterListEdc : defaultList
  const listVoid = filterListVoid && filterListVoid.length > 0 ? filterListVoid : defaultList
  const listGrab = filterListGrab && filterListGrab.length > 0 ? filterListGrab : defaultList

  const updateSetoran = (itemSelection, value) => {
    const { key, type } = itemSelection
    let updatedList = [...listSetoran]
    let foundItemIndex = updatedList.findIndex(item => item.status === key)

    if (foundItemIndex !== -1) {
      updatedList[foundItemIndex] = {
        ...updatedList[foundItemIndex],
        type,
        // status: key === 'A' ? 'A' : 'C',
        status: key === 'A' ? 'A' : key === 'C' ? 'C' : 'G',
        edcAmount: type === 'edcAmount' ? value : updatedList[foundItemIndex].edcAmount || 0,
        voidAmount: type === 'voidAmount' ? value : updatedList[foundItemIndex].voidAmount || 0,
        grabAmount: type === 'grabAmount' ? value : updatedList[foundItemIndex].grabAmount || 0,
        edcTotal: type === 'edcTotal' ? value : updatedList[foundItemIndex].edcTotal || 0,
        grabTotal: type === 'grabTotal' ? value : updatedList[foundItemIndex].grabTotal || 0,
        voidTotal: type === 'voidTotal' ? value : updatedList[foundItemIndex].voidTotal || 0
      }
    } else {
      updatedList.push({
        type,
        // status: key === 'A' ? 'A' : 'C',
        status: key === 'A' ? 'A' : key === 'C' ? 'C' : 'G',
        edcAmount: type === 'edcAmount' ? value : 0,
        voidAmount: type === 'voidAmount' ? value : 0,
        grabAmount: type === 'grabAmount' ? value : 0,
        edcTotal: type === 'edcTotal' ? value : 0,
        grabTotal: type === 'grabTotal' ? value : 0,
        voidTotal: type === 'voidTotal' ? value : 0
      })
    }

    const reducedData = updatedList.reduce((accumulator, currentValue) => {
      const { status, ...rest } = currentValue
      accumulator[status] = {
        ...rest,
        status,
        edcAmount: currentValue.edcAmount || 0,
        voidAmount: currentValue.voidAmount || 0,
        grabAmount: currentValue.grabAmount || 0,
        edcTotal: currentValue.edcTotal || 0,
        voidTotal: currentValue.voidTotal || 0,
        grabTotal: currentValue.grabTotal || 0
      }
      return accumulator
    }, {})

    const reducedDataArray = Object.values(reducedData)

    dispatch({
      type: 'posSetoran/updateState',
      payload: {
        list: reducedDataArray
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

  const listGrabProps = {
    pagination: false,
    defaultExpandAllRows: true,
    dataSource: listGrab
  }

  let itemA = listSetoran && listSetoran.find(item => item.status === 'A')
  let edcAmount = itemA && itemA.edcAmount ? itemA.edcAmount : 0
  let edcTotal = itemA && itemA.edcTotal ? itemA.edcTotal : 0
  let itemB = listSetoran && listSetoran.find(item => item.status === 'C')
  let voidAmount = itemB && itemB.voidAmount ? itemB.voidAmount : 0
  let voidTotal = itemB && itemB.voidTotal ? itemB.voidTotal : 0
  let itemC = listSetoran && listSetoran.find(item => item.status === 'G')
  let grabAmount = itemC && itemC.grabAmount ? itemC.grabAmount : 0
  // let grabTotal = itemC && itemC.grabTotal ? itemC.grabTotal : 0
  let subtotalValue = (list || [])
    .filter(filtered => typeof filtered.amount === 'number' && !isNaN(filtered.amount))
    .reduce((cnt, o) => cnt + parseFloat(o.amount), 0)


  return (
    <div>
      <Form layout="horizontal">
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
                      <FormItem hasFeedback>
                        {getFieldDecorator(`${column.name}-${column.type}`, {
                          initialValue: column && column.qty ? column.qty : 0
                        })(<InputNumber min={0} onChange={(value) => { onChangeInput(column, value) }} />)}
                      </FormItem>
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
                      <p>{column.type}</p>
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
                      <p>{column.name}</p>
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
                      <p>{column.amount ? currencyFormatterSetoran(column.amount) : 0}</p>
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
          </Col>
          <Col {...column} style={{ paddingLeft: '1em' }}>
            <Row>
              <Col>
                {/* <ListEdc {...listEdcProps} /> */}
                <div>
                  <h3 style={{ fontWeight: 'bold' }}>Struk EDC (Kartu Kredit, Kartu Debit, QRIS APOS BCA, BNI)</h3>
                  <Table {...listEdcProps}>
                    <Column
                      title="JUMLAH LEMBAR"
                      dataIndex="edcAmount"
                      key="edcAmount"
                      render={() => {
                        return (
                          <div style={{ textAlign: 'center' }}>
                            <FormItem hasFeedback>
                              {getFieldDecorator('edcAmount', {
                                initialValue: edcAmount
                              })(<InputNumber style={{ width: 200 }} min={0} onChange={(value) => { updateSetoran({ key: 'A', type: 'edcAmount' }, value) }} />)}
                            </FormItem>
                          </div>
                        )
                      }}
                    />
                    {/* REQUEST UPDATE 18 MAY 2024 TO NOT INPUT VALUE */}
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
                                style={{ width: 200 }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                min={0}
                                onChange={(value) => { updateSetoran({ key: 'A', type: 'edcTotal' }, value) }}
                              />)}
                            </FormItem>
                          </div>
                        )
                      }}
                    />
                    {/* REQUEST UPDATE 18 MAY 2024 TO NOT INPUT VALUE */}
                  </Table>
                  {/* <Column
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
                /> */}
                  {/* 21MAY2024 */}
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
                  {/* 21MAY2024 */}
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
                      render={() => {
                        return (
                          <div style={{ textAlign: 'center' }}>
                            <FormItem hasFeedback>
                              {getFieldDecorator('voidAmount', {
                                initialValue: voidAmount
                              })(<InputNumber style={{ width: 200 }} min={0} onChange={(value) => { updateSetoran({ key: 'C', type: 'voidAmount' }, value) }} />)}
                            </FormItem>
                          </div>
                        )
                      }}
                    />
                    <Column
                      title="TOTAL"
                      dataIndex="voidTotal"
                      key="voidTotal"
                      render={() => {
                        return (
                          <div style={{ textAlign: 'center' }}>
                            <FormItem hasFeedback>
                              {getFieldDecorator('voidTotal', {
                                initialValue: voidTotal
                              })(<InputNumber
                                style={{ width: 200 }}
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                min={0}
                                onChange={(value) => { updateSetoran({ key: 'C', type: 'voidTotal' }, value) }}
                              />)}
                            </FormItem>
                          </div>
                        )
                      }}
                    />
                  </Table>
                  {/* <Column
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
              <Col>
                <div>
                  <h3 style={{ fontWeight: 'bold' }}>Struk Grabmart</h3>
                  <Table {...listGrabProps}>
                    <Column
                      title="JUMLAH LEMBAR"
                      dataIndex="grabAmount"
                      key="grabAmount"
                      render={() => {
                        return (
                          <div style={{ textAlign: 'center' }}>
                            <FormItem hasFeedback>
                              {getFieldDecorator('grabAmount', {
                                initialValue: grabAmount
                              })(<InputNumber
                                style={{ width: 200 }}
                                min={0}
                                onChange={(value) => {
                                  updateSetoran({ key: 'G', type: 'grabAmount' }, value)
                                }}
                              />)}
                            </FormItem>
                          </div>
                        )
                      }}
                    />

                    {/* <Column
                    title="TOTAL"
                    dataIndex="grabTotal"
                    key="grabTotal"
                    render={() => {
                      return (
                        <div style={{ textAlign: 'center' }}>
                          <FormItem hasFeedback>
                            {getFieldDecorator('grabTotal', {
                              initialValue: grabTotal
                            })(<InputNumber
                              style={{ width: 200 }}
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                              parser={value => value.replace(/\$\s?|(,*)/g, '')}
                              min={0}
                              onChange={value => { updateSetoran({ key: 'G', type: 'grabTotal' }, value) }}
                            />)}
                          </FormItem>
                        </div>
                      )
                    }}
                  /> */}

                  </Table>

                  {/* <Row style={{ padding: '1em' }}>
                  <Col span={18} style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 'bold' }}>Subtotal</p>
                  </Col>
                  <Col span={6}>
                    <p style={{ fontWeight: 'bold' }}>
                      {listSetoran && listSetoran.length > 0 && currencyFormatterSetoran(grabTotal)}
                    </p>
                  </Col>
                </Row> */}

                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  )
}


export default AdvanceForm
