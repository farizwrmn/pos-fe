import React from 'react'
import { Modal } from 'antd'

const ModalBirthday = ({
  ...modalProps
}) => {
  return (
    <Modal {...modalProps}>
      <img src={'https://destmart.s3.ap-southeast-3.amazonaws.com/membergif/member-1.gif'} alt="Birthday" />
    </Modal>
  )
}

export default ModalBirthday
