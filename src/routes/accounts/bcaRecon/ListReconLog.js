import React from 'react'
import { Table, Modal } from 'antd'

const ListReconLog = ({
  modalStoreVisible,
  openModalStore,
  className,
  storeName,
  onCancel,
  onOk,
  ...tableProps
}) => {
  const columns = [
    {
      title: 'Store Id',
      dataIndex: 'storeId',
      key: 'storeId',
      width: 20,
      render: (text, record) => {
        return (
          <div style={{ color: '#55a756' }} onClick={() => openModalStore({ id: record.id, storeId: record.storeId, transDate: record.transDate })}>{text ? text.toLocaleString() : ''}</div>
        )
      }
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: 20
    },
    {
      title: 'Detail',
      dataIndex: 'detail',
      key: 'detail',
      width: 150
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 50
    }
  ]

  return (
    <div>
      <h3>Recon Log </h3>
      {modalStoreVisible &&
        <Modal
          className={className}
          visible={modalStoreVisible}
          width="600px"
          height="50%"
          title="Pindah Store"
          onCancel={onCancel}
          onOk={onOk}
          {...tableProps}
        >
          Pindah ke store: {storeName}
        </Modal>}

      <Table {...tableProps}
        bordered
        columns={columns}
        simple
        rowKey={record => record.id}
      />
    </div>
  )
}

export default ListReconLog
