import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row, Table, Tabs } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'
import { color } from 'utils/theme'
import Summary from './Summary'

const numberFormatter = numberFormat.numberFormatter
const TabPane = Tabs.TabPane

const List = ({ ...tableProps, onFilterChange, list, summary, loading, vendorActiveKey, changeVendorTab }) => {
  const columns = [
    {
      title: 'Tanggal',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 90,
      render: (text, record) => <div style={{ color: record.type === 'rtn' ? color.error : color.black }}>{moment(text).format('DD MMM YYYY')}</div>
    },
    {
      title: 'Faktur Penjualan',
      dataIndex: 'salesOrder.number',
      key: 'salesOrder.number',
      width: 140,
      render: (value, record) => <div style={{ color: record.type === 'rtn' ? color.error : color.black }}>{value || record['returnOrder.number']}</div>
    },
    {
      title: 'Nama Produk',
      dataIndex: 'stock.product.product_name',
      key: 'stock.product.product_name',
      width: 100,
      render: (value, record) => <div style={{ color: record.type === 'rtn' ? color.error : color.black }}>{value || record['salesOrderProduct.stock.product.product_name']}</div>
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      render: (value, record) => <div style={{ textAlign: 'center', color: record.type === 'rtn' ? color.error : color.black }}>{value}</div>
    },
    {
      title: 'Metode Pembayaran',
      dataIndex: 'salesOrder.paymentMethods.method',
      key: 'salesOrder.paymentMethods.method',
      width: 140,
      render: (value, record) => <div style={{ color: record.type === 'rtn' ? color.error : color.black }}>{value || record['returnOrder.salesOrder.paymentMethods.method']}</div>
    },
    {
      title: 'Total(Modal + Grab)',
      dataIndex: 'total',
      key: 'total',
      width: 140,
      render: (value, record) => <div style={{ textAlign: 'end', color: record.type === 'rtn' ? color.error : color.black }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Komisi(Komisi + Grab)',
      dataIndex: 'commission',
      key: 'commission',
      width: 150,
      render: (value, record) => <div style={{ textAlign: 'end', color: record.type === 'rtn' ? color.error : color.black }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Charge',
      dataIndex: 'charge',
      key: 'charge',
      width: 90,
      render: (value, record) => <div style={{ textAlign: 'end', color: record.type === 'rtn' ? color.error : color.black }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Grab',
      dataIndex: 'commissionGrab',
      key: 'commissionGrab',
      width: 90,
      render: (value, record) => <div style={{ textAlign: 'end', color: record.type === 'rtn' ? color.error : color.black }}>{`Rp ${numberFormatter(value)}`}</div>
    },
    {
      title: 'Modal',
      dataIndex: 'stock.product.capital',
      key: 'stock.product.capital',
      width: 90,
      render: (value, record) => {
        return <div style={{ textAlign: 'end', color: record.type === 'rtn' ? color.error : color.black }}>{`Rp ${numberFormatter(value * record.quantity)}`}</div>
      }
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      width: 90,
      render: (value, record) => <div style={{ textAlign: 'end', color: record.type === 'rtn' ? color.error : color.black }}>{`Rp ${numberFormatter(value)}`}</div>
    }
  ]

  const onChange = (pagination) => {
    onFilterChange({ pagination })
  }

  return (
    <Row>
      {summary && (
        <Row>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            <Summary loading={loading} list={summary} />
          </Col>
        </Row>
      )}
      <Tabs activeKey={vendorActiveKey} onChange={key => changeVendorTab(key)} type="card" style={{ marginTop: '10px' }}>
        {list.map((record, index) => {
          return (<TabPane tab={`${record.vendor.vendor_code} - ${record.vendor.name}`} key={String(index)} >
            {vendorActiveKey === String(index) &&
              <div>
                <Row style={{ marginBottom: '15px' }}>
                  <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                    <Summary loading={loading} list={record.summary} />
                  </Col>
                </Row>
                <Table {...tableProps}
                  dataSource={record.list}
                  bordered
                  columns={columns}
                  simple
                  scroll={{ x: 1200 }}
                  rowKey={rowRecord => rowRecord.id}
                  onChange={onChange}
                />
              </div>
            }
          </TabPane>
          )
        })}
      </Tabs>
    </Row>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
