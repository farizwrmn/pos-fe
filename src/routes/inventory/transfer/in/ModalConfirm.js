import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button } from 'antd'
import PrintPDF from './PrintPDF'

const modal = ({
  currentItemList,
  onOkPrint,
  listItem,
  user,
  storeInfo,
  onShowModal,
  ...formConfirmProps
}) => {
  const handleOk = () => {
    // onOkPrint()
    Modal.confirm({
      title: 'Transaction is done',
      content: 'Are you sure?',
      onOk () {
        location.reload()
      },
      onCancel () {
        onShowModal()
      }
    })
  }
  const modalOpts = {
    ...formConfirmProps,
    onCancel () {
      Modal.confirm({
        title: 'Transaction is done',
        content: 'Are you sure?',
        onOk () {
          location.reload()
        },
        onCancel () {
          onShowModal()
        }
      })
    }
  }
  return (
    <Modal
      title="Data has been saved"
      visible
      footer={[
        <Button size="large" key="submit" type="danger" onClick={handleOk}>
          Ignore
        </Button>
      ]}
      {...modalOpts}
    >
      <PrintPDF listItem={listItem} storeInfo={storeInfo} user={user} printNo={1} {...formConfirmProps} />
    </Modal>
  )
}

modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
  enablePopover: PropTypes.func
}

export default Form.create()(modal)
