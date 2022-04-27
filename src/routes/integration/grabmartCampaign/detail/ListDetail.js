import React from 'react'
import PropTypes from 'prop-types'
import { Table, Tag, Button } from 'antd'

const ListDetail = ({ loading, ...tableProps, onUploadStore, editList }) => {
  const handleMenuClick = (record) => {
    editList(record)
  }

  const columns = [
    {
      title: 'StoreName',
      dataIndex: 'store.storeName',
      key: 'store.storeName',
      width: 100
    },
    {
      title: 'Response',
      dataIndex: 'response',
      key: 'response',
      width: 200
    },
    {
      title: 'Status',
      dataIndex: 'grabCampaignId',
      key: 'grabCampaignId',
      width: 100,
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
        loading={loading.effects['grabmartCampaign/queryDetail']}
        bordered={false}
        pagination={false}
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
