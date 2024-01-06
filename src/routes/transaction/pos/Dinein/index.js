/* eslint-disable no-undef */
import React from 'react'
import moment from 'moment'
import { Button, Modal } from 'antd'
import { lstorage } from 'utils'
import FormEdit from './FormEdit'
import List from './List'

const Express = ({
  visible,
  editVisible,
  loading,
  userRole = lstorage.getCurrentUserRole(),
  enableDineIn,
  enableDineInLastUpdatedBy,
  enableDineInLastUpdatedAt,
  updateEnableDineIn,
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
          title="Produk K3 Express"
          width="80%"
          footer={null}
          {...tableProps}
        >
          <div style={{ marginBottom: '10px' }}>
            <div>{enableDineIn ? <Button type="danger" onClick={() => updateEnableDineIn(0)}>Disable</Button> : <Button type="primary" disabled={userRole !== 'OWN'} onClick={() => updateEnableDineIn(1)}>Enable</Button>}</div>
            {enableDineInLastUpdatedAt ? <div>Updated At: {moment(enableDineInLastUpdatedAt).format('DD-MMM-YYYY HH:mm')}</div> : null}
            {enableDineInLastUpdatedBy ? <div>By: {enableDineInLastUpdatedBy}</div> : null}
          </div>
          <List {...listProps} />
        </Modal> : null}
    </div>
  )
}

export default Express
