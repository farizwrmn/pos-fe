import React from 'react'
import { Row, Col } from 'antd'
import moment from 'moment'
import styles from './index.less'
import DataTable from './DataTable'
import { Button } from '../../../../../../node_modules/antd/lib/radio'

const columns = {
  xs: { span: 24 },
  sm: { span: 12 },
  md: { span: 12 },
  lg: { span: 12 }
}

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

const View = ({
  memberInfo, details, updateHeaderStatus
}) => {
  let label = ['member code', 'member name', 'gender', 'birth date', 'city', 'address', 'last trans',
    'last trans no', 'mechanic', 'cashier', 'last call', 'status', 'post service date']
  let content = []
  if (!_.isEmpty(memberInfo)) {
    let status = ''
    switch (memberInfo.status) {
      case '0':
        status = 'Not Called'
        break
      case '1':
        status = 'Called'
        break
      case '2':
        status = 'In Progress'
        break
      case '3':
        status = 'Pending'
        break
      case '4':
        status = 'Never'
        break
      default:
        break
    }
    content = [
      memberInfo.memberCode,
      memberInfo.memberName,
      memberInfo.gender === 'M' ? 'Male' : 'Female',
      memberInfo.birthDate ? moment(memberInfo.birthDate).format('DD-MMM-YYYY') : '',
      memberInfo.cityName || '',
      memberInfo.address01 || '',
      memberInfo.transDate ? moment(memberInfo.transDate).format('DD-MMM-YYYY') : '',
      memberInfo.transNo || '',
      memberInfo.technicianName || '',
      memberInfo.cashierName || '',
      memberInfo.lastCall ? moment(memberInfo.lastCall).format('DD-MMM-YYYY HH:mm') : '',
      status,
      memberInfo.postService ? moment(memberInfo.postService).format('DD-MMM-YYYY HH:mm') : ''
    ]
  }

  const tableProps = {
    dataSource: details,
    pagination: false,
    headers: ['Type', 'Promo', 'Item', 'Qty', 'Total']
  }

  return (
    <div className="content-inner">
      <Row>
        <Col {...columns}>
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
        </Col>
        <Col {...columns}>
          <DataTable {...tableProps} />
        </Col>
      </Row>
      <Button className="button-right-side" size="large" onClick={() => updateHeaderStatus(memberInfo.id)}>Call</Button>
    </div>
  )
}
export default View
