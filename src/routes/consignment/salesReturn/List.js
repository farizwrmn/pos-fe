import React from 'react'
import PropTypes from 'prop-types'
import { Col, Modal, Row, Table } from 'antd'
import { numberFormat } from 'utils'
import moment from 'moment'

const numberFormatter = numberFormat.numberFormatter
let modalDetail

const headerColumnProps = {
  xs: 24,
  sm: 24,
  md: 16,
  lg: 16,
  xl: 16
}

const detailColumnProps = {
  xs: 24,
  sm: 24,
  md: 22,
  lg: 22,
  xl: 22
}

const List = ({
  ...tableProps,
  onFilterChange,
  clearDetail,
  getDetail,
  returnDetail
}) => {
  const onChange = (pagination, filters) => {
    let status
    if (filters.return_status) {
      status = filters.return_status
    }

    onFilterChange({ filter: status, pagination })
  }

  const ShowDetail = ({ record }) => {
    const detailColumn = [
      {
        title: 'OrderID',
        dataIndex: 'column1',
        key: 'column1',
        width: '150px'
      },
      {
        title: record.salesNumber,
        dataIndex: 'column2',
        key: 'column2'
      }
    ]
    const formattedData = [
      {
        column1: 'Return Order ID',
        column2: record.number || '-'
      },
      {
        column1: 'Dibuat oleh',
        column2: record.adminName || '-'
      },
      {
        column1: 'Dibuat pada',
        column2: moment(record.createdAt).format('DD MMMM YYYY') || '-'
      },
      {
        column1: 'Ubah Status oleh',
        column2: record.adminName || '-'
      },
      {
        column1: 'Ubah Status pada',
        column2: moment(record.updatedAt).format('DD MMMM YYYY') || '-'
      },
      {
        column1: 'Status',
        column2: record.return_status ? String(record.return_status).at(0).toUpperCase() + String(record.return_status).slice(1) : '-'
      },
      {
        column1: 'Alasan',
        column2: record.return_reason || '-'
      },
      {
        column1: 'Total',
        column2: record.total ? `Rp ${numberFormatter(record.total)}` : '-'
      }
    ]

    const productColumn = [
      {
        title: 'Nama Produk',
        dataIndex: 'product_name',
        key: 'product_name'
      },
      {
        title: 'Qty',
        dataIndex: 'quantity',
        key: 'quantity'
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: value => `Rp ${numberFormatter(value)}`
      }
    ]

    modalDetail = Modal.info({
      title: 'Return Detail',
      width: '600px',
      iconType: 'exclamation-circle',
      content: (
        <Row>
          <Col {...headerColumnProps}>
            <Table
              bordered
              pagination={false}
              dataSource={formattedData}
              columns={detailColumn}
              scroll={{ x: 300 }}
            />
          </Col>
          <Col {...detailColumnProps} style={{ marginTop: '15px' }}>
            <div style={{ fontWeight: 'bolder' }}>
              PRODUCT LIST
            </div>
            <Table
              pagination={false}
              bordered
              dataSource={record.products}
              columns={productColumn}
              scroll={{ x: 300 }}
            />
          </Col>
        </Row>
      ),
      okText: 'Close',
      cancelText: 'Close',
      onCancel () {
        modalDetail = false
        clearDetail()
      },
      onOk () {
        modalDetail = false
        clearDetail()
      }
    })

    return modalDetail
  }

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'salesNumber',
      key: 'salesNumber',
      width: 150,
      render: (text, record) => (
        <Row type="flex" justify="center">
          <a href={null}
            onClick={() => {
              getDetail({
                returnId: record.id,
                salesNumber: record['salesOrder.salesNumber']
              })
            }}
          >{text || record.number}</a>
        </Row>
      )
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 80,
      render: (value) => {
        return (
          <div>
            {`Rp ${numberFormatter(value)}` || '-'}
          </div>
        )
      }
    },
    {
      title: 'Dibuat oleh',
      dataIndex: 'admin.name',
      key: 'admin.name',
      width: 120,
      render: (text, record) => {
        return (
          <div>
            {record.createdby_pos ? record.createdby_pos : (text || '-')}
          </div>
        )
      }
    },
    {
      title: 'Dibuat pada',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 140,
      render: (text) => {
        const formattedDate = moment(text).format('DD MMMM YYYY')
        return (
          <div>
            {formattedDate}
          </div>
        )
      }
    },
    {
      title: 'Ubah Status oleh',
      dataIndex: 'admin.name',
      key: 'changestatus.name',
      width: 150,
      render: (text, record) => {
        return (
          <div>
            {record.createdby_pos ? record.createdby_pos : (text || '-')}
          </div>
        )
      }
    },
    {
      title: 'Ubah Status pada',
      dataIndex: 'changestatus_at',
      key: 'changestatus_at',
      width: 140,
      render: (text) => {
        return (
          <div>
            {text ? moment(text).format('DD MMMM YYYY') : '-'}
          </div>
        )
      }
    },
    {
      title: 'Status',
      dataIndex: 'return_status',
      key: 'return_status',
      width: 80,
      filters: [{
        text: 'Approved',
        value: 'approved'
      }, {
        text: 'Pending',
        value: 'pending'
      }, {
        text: 'Rejected',
        value: 'rejected'
      }],
      render: (text) => {
        return (
          <div>
            {String(text).at(0).toUpperCase() + String(text).slice(1)}
          </div>
        )
      }
    },
    {
      title: 'Alasan',
      dataIndex: 'return_reason',
      key: 'return_reason',
      width: 150,
      render: (text) => {
        return (
          <div>
            {text || '-'}
          </div>
        )
      }
    }
  ]

  return (
    <div>
      {returnDetail && returnDetail.id && !modalDetail && <ShowDetail record={returnDetail} />}
      <Table {...tableProps}
        size="default"
        bordered
        simple
        columns={columns}
        scroll={{ x: 1010 }}
        rowKey={record => record.id}
        onChange={onChange}
      />
    </div>
  )
}

List.propTypes = {
  editItem: PropTypes.func,
  deleteItem: PropTypes.func
}

export default List
