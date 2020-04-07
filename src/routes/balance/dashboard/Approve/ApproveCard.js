import React from 'react'
import { Button, Card } from 'antd'
import moment from 'moment'
import styles from './index.less'

const CardItem = ({ label, value }) => {
  return (
    <div className={styles.row}>
      <div className={styles.infoTitle}>{`${label}: `}</div>
      <div className={styles.infoValue}>{value}</div>
    </div>
  )
}

const ApproveCard = ({ item, onOpenModal }) => {
  if (!item) return null
  return (
    <Card className={styles.card}>
      <Button type="primary" onClick={() => onOpenModal(item)} style={{ float: 'right' }}>Approve</Button>
      <h2 className={styles.date}>{item.open ? moment(item.open).format('DD-MMM-YYYY') : null}</h2>
      <div className={styles.secondaryTitle}>{item.store ? item.store.storeName : null} - {item.shift ? item.shift.shiftName : null}</div>
      <CardItem label="Cashier" value={item.user ? item.user.userName : null} />
      <CardItem label="Assign" value={item.approveUser ? item.approveUser.userName : null} />
    </Card>
  )
}

export default ApproveCard
