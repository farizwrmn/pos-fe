import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag, Button } from 'antd'

const ListDetail = ({ ...tableProps, loading, onUploadStore, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 40
    },
    {
      title: 'StoreName',
      dataIndex: 'store.storeName',
      key: 'store.storeName',
      width: 100
    },
    {
      title: 'Status',
      dataIndex: 'grabCampaignId',
      key: 'grabCampaignId',
      width: 200,
      render: (text, record) => {
        if (text) {
          return (<Tag color="green">Uploaded</Tag>)
        }
        return (<Button type="primary" disabled={loading.effects['grabmartCampaign/uploadGrabmart']} onClick={() => onUploadStore(record)}>Upload</Button>)
      }
    }
  ]

  return (
    <div>
      <Table {...tableProps}
        bordered={false}
        scroll={{ x: 500, y: 270 }}
        columns={columns}
        simple
        rowKey={record => record.no}
        onRowClick={record => handleMenuClick(record)}
      />
    </div>
  )
}

ListDetail.propTypes = {
  editList: PropTypes.func
}

export default ListDetail
