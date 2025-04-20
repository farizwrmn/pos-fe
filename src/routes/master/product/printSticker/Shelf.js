import React from 'react'
import { Table, Icon, Row, Col, Card, Form, Input, Button, Checkbox } from 'antd'
import ModalSticker from './Modal'
import ModalImport from './ModalImport'

const FormItem = Form.Item

const columnList = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 8 },
  xl: { span: 8 }
}

const columnTable = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 16 },
  xl: { span: 16 }
}

const divStyle = {
  borderTop: '1px solid #ddd',
  borderRight: '1px solid #ddd',
  borderLeft: '1px solid #ddd',
  height: 45,
  width: 300,
  borderRadius: '3px 3px 0 0',
  backgroundColor: '#F9F9F9'
}

const cardStyle = {
  height: 465,
  overflowX: 'hidden'
}

const gridStyle = {
  width: '33.3%',
  height: '120px',
  padding: '10px 8px 5px 8px'
}

const iconStyle = {
  fontSize: 25,
  color: '#444',
  float: 'right',
  margin: '0 2.5px'
}

const tableStyle = {
  width: 300,
  height: 420,
  overflowX: 'hidden',
  border: '1px solid #ddd'
}

const labelStyle = {
  fontSize: 15,
  fontWeight: 1000
}

const productCodeStyle = {
  fontSize: 11,
  fontWeight: 1000
}

const priceStyle = {
  fontSize: 12,
  fontWeight: 'bold',
  textAlign: 'left'
}

const sellPriceStyle = {
  fontSize: 9,
  lineHeight: 2.2,
  textAlign: 'right'
}

const distPriceStyleLeft = {
  fontSize: 9,
  textAlign: 'left'
}

const distPriceStyleRight = {
  fontSize: 9,
  textAlign: 'right'
}

