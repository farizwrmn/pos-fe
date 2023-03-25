import React, { Component } from 'react'
import { Modal, Button } from 'antd'

class ModalPaymentConfirm extends Component {
  render () {
    const { onOk, onCancel, loading, ...modalProps } = this.props

    return (
      <Modal
        {...modalProps}
        onOk={(e) => {
          e.preventDefault()
          const selector = document.getElementById('buttonCancel')
          if (selector) {
            selector.focus()
            selector.select()
          }
          onOk()
        }}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            e.preventDefault()
          }
        }}
        onCancel={() => {
          onCancel()
        }}
        footer={[
          (<Button id="buttonCancel" type="default" onClick={onCancel} disabled={loading.effects['payment/create']}>Cancel</Button>),
          (<Button
            id="buttonOk"
            type="primary"
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                e.preventDefault()
              }
            }}
            onClick={(e) => {
              e.preventDefault()
              onOk()
            }}
            disabled={loading.effects['payment/create']}
          >
            Ok
          </Button>)
        ]}
      >
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Save Payment</div>
        <div>Are you sure ?</div>
      </Modal>
    )
  }
}

export default ModalPaymentConfirm
