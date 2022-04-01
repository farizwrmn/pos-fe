import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {
  Row,
  Col,
  Tag,
  Button,
  Spin
} from 'antd'
import moment from 'moment'
import styles from './index.less'

const getTag = (record) => {
  let status = <Tag color="grey">{record.status.toUpperCase()}</Tag>
  switch (record.status) {
    case 'approved': {
      status = <Tag color="green">{record.status.toUpperCase()}</Tag>
      break
    }
    case 'rejected': {
      status = <Tag color="#cf4c58">{record.status.toUpperCase()}</Tag>
      break
    }
    case 'canceled': {
      status = <Tag color="yellow">{record.status.toUpperCase()}</Tag>
      break
    }
    default: {
      status = <Tag color="grey">{record.status.toUpperCase()}</Tag>
    }
  }
  return status
}


const Detail = ({ rentRequest, dispatch }) => {
  const { data } = rentRequest

  const BackToList = () => {
    dispatch(routerRedux.push('/integration/consignment/rent-request?activeKey=1'))
  }

  if (!data.id) {
    return <Spin size="large" />
  }

  return (<div className="wrapper">
    <Row>
      <Col lg={6}>
        <div className="content-inner-zero-min-height">
          <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
          <h1>Detail Info</h1>
          <div className={styles.content}>
            <Row>
              <Col span={12}><strong>ID Permintaan Sewa</strong></Col>
              <Col span={12}><strong>BR-{moment(data.created_at).format('YYMM')}{String(data.id).padStart(8, '0')}</strong></Col>
            </Row>
            <Row>
              <Col span={12}>Status</Col>
              <Col span={12}>{data && data.status ? getTag(data) : ''}</Col>
            </Row>
            <Row>
              <Col span={12}>Tanggal Mulai</Col>
              <Col span={12}>{moment(data.start_date, 'YYYY-MM-DD').format('DD MMM YYYY')}</Col>
            </Row>
            <Row>
              <Col span={12}>Tanggal Berakhir</Col>
              <Col span={12}>{moment(data.end_date, 'YYYY-MM-DD').format('DD MMM YYYY')}</Col>
            </Row>
            <Row>
              <Col span={12}>Boxes</Col>
              <Col span={12}>{data.rentbox && data.rentbox.length > 0 ? data.rentbox.map(item => item.box.box_code).toString() : ''}</Col>
            </Row>
            <Row>
              <Col span={12}>Harga</Col>
              <Col span={12}>IDR {(data.price || '').toLocaleString()}</Col>
            </Row>
            <Row>
              <Col span={12}>Diskon</Col>
              <Col span={12}>IDR {(data.discount || '').toLocaleString()}</Col>
            </Row>
            <Row>
              <Col span={12}>Harga Final</Col>
              <Col span={12}>IDR {(data.final_price || '').toLocaleString()}</Col>
            </Row>
            <Row>
              <Col span={12}>Dibuat oleh</Col>
              <Col span={12}>{data.created ? data.created.name : ''}</Col>
            </Row>
            <Row>
              <Col span={12}>Dibuat pada</Col>
              <Col span={12}>{moment(data.created_at).format('DD-MMM-YYYY HH:mm')}</Col>
            </Row>
            <Row>
              <Col span={12}>Dipegang oleh</Col>
              <Col span={12}>{data.handled ? data.handled.name : ''}</Col>
            </Row>
            <Row>
              <Col span={12}>Dipegang pada</Col>
              <Col span={12}>{moment(data.updated_at).format('DD-MMM-YYYY HH:mm')}</Col>
            </Row>
          </div>
        </div>
      </Col>
      <Col lg={18} />
    </Row>
  </div>)
}

Detail.propTypes = {
  rentRequest: PropTypes.object
}

export default connect(({ app, rentRequest }) => ({ app, rentRequest }))(Detail)