const Shelf = ({
  onShowModalProduct,
  onShowModalImport,
  showModalProduct,
  showModalImport,
  listSticker,
  addSticker,
  deleteSticker,
  updateSticker,
  listStickerImport,
  addStickerImport,
  deleteStickerImport,
  updateStickerImport,
  onSelectSticker,
  onGetPromoList,
  onGetImportedList,
  aliases,
  dispatch,
  clickChild,
  clickChildShelf,
  clickLongChild,
  loading,
  onCloseModalImport,
  form: {
    getFieldsValue,
    getFieldDecorator
  },
  ...modalStickerProps
}) => {
  let totalQty = 0
  if (listSticker.length > 0) {
    totalQty = listSticker.map(x => x.qty).reduce((total, qty) => total + qty)
  }

  if (listStickerImport.length > 0) {
    totalQty = listStickerImport.map(x => x.qty).reduce((total, qty) => total + qty)
  }

  const deleteItem = (record) => {
    const getRecord = listSticker.map(item => item.name).indexOf(record.name)
    listSticker.splice(getRecord, 1)
    deleteSticker(record)
  }

  const getItem = (record) => {
    addSticker(record)
  }

  const changeItem = (firstRecord, lastRecord) => {
    updateSticker(firstRecord, lastRecord)
  }

  const handleRowClick = (record) => {
    onShowModalProduct()
    onSelectSticker(record)
  }

  const columns = [{
    title: '',
    dataIndex: '',
    key: '',
    width: 30,
    render: (record) => {
      return <a onClick={() => deleteItem(record)}><Icon type="close" style={{ color: 'red' }} /></a>
    }
  }, {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 170,
    render: (text, record) => {
      return <div onClick={() => handleRowClick(record)}>{text}</div>
    }
  }, {
    title: 'Qty',
    dataIndex: 'qty',
    key: 'qty',
    width: 40,
    render: (text, record) => {
      return <div onClick={() => handleRowClick(record)}>{text}</div>
    }
  }]

  const tableProps = {
    dataSource: listSticker,
    columns,
    pagination: false,
    style: tableStyle
  }

  const productProps = {
    getItem,
    changeItem,
    showModalProduct,
    listSticker,
    listStickerImport,
    ...modalStickerProps
  }

  let stickers = []
  if (listSticker.length > 0) {
    stickers = listSticker.map((x) => {
      let count = []
      for (let i = 0; i < x.qty; i += 1) {
        count.push(<Card.Grid style={gridStyle}>
          <p style={labelStyle}>{x.info.productName.slice(0, 20)}</p>
          <p style={labelStyle}>{x.info.productName.slice(20, 40).length > 0 ? x.name.slice(20, 40) : '\u00A0'}</p>
          <Row>
            <Col md={12}>
              {aliases.check1 && (<p style={priceStyle}>Rp. {parseInt(x.info[aliases.price1], 0).toLocaleString()}</p>)}
              {aliases.check2 && (<p style={distPriceStyleLeft}>Rp. {parseInt(x.info[aliases.price2], 0).toLocaleString()}</p>)}
              <p style={distPriceStyleLeft}><br /></p>
            </Col>
            <Col md={12}>
              {aliases.check1 && (<p style={sellPriceStyle}>{aliases.alias1}</p>)}
              {aliases.check2 && (<p style={distPriceStyleRight}>{aliases.alias2}</p>)}
            </Col>
          </Row>
          <p style={productCodeStyle}>{x.info.productCode}</p>
        </Card.Grid>)
      }
      return count
    })
  }

  if (listSticker.length > 0) {
    stickers = listSticker.map((x) => {
      let count = []
      for (let i = 0; i < x.qty; i += 1) {
        count.push(<Card.Grid style={gridStyle}>
          <p style={labelStyle}>{x.info.productName.slice(0, 20)}</p>
          <p style={labelStyle}>{x.info.productName.slice(20, 40).length > 0 ? x.name.slice(20, 40) : '\u00A0'}</p>
          <Row>
            <Col md={12}>
              {aliases.check1 && (<p style={priceStyle}>Rp. {parseInt(x.info[aliases.price1], 0).toLocaleString()}</p>)}
              {aliases.check2 && (<p style={distPriceStyleLeft}>Rp. {parseInt(x.info[aliases.price2], 0).toLocaleString()}</p>)}
              <p style={distPriceStyleLeft}><br /></p>
            </Col>
            <Col md={12}>
              {aliases.check1 && (<p style={sellPriceStyle}>{aliases.alias1}</p>)}
              {aliases.check2 && (<p style={distPriceStyleRight}>{aliases.alias2}</p>)}
            </Col>
          </Row>
          <p style={productCodeStyle}>{x.info.productCode}</p>
        </Card.Grid>)
      }
      return count
    })
  }

  const handleSubmit = () => {
    const { alias1, alias2, check1, check2, ...other } = aliases
    const data = {
      ...getFieldsValue(),
      ...other
    }
    dispatch({
      type: 'productstock/updateState',
      payload: {
        aliases: data
      }
    })
  }

  return (
    <Row>
      <Col {...columnList}>
        <Form layout="inline">
          <FormItem label="Alias 1">
            <Col span={5}>
              {getFieldDecorator('check1', {
                initialValue: aliases.check1
              })(
                <Checkbox defaultChecked={aliases.check1} />
              )}
            </Col>
            <Col span={19}>
              {getFieldDecorator('alias1', {
                initialValue: aliases.alias1
              })(
                <Input />
              )}
            </Col>
          </FormItem>
          <FormItem label="Alias 2">
            <Row>
              <Col span={5}>
                {getFieldDecorator('check2', {
                  initialValue: aliases.check2
                })(
                  <Checkbox defaultChecked={aliases.check2} />
                )}
              </Col>
              <Col span={19}>
                {getFieldDecorator('alias2', {
                  initialValue: aliases.alias2
                })(
                  <Input />
                )}
              </Col>
            </Row>
          </FormItem>
          <Row>
            <Button style={{ margin: '8px 0' }} onClick={() => handleSubmit()} type="primary">Change</Button>
            <Button style={{ margin: '8px 0', marginLeft: '10px' }} onClick={() => onShowModalImport()} type="default" onCancel={onCloseModalImport}>Import Price Tag</Button>
          </Row>
          {showModalImport && (
            <ModalImport
              loading={loading.effects['productstock/printStickerImport']}
              visible={showModalImport}
              onCancel={onCloseModalImport}
              dispatch={dispatch}
              onSuccess={onGetImportedList}
              resetChild={clickChild}
              resetChildShelf={clickChildShelf}
              resetChildLong={clickLongChild}
            />
          )}
        </Form>
        <div style={divStyle}>
          <h2 style={{ padding: '10px 0 0 15px' }}>
            Products
            {totalQty !== 0 && <span style={{ fontSize: 12, margin: '0 10px' }}>{totalQty} stiker(s)</span>}
            <Button onClick={() => onGetPromoList()} style={iconStyle} disabled={loading.effects['productstock/printStickerActive']}>Promo</Button>
            <a onClick={() => onShowModalProduct('all')}><Icon title="Basic Product" style={iconStyle} type="plus-circle-o" /></a>
            <a onClick={() => onShowModalProduct('consignment')}><Icon title="Consignment" style={iconStyle} type="tag" /></a>
            <a onClick={() => onShowModalProduct('update')} > <Icon title="History" style={iconStyle} type="clock-circle-o" /></a>
          </h2>
        </div>
        <Table {...tableProps} />
        {showModalProduct && <ModalSticker {...productProps} />}
      </Col>
      <Col {...columnTable}>
        <Card style={cardStyle}>
          {stickers}
        </Card>
      </Col>
    </Row>
  )
}

export default Form.create()(Shelf)
