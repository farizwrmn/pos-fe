/* eslint-disable no-undef */
import React from 'react'
import { Modal } from 'antd'
import FormEdit from './FormEdit'
import List from './List'

const PlanogramCashier = ({
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
    onEdit,
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
          title="Planogram Cashier"
          width="80%"
          footer={null}
          {...tableProps}
        >
          <List {...listProps} />
        </Modal> : null}
    </div>
  )
}

export default PlanogramCashier
