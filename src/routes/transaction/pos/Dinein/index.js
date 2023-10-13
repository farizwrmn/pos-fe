/* eslint-disable no-undef */
import React from 'react'
import { Modal } from 'antd'
import FormEdit from './FormEdit'
import List from './List'

const Express = ({
  visible,
  editVisible,
  loading,
  item,
  list,
  className,
  onClose,
  onCloseEditVisible,
  onEditItem,
  onEdit,
  ...tableProps
}) => {
  const formEditProps = {
    item,
    loading,
    editVisible,
    onCloseEditVisible,
    onEdit
  }

  const listProps = {
    dataSource: list,
    onEditItem,
    loading
  }

  return (
    <div>
      {editVisible && <FormEdit {...formEditProps} />}
      {visible ?
        <Modal
          className={className}
          visible={visible}
          onCancel={onClose}
          title="Produk K3 Express"
          width="80%"
          footer={null}
          {...tableProps}
        >
          <List {...listProps} />
        </Modal> : null}
    </div>
  )
}

export default Express
