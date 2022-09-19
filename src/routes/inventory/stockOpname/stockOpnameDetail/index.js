import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import {
  Modal,
  Row,
  Col,
  Tag,
  Spin,
  Button
} from 'antd'
import io from 'socket.io-client'
import { APISOCKET } from 'utils/config.company'
import TransDetail from './TransDetail'
import styles from './index.less'

const options = {
  upgrade: true,
  transports: ['websocket'],
  pingTimeout: 40000,
  pingInterval: 4000
}

const socket = io(APISOCKET, options)


class Detail extends Component {
  componentDidMount () {
    this.setSocket()
  }

  componentWillUnmount () {
    const { stockOpname } = this.props
    const { detailData } = stockOpname
    if (detailData && detailData.id) {
      socket.off(`stock-opname/${detailData.id}`)
    }
  }

  setSocket = () => {
    const { stockOpname } = this.props
    const { detailData } = stockOpname
    console.log('setSocket', detailData.id)
    if (detailData && detailData.id) {
      socket.on(`stock-opname/${detailData.id}`, this.handleData)
    }
  }

  handleData = () => {
    const { dispatch, stockOpname } = this.props
    const { detailData } = stockOpname
    dispatch({
      type: 'stockOpname/queryDetailData',
      payload: {
        page: 1,
        pageSize: 40,
        status: ['DIFF', 'CONFLICT'],
        order: '-updatedAt',
        transId: detailData.id,
        storeId: detailData.storeId,
        batchId: detailData.activeBatch.id
      }
    })
  }

  render () {
    const { stockOpname, dispatch } = this.props
    const { listDetail, detailData, detailPagination } = stockOpname
    const content = []
    for (let key in detailData) {
      if ({}.hasOwnProperty.call(detailData, key)) {
        if (key !== 'policeNoId' && key !== 'storeId' && key !== 'id' && key !== 'memberId') {
          content.push(
            <div key={key} className={styles.item}>
              <div>{key}</div>
              <div>{String(detailData[key])}</div>
            </div>
          )
        }
      }
    }

    const getTag = (record) => {
      if (record.status === 1) {
        return <Tag color="green">Finish</Tag>
      }
      return <Tag color="yellow">In Progress</Tag>
    }

    if (!detailData.id) {
      return <Spin size="large" />
    }

    const BackToList = () => {
      dispatch(routerRedux.push('/stock-opname?activeKey=0'))
    }

    const formDetailProps = {
      listDetail,
      dispatch,
      detailData,
      pagination: detailPagination
    }

    const onBatch2 = () => {
      Modal.confirm({
        title: 'Finish batch',
        content: 'This process cannot be undone',
        onOk () {

        },
        onCancel () {

        }
      })
    }

    return (<div className="wrapper">
      <Row>
        <Col lg={8}>
          <div className="content-inner-zero-min-height">
            <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
            <h1>Detail Info</h1>
            <div className={styles.content}>
              <Row>
                <Col span={12}><strong>STORE</strong></Col>
                <Col span={12}><strong>{detailData && detailData.store ? detailData.store.storeName : ''}</strong></Col>
              </Row>
              <Row>
                <Col span={12}>BATCH NUMBER</Col>
                <Col span={12}>{`Phase ${detailData && detailData.activeBatch ? detailData.activeBatch.batchNumber : ''}`}</Col>
              </Row>
              <Row>
                <Col span={12}>Status</Col>
                <Col span={12}>{getTag(detailData)}</Col>
              </Row>
            </div>
          </div>
        </Col>
        <Col lg={24}>
          <div className="content-inner-zero-min-height">
            <Button type="primary" icon="save" onClick={() => onBatch2()}>Save</Button>
            <h1>Items</h1>
            <Row style={{ padding: '10px', margin: '4px' }}>
              <TransDetail {...formDetailProps} />
            </Row>
          </div>
        </Col>
      </Row>
    </div>)
  }
}

Detail.propTypes = {
  loading: PropTypes.object,
  app: PropTypes.object,
  stockOpname: PropTypes.object
}

export default connect(({ loading, app, stockOpname }) => ({ loading, app, stockOpname }))(Detail)
