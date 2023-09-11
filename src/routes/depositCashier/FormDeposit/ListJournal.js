import React from 'react'
import { Button, Col, Modal, Row, Table } from 'antd'
import { currencyFormatter } from 'utils/string'
import { DropOption } from 'components'
import moment from 'moment'

class ListJournal extends React.Component {
  render () {
    const {
      loading,
      handleAddButton,
      handleChangePagination,
      handleEdit,
      handleDelete,
      ...tableProps
    } = this.props

    const hdlDropOptionClick = (record, e) => {
      if (e.key === '1') {
        handleEdit(record)
      }

      if (e.key === '2') {
        Modal.confirm({
          title: 'Delete Journal',
          content: 'Are you sure to delete this journal?',
          onOk: () => handleDelete(record)
        })
      }
    }

    const columns = [
      {
        title: 'No',
        dataIndex: 'id',
        key: 'id',
        width: 10,
        render: value => <div style={{ textAlign: 'center' }}>{value}</div>
      },
      {
        title: 'Tanggal',
        dataIndex: 'transDate',
        key: 'transDate',
        width: 40,
        render: value => moment(value).format('DD MMM YYYY')
      },
      {
        title: 'Reference',
        dataIndex: 'reference',
        key: 'reference',
        width: 40
      },
      {
        title: 'Total',
        dataIndex: 'detail',
        key: 'detail',
        width: 40,
        render: (detail) => {
          const amountIn = Array.isArray(detail) && detail.reduce((prev, curr) => { return prev + curr.amountIn }, 0)
          return (
            <div style={{ textAlign: 'end' }}>{currencyFormatter(amountIn)}</div>
          )
        }
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: 40
      },
      {
        title: 'Action',
        width: 40,
        render: (_, record) => {
          return (
            <div style={{ textAlign: 'center' }}>
              <DropOption onMenuClick={e => hdlDropOptionClick(record, e)}
                type="primary"
                menuOptions={[
                  { key: '1', name: 'Edit', icon: 'edit' },
                  { key: '2', name: 'Delete', icon: 'close', disabled: false }
                ]}
              />
            </div>
          )
        }
      }
    ]

    return (
      <Col span={24}>
        <Row type="flex" align="bottom" style={{ marginBottom: '10px' }}>
          <h3 style={{ fontWeight: 'bold', flex: 1 }}>
            List Journal
          </h3>
          <Button
            type="primary"
            icon="plus"
            onClick={handleAddButton}
            loading={loading.effects['depositCashier/queryAdd']}
          >
            Add Journal
          </Button>
        </Row>
        <Table
          {...tableProps}
          columns={columns}
          bordered
          pagination={{
            pageSize: 10
          }}
          onChange={handleChangePagination}
        />
      </Col>
    )
  }
}

export default ListJournal
