import React from 'react'
import { formatDate } from 'utils'
import { Row, Col } from 'antd'
import styles from './index.less'

const columnsLabel = {
  xs: { span: 10 },
  sm: { span: 8 },
  md: { span: 8 },
  lg: { span: 5 }
}

const columnsContent = {
  xs: { span: 13 },
  sm: { span: 15 },
  md: { span: 15 },
  lg: { span: 18 }
}

const ThankYou = ({ memberInfo }) => {
  let label = ['member code', 'member name', 'offering', 'next service', 'satisfaction', 'post service date']
  let content = [
    memberInfo.memberCode,
    memberInfo.memberName,
    memberInfo.acceptOfferingReason ? 'Accept' : 'Deny',
    memberInfo.nextCall ? formatDate(memberInfo.nextCall) : '',
    memberInfo.customerSatisfaction ? memberInfo.customerSatisfaction : '',
    memberInfo.postService ? formatDate(memberInfo.postService) : ''
  ]
  return (
    <div>
      <div className={styles.titleWrapper}>
        <h1>all data has been saved</h1>
        <h3>Thank you</h3>
      </div>
      <Row>
        <Col {...columnsLabel} className={styles.label}>
          {label.map(x => (<p>{x}</p>))}
        </Col>
        <Col span={1} className={styles.colon}>
          {label.map(() => (<p>:</p>))}
        </Col>
        <Col {...columnsContent} className={styles.content}>
          {content.map(x => (x !== '' ? (<p>{x}</p>) : (<p>&nbsp;</p>)))}
        </Col>
      </Row>
    </div>
  )
}

export default ThankYou
