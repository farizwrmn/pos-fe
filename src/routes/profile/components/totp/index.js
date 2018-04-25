import React from 'react'
import { Modal, Card, Icon, Button, Switch } from 'antd'

const confirm = Modal.confirm

const TOTP = ({
  user,
  totp,
  totpChecked,
  onGenerateTotp,
  onUpdateTotp,
  onSwitchTotp
}) => {
  const confirmDisableTotp = () => {
    confirm({
      title: 'Are you sure disable TOTP?',
      content: 'Disable Two-Factor Authentication will not secure your login',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk () {
        onSwitchTotp(false, user.userid)
      },
      onCancel () {
        console.log('Cancel')
      }
    })
  }

  const handleSwitchTotp = (checked) => {
    if (!checked) {
      confirmDisableTotp()
    } else {
      onSwitchTotp(true, user.userid)
    }
  }

  const updateTotp = () => {
    onUpdateTotp(user.userid, { totp: totpChecked ? totp.key : null })
  }

  return (
    <div>
      <Switch checked={totpChecked}
        checkedChildren={<div><Icon type="lock" /><span> Secure with TOTP</span></div>}
        unCheckedChildren={<div><Icon type="unlock" /><span> Not Secure</span></div>}
        onChange={handleSwitchTotp}
      />
      <br />
      {(totpChecked) &&
        <div style={{ paddingTop: 10, position: 'relative', textAlign: 'center' }}>
          <p style={{ paddingBottom: 10 }}>Scan the QR code or enter the secret in Google Authenticator</p>
          <Card title="Re-generate TOTP"
            extra={<Button type="primary" shape="circle" icon="reload" onClick={onGenerateTotp} />}
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
      <Button key="submit" type="primary" style={{ float: 'right' }} onClick={updateTotp}>Update</Button>
    </div>
  )
}

export default TOTP
