import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { IMAGEURL } from 'utils/config.company'
import {
  Row,
  Col,
  Tag,
  Button,
  Spin,
  Modal
} from 'antd'
import moment from 'moment'
import styles from './index.less'
import ModalApprove from './ModalApprove'

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


const Detail = ({ loading, rentRequest, dispatch }) => {
  const {
    data,
    modalApproveVisible
  } = rentRequest

  const BackToList = () => {
    dispatch(routerRedux.push('/integration/consignment/rent-request?activeKey=1'))
  }

  if (!data.id) {
    return <Spin size="large" />
  }

  const modalApproveProps = {
    loading,
    data,
    item: data,
    visible: modalApproveVisible,
    onOk (data, reset) {
      dispatch({
        type: 'rentRequest/updateState',
        payload: {
          modalApproveVisible: false
        }
      })
      dispatch({
        type: 'rentRequest/approveRequest',
        payload: {
          data,
          reset
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'rentRequest/updateState',
        payload: {
          modalApproveVisible: false
        }
      })
    }
  }

  const voidTrans = () => {
    Modal.confirm({
      title: 'Void this request',
      content: 'Are you sure ?',
      onOk () {
        dispatch({
          type: 'rentRequest/voidRequest',
          payload: {
            data: {
              id: data.id
            }
          }
        })
      },
      onCancel () {
      }
    })
  }

  const approveTrans = () => {
    dispatch({
      type: 'rentRequest/updateState',
      payload: {
        modalApproveVisible: true
      }
    })
  }

  return (<div className="wrapper">
    <Row>
      <Col lg={12}>
        <div className="content-inner-zero-min-height">
          <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
          <h1>Detail Info</h1>
          <Button type="primary" icon="check" loading={loading.effects['rentRequest/approveRequest'] || loading.effects['rentRequest/queryDetail']} disabled={data && data.status !== 'pending'} onClick={() => approveTrans()}>Approve</Button>
          <Button type="danger" style={{ marginLeft: '20px' }} icon="delete" loading={loading.effects['rentRequest/voidRequest'] || loading.effects['rentRequest/queryDetail']} disabled={data && data.status !== 'pending'} onClick={() => voidTrans()}>Void</Button>
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
              <Col span={12}>IDR {(data.discount || '0').toLocaleString()}</Col>
            </Row>
            <Row>
              <Col span={12}>DPP</Col>
              <Col span={12}>IDR {(data.DPP || '0').toLocaleString()}</Col>
            </Row>
            <Row>
              <Col span={12}>PPN</Col>
              <Col span={12}>IDR {(data.PPN || '0').toLocaleString()}</Col>
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
            {data.payment_rule && !data.payment_rule.includes('no_image') && (
              <Row>
                <Col span={12}>Upload by Admin</Col>
                <Col span={12}>
                  {data.payment_rule ?
                    <img height="180px" src={`${IMAGEURL}/${data.payment_rule}`} alt="no_image" />
                    : null}
                </Col>
              </Row>
            )}
            {data.payment_proof && !data.payment_proof.includes('no_image') && (
              <Row>
                <Col span={12}>Upload by Vendor</Col>
                <Col span={12}>
                  {data.payment_proof ?
                    <img height="180px" src={`${IMAGEURL}/${data.payment_proof}`} alt="no_image" />
                    : null}
                </Col>
              </Row>
            )}
          </div>
        </div>
      </Col>
      <Col lg={10} />
    </Row>
    {/* {modalCancelVisible && <ModalCancel {...modalCancelProps} />} */}
    {modalApproveVisible && <ModalApprove {...modalApproveProps} />}
  </div>)
}

Detail.propTypes = {
  rentRequest: PropTypes.object,
  loading: PropTypes.object
}

export default connect(({ app, loading, rentRequest }) => ({ app, loading, rentRequest }))(Detail)
