import React from 'react'
import { Modal, Form, Card, Icon, Button, Switch } from 'antd'

const confirm = Modal.confirm

const ChangeTotp = ({
  ...modalProps,
  user,
  totp,
  totpChecked,
  modalSwitchChange,
  onCancelButton,
  onSaveTotpButton,
  onRegenerateTotp,
  form: {
    validateFields
  }
}) => {
  const modalOpts = {
    ...modalProps
  }
  const hdlButtonCancelClick = () => {
    onCancelButton()
  }
  const hdlButtonSaveClick = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      onSaveTotpButton(user.userid, { totp: totpChecked ? totp.key : null })
    })
  }
  const hdlRegenerateTotp = () => {
    onRegenerateTotp()
  }
  const confirmDisableTotp = () => {
    confirm({
      title: 'Are you sure disable TOTP?',
      content: 'Disable Two-Factor Authentication will not secure your login',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk () {
        console.log('OK')
        modalSwitchChange(false, user.userid)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }
  const hdlSwitchChange = (checked) => {
    if (!checked) {
      confirmDisableTotp()
    } else {
      modalSwitchChange(true, user.userid)
    }
  }

  return (
    <Modal {...modalOpts}
      footer={[
        <Button key="back" onClick={() => hdlButtonCancelClick()} >Cancel</Button>,
        <Button key="submit" type="primary" onClick={() => hdlButtonSaveClick()} >Save</Button>
      ]}
    >
      <Card bordered={false} title="Change TOTP" >
        <Switch checked={totpChecked}
          checkedChildren={<div><Icon type="lock" /><span> Secure with TOTP</span></div>}
          unCheckedChildren={<div><Icon type="unlock" /><span> Not Secure</span></div>}
          onChange={hdlSwitchChange}
        />
        <br />
        {(totpChecked) &&
          <div style={{ paddingTop: 10, position: 'relative', textAlign: 'center' }}>
            <p style={{ paddingBottom: 10 }}>Scan the QR code or enter the secret in Google Authenticator</p>
            <Card title="Re-generate TOTP"
              extra={<Button type="primary" shape="circle" icon="reload" onClick={() => hdlRegenerateTotp()} />}
              style={{ width: 240, display: 'inline-block' }}
            >
              <div className="custom-image">
                <img alt="example" width="100%" src={totp.url} />
              </div>
              <div className="custom-card">
                <h3>Secret - {totp.key}</h3>
              </div>
            </Card>
          </div>
        }
      </Card>
    </Modal>
  )
}

export default Form.create()(ChangeTotp)
