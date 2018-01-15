import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd'
import ModalBrowse from './Modal'

const BrowseButton = ({
  ...modalProps,
  openModal,
}) => {
  const { modalVisible } = modalProps
  return (
    <div>
      <Button type="primary" size="large" onClick={openModal} style={{ marginBottom: 15 }}>Find Customer</Button>
      {modalVisible && <ModalBrowse {...modalProps} />}
    </div>
  )
}

BrowseButton.propTypes = {
  openModal: PropTypes.func,
}

export default BrowseButton
