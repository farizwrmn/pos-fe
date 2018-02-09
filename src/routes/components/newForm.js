import React from 'react'
import { Button, Icon } from 'antd'

const NewForm = ({
  onClickNew
}) => {
  return (
    <Button style={{ height: 100 }} onClick={onClickNew}>
      <Icon type="file-add" style={{ fontSize: 60 }} />
      <div>
        <h2 style={{ fontWeight: 'bold', marginTop: 3 }}>New</h2>
      </div>
    </Button>
  )
}

export default NewForm
