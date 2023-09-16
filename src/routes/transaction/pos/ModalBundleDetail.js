import React from 'react'
import { Modal, Button } from 'antd'

const ModalBundleDetail = ({
  item,
  DeleteItem,
  ...modalProps
}) => {
  const handleDelete = () => {
    const data = {
      Record: item.code,
      Payment: 'Delete',
      VALUE: 0
    }
    Modal.confirm({
      title: `Remove Record ${data.Record} ?`,
      content: `Record ${data.Record} will remove from list !`,
      onOk () {
        console.log('Ok')
        DeleteItem(data)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  return (
    <Modal
      {...modalProps}
      title="Bundling Detail"
      onCancel={modalProps.onCancel}
      footer={[
        (<Button type="danger" onClick={handleDelete}>Delete</Button>),
        (<Button type="default" onClick={() => modalProps.onCancel()}>Cancel</Button>)
      ]}
    >
      {item && item.detail && item.detail.map((item) => {
        return (
          <div>
            <div>{item.name}</div>
            <div>Qty: {item.qty}</div>
          </div>
        )
      })}
    </Modal>
  )
}

export default ModalBundleDetail
