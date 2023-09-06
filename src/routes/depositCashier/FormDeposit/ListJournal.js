import React from 'react'
import { Button, Col, Row, Table } from 'antd'
import { currencyFormatter } from 'utils/string'

class ListJournal extends React.Component {
  render () {
    const {
      handleChangePagination,
      ...tableProps
    } = this.props

    console.log('tableProps', tableProps)

    const columns = [
      {
        title: 'No',
        dataIndex: 'id',
        key: 'id',
        render: value => <div style={{ textAlign: 'center' }}>{value}</div>
      },
      {
        title: 'Reference',
        dataIndex: 'reference',
        key: 'accountName'
      },
      {
        title: 'Amount IN',
        dataIndex: 'detail',
        key: 'detailIn',
        render: (detail) => {
          const amountIn = Array.isArray(detail) && detail.reduce((prev, curr) => { return prev + curr.amountIn }, 0)
          return (
            <div style={{ textAlign: 'end' }}>{currencyFormatter(amountIn)}</div>
          )
        }
      },
      {
        title: 'Amount OUT',
        dataIndex: 'detail',
        key: 'detailOut',
        render: (detail) => {
          const amountOut = Array.isArray(detail) && detail.reduce((prev, curr) => { return prev + curr.amountOut }, 0)
          return (
            <div style={{ textAlign: 'end' }}>{currencyFormatter(amountOut)}</div>
          )
        }
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description'
      }
    ]

    return (
      <Col span={24}>
        <Row type="flex" align="bottom" style={{ marginBottom: '10px' }}>
          <h3 style={{ fontWeight: 'bold', flex: 1 }}>
            List Journal
          </h3>
          <Button type="primary" icon="plus">
            Add Journal
          </Button>
        </Row>
        <Table
          {...tableProps}
          columns={columns}
          bordered
          onChange={handleChangePagination}
        />
      </Col>
    )
  }
}

export default ListJournal
