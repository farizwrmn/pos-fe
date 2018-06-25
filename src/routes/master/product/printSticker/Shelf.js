import React from 'react'
import { Table, Icon, Row, Col, Card } from 'antd'
import ModalSticker from './Modal'

let tableData = []

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
  height: '100px',
  padding: '10px 8px 5px 8px'
}

const iconStyle = {
  fontSize: 25,
  fontWeight: 'bold',
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
  showModalProduct,
  listSticker,
  pushSticker,
  onSelectSticker,
  ...modalStickerProps
}) => {
  let totalQty = 0
  if (listSticker.length > 0) {
    totalQty = listSticker.map(x => x.qty).reduce((total, qty) => total + qty)
  }

  const deleteItem = (record) => {
    const getRecord = listSticker.map(item => item.name).indexOf(record.name)
    listSticker.splice(getRecord, 1)
    pushSticker(listSticker)
  }

  const getItem = (record) => {
    tableData.push(record)
    pushSticker(tableData)
  }

  const changeItem = (firstRecord, lastRecord) => {
    const find = listSticker.findIndex(x => x.name === firstRecord.name)
    listSticker[find] = lastRecord
    pushSticker(listSticker)
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
    dataSource: listSticker || [],
    columns,
    pagination: false,
    style: tableStyle
  }

  const productProps = {
    getItem,
    changeItem,
    showModalProduct,
    listSticker,
    ...modalStickerProps
  }

  let stickers = []
  if (listSticker.length > 0) {
    stickers = listSticker.map((x) => {
      let count = []
      for (let i = 0; i < x.qty; i += 1) {
        count.push(<Card.Grid style={gridStyle}>
          <p style={labelStyle}>{x.name.substr(0, 20)}</p>
          <Row>
            <Col md={12}>
              <p style={priceStyle}>Rp. {parseInt(x.info.sellPrice, 0).toLocaleString()}</p>
              <p style={distPriceStyleLeft}>Rp. {parseInt(x.info.distPrice01, 0).toLocaleString()}</p>
              <p style={distPriceStyleLeft}><br /></p>
              {/* <p style={distPriceStyleLeft}>Rp. {parseInt(x.info.distPrice02, 0).toLocaleString()}</p> */}
            </Col>
            <Col md={12}>
              <p style={sellPriceStyle}>(Non-Member)</p>
              <p style={distPriceStyleRight}>(Member)</p>
              {/* <p style={sellPriceStyle}>(Sellprice)</p> */}
              {/* <p style={distPriceStyleRight}>(Dist price 01)</p> */}
              {/* <p style={distPriceStyleRight}>(Dist price 02)</p> */}
            </Col>
          </Row>
          <p style={productCodeStyle}>{x.info.productCode}</p>
        </Card.Grid>)
      }
      return count
    })
  }

  return (
    <Row>
      <Col {...columnList}>
        <div style={divStyle}>
          <h2 style={{ padding: '10px 0 0 15px' }}>
            Products
            {totalQty !== 0 && <span style={{ fontSize: 12, margin: '0 10px' }}>{totalQty} stiker(s)</span>}
            <a onClick={() => onShowModalProduct('all')}><Icon style={iconStyle} type="plus-circle-o" /></a>
            <a onClick={() => onShowModalProduct('update')} > <Icon style={iconStyle} type="clock-circle-o" /></a>
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

export default Shelf
