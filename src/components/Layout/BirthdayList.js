import React from 'react'
import moment from 'moment'
import { Modal, Card, Button } from 'antd'

const list = { minHeight: 300, maxHeight: 400, overflowX: 'hidden' }

const BirthdayList = ({ ...modalProps, content }) => {
  const capitalize = (name) => {
    const splitName = name.toLowerCase().split(' ')
    for (let i = 0; i < splitName.length; i += 1) {
      splitName[i] = splitName[i].charAt(0).toUpperCase() + splitName[i].substring(1)
    }
    return splitName.join(' ')
  }

  const listCard = content.length > 0 ? content.map(x => (<Card>
    <h2 style={{ fontWeight: 'bold' }}>
      {x.memberName}
    </h2>
    <p>Today is {capitalize(x.memberName)}`s birthday. Let`s say happy birthday to {capitalize(x.memberName)}!</p>
    <p>Email: {x.email ? capitalize(x.email) : '-'}</p>
    <p>Phone no: {x.mobileNumber ? capitalize(x.mobileNumber) : '-'}</p>
    <p><span style={{ float: 'left' }}>Birthdate: {x.birthDate ? moment(x.birthDate).format('DD-MMM-YYYY') : '-'}</span><Button style={{ float: 'right', border: '1px solid #d2d4d8' }}>Send Email</Button></p>
  </Card>)) : []
  return (
    <Modal {...modalProps}>
      <div style={list}>
        {listCard}
      </div>
    </Modal>
  )
}

export default BirthdayList
