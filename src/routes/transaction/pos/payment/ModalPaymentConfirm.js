import React, { Component } from 'react'
import { Modal, Button } from 'antd'

class ModalPaymentConfirm extends Component {
  componentDidMount () {
    setTimeout(() => {
      const selector = document.getElementById('buttonOk')
      if (selector) {
        selector.focus()
        selector.select()
      }
    }, 300)
  }

  render () {
    const { onOk, onCancel, loading, ...modalProps } = this.props

    return (
      <Modal
        {...modalProps}
        onOk={() => {
          const selector = document.getElementById('buttonCancel')
          if (selector) {
            selector.focus()
            selector.select()
          }
          onOk()
        }}
        onCancel={() => {
          onCancel()
        }}
        footer={[
          (<Button id="buttonCancel" type="default" onClick={onCancel} disabled={loading.effects['payment/create']}>Cancel</Button>),
          (<Button id="buttonOk" type="primary" onClick={onOk} disabled={loading.effects['payment/create']}>Ok</Button>)
        ]}
      >
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Save Payment</div>
        <div>Are you sure ?</div>
      </Modal>
    )
  }
}

export default ModalPaymentConfirm
