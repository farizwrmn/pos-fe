import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, Button } from 'antd'
import PrintPDF from './PrintPDF'

const ModalConfirm = ({
  currentItemList,
  onOkPrint,
  onShowModal,
  onCancelList,
  listItem,
  user,
  storeInfo,
  ...modalOpts
}) => {
  const handleOk = () => {
    onOkPrint()
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
      {<PrintPDF listItem={listItem} storeInfo={storeInfo} user={user} printNo={1} {...modalOpts} />}
    </Modal>
  )
}

ModalConfirm.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
  enablePopover: PropTypes.func
}

export default Form.create()(ModalConfirm)
