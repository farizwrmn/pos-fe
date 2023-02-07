import React from 'react'
import { connect } from 'dva'
import { Button, Col, Modal, Row, Tag } from 'antd'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import styles from './index.less'
import List from './List'

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


function Detail ({ consignmentStockFlow, dispatch }) {
  const {
    currentItem
  } = consignmentStockFlow

  const BackToList = () => {
    dispatch(routerRedux.push('/integration/consignment/stock-flow?activeKey=0'))
  }

  const approveTrans = () => {
    dispatch({
      type: 'consignmentStockFlow/approve',
      payload: {
        id: currentItem.id
      }
    })
  }

  const voidTrans = () => {
    dispatch({
      type: 'consignmentStockFlow/reject',
      payload: {
        id: currentItem.id
      }
    })
  }

  const showConfirmation = (type) => {
    Modal.confirm({
      title: type,
      content: 'apakah kamu yakin?',
      onOk () {
        if (type === 'approve') {
          approveTrans()
        } else {
          voidTrans()
        }
      }
    })
  }

  const listProps = {
    dataSource: currentItem.product
  }

  return (
    <div className="wrapper">
      <Row>
        <Col lg={12}>
          <div className="content-inner-zero-min-height">
            <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
            <h1>Detail</h1>
            <Button type="primary" icon="check" disabled={currentItem && currentItem.status !== 'pending'} onClick={() => showConfirmation('approve')}>Approve</Button>
            <Button type="danger" style={{ marginLeft: '20px' }} icon="delete" disabled={currentItem && currentItem.status !== 'pending'} onClick={() => showConfirmation('void')}>Void</Button>
            <div className={styles.content}>
              <Row>
                <Col span={12}><strong>ID Permintaan Mutasi</strong></Col>
                <Col span={12}><strong>SF-{moment(currentItem.created_at).format('YYMM')}{String(currentItem.id).padStart(8, '0')}</strong></Col>
              </Row>
              <Row>
                <Col span={12}>Tipe Permintaan</Col>
                <Col span={12}>{currentItem && currentItem.request_type === 1 ? <Tag color="green">STOCK IN</Tag> : <Tag color="red">STOCK OUT</Tag>}</Col>
              </Row>
              <Row>
                <Col span={12}>Status</Col>
                <Col span={12}>{currentItem && currentItem.status ? getTag(currentItem) : ''}</Col>
              </Row>
              <Row>
                <Col span={12}>Tanggal Permintaan</Col>
                <Col span={12}>{currentItem && currentItem.createdAt ? moment(currentItem.createdAt).format('DD MMM YYYY, HH:mm:SS') : '-'}</Col>
              </Row>
              <Row>
                <Col span={12}>Vendor</Col>
                <Col span={12}>{currentItem && (currentItem.vendorName || '-')}</Col>
              </Row>
              <Row>
                <Col span={12}>Catatan Vendor</Col>
                <Col span={12}>{currentItem && (currentItem.note || '-')}</Col>
              </Row>
              <Row>
                <Col span={12}>Catatan Office</Col>
                <Col span={12}>{currentItem && (currentItem.internal_note || '-')}</Col>
              </Row>
              <Row>
                <Col span={12}>Dipegang oleh</Col>
                <Col span={12}>{currentItem && (currentItem.adminName || '-')}</Col>
              </Row>
              <Row>
                <Col span={12}>Dipegang pada</Col>
                <Col span={12}>{currentItem && currentItem.updated_at ? moment(currentItem.updated_at).format('DD MMM YYYY, HH:mm:dd') : '-'}</Col>
              </Row>

              <List {...listProps} />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default connect(({
  consignmentStockFlow,
  dispatch
}) => ({ consignmentStockFlow, dispatch }))(Detail)
