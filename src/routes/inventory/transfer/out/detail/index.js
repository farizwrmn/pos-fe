import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Button, Modal, message } from 'antd'
import { lstorage, alertModal } from 'utils'
import moment from 'moment'
import ModalCancel from './ModalCancel'
import ModalEdit from './ModalEdit'
import PrintPDF from './PrintPDF'
import TransDetail from './TransDetail'
import styles from './index.less'

const { checkPermissionMonthTransaction } = alertModal

const Detail = ({ transferOut, transferOutDetail, dispatch, loading, app }) => {
  const { data, listDetail, disableConfirm, showPrint, modalCancelVisible, currentItem, modalEditVisible } = transferOutDetail
  const { listProducts } = transferOut
  const { user, storeInfo } = app
  const content = []
  const exception = ['id', 'storeId', 'storeIdSender', 'reference', 'employeeId', 'carNumber', 'status', 'active']
  const special = ['createdAt', 'updatedAt']
  for (let key in data[0]) {
    if ({}.hasOwnProperty.call(data[0], key)) {
      if (!exception.includes(key)) {
        if (special.includes(key)) {
          content.push(
            <div key={key} className={styles.item}>
              <div>{key}</div>
              <div>{String(moment(data[0][key]).format('LL'))}</div>
            </div>
          )
        } else {
          content.push(
            <div key={key} className={styles.item}>
              <div>{key}</div>
              <div>{String(data[0][key] !== null ? data[0][key] : '')}</div>
            </div>
          )
        }
      }
    }
  }

  const BackToList = () => {
    dispatch(routerRedux.push('/inventory/transfer/out'))
  }

  const voidTrans = () => {
    const checkPermission = checkPermissionMonthTransaction(data[0].transDate)
    if (checkPermission) {
      return
    }
    dispatch({
      type: 'transferOutDetail/updateState',
      payload: {
        modalCancelVisible: true
      }
    })
    // dispatch(routerRedux.push('/inventory/transfer/in'))
  }

  const postTrans = () => {
    dispatch({
      type: 'transferOutDetail/postTrans',
      payload: {
        data: {
          id: data[0].id,
          transNo: data[0].transNo,
          storeId: data[0].storeId
        }
      }
    })
  }

  const editTrans = () => {
    dispatch({
      type: 'transferOutDetail/editTrans',
      payload: {
        data: {
          id: data[0].id,
          transNo: data[0].transNo,
          storeId: data[0].storeId
        }
      }
    })
  }

  const printProps = {
    listItem: listProducts,
    itemPrint: data[0],
    itemHeader: data[0],
    storeInfo,
    user,
    printNo: 1
  }

  const formDetailProps = {
    dataSource: listDetail,
    editList (record) {
      if (!loading.effects['transferOutDetail/editPrice']) {
        dispatch({
          type: 'transferOutDetail/editListPrice',
          payload: {
            currentItem: record,
            modalEditVisible: true
          }
        })
      }
    }
  }

  const getProducts = (transNo) => {
    dispatch({
      type: 'transferOut/queryProducts',
      payload: {
        transNo,
        storeId: lstorage.getCurrentUserStore()
      }
    })
  }
  const getTrans = (transNo, storeId) => {
    dispatch({
      type: 'transferOut/queryByTrans',
      payload: {
        transNo,
        storeId
      }
    })
  }

  const clickPrint = () => {
    const { transNo, status, storeIdReceiver } = data[0]
    if (parseFloat(status)) {
      message.warning('Finished invoice cannot print')
      return
    }
    getProducts(transNo)
    getTrans(transNo, storeIdReceiver)
    dispatch({
      type: 'transferOutDetail/updateState',
      payload: {
        showPrint: true
      }
    })
  }

  const modalCancelProps = {
    disableConfirm,
    data,
    item: data[0],
    visible: modalCancelVisible,
    onOk (e) {
      Modal.confirm({
        title: 'Are you sure void this Invoice?',
        onOk () {
          dispatch({
            type: 'transferOut/updateState',
            payload: {
              listtransferOut: []
            }
          })
          dispatch({
            type: 'transferOutDetail/updateState',
            payload: {
              disableConfirm: true
            }
          })
          dispatch({
            type: 'transferOutDetail/voidTrans',
            payload: {
              id: data[0].id,
              transNo: data[0].transNo,
              reference: data[0].reference,
              memo: e.memo,
              storeId: lstorage.getCurrentUserStore()
            }
          })
        },
        onCancel () {
          console.log('no')
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'transferOutDetail/updateState',
        payload: {
          modalCancelVisible: false
        }
      })
    }
  }

  const modalEditProps = {
    data,
    item: currentItem,
    visible: modalEditVisible,
    title: `Edit Item ${currentItem && currentItem.productCode ? `${currentItem.productCode} - ${currentItem.productName}` : ''}`,
    onOk (item, resetFields) {
      dispatch({
        type: 'transferOutDetail/editPrice',
        payload: { data: item, resetFields }
      })
    },
    onCancel () {
      dispatch({
        type: 'transferOutDetail/updateState',
        payload: {
          currentItem: {},
          modalEditVisible: false
        }
      })
    }
  }

  return (<div className="wrapper">
    <Row>
      <Col lg={7}>
        <div className="content-inner-zero-min-height">
          <Row>
            <Col lg={12} md={12}>
              <Button type="primary" icon="rollback" onClick={() => BackToList()}>Back</Button>
            </Col>
            <Col lg={10} md={10} offset={2}>
              {!showPrint && <Button onClick={() => clickPrint()}>Print</Button>}
              {showPrint && <PrintPDF {...printProps} />}
            </Col>
          </Row>
          <h1>Invoice Info</h1>
          <div className={styles.content}>
            {content}
          </div>
        </div>
      </Col>
      <Col lg={17}>
        <div className="content-inner-zero-min-height">
          <h1>Items</h1>
          <Button type="danger" icon="delete" loading={loading.effects['transferOutDetail/queryDetail']} disabled={data.length > 0 ? !data[0].active : data[0] ? data[0].status : 1} onClick={() => voidTrans()}>Void</Button>
          {data && data[0] && !data[0].paid && <Button type="default" style={{ float: 'right' }} loading={loading.effects['transferOutDetail/queryDetail'] || loading.effects['transferOutDetail/editTrans']} disabled={loading.effects['transferOutDetail/editTrans'] || (data.length > 0 ? !data[0].active : data[0] ? data[0].status : 1)} onClick={() => editTrans()}>Get Default Price</Button>}
          {data && data[0] && !data[0].posting && !data[0].invoicing && <Button type="default" style={{ float: 'right' }} loading={loading.effects['transferOutDetail/queryDetail']} disabled={data.length > 0 ? !data[0].active : data[0] ? data[0].status : 1} onClick={() => postTrans()}>Post</Button>}
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransDetail {...formDetailProps} />
          </Row>
        </div>
      </Col>
    </Row>
    {modalEditVisible && <ModalEdit {...modalEditProps} />}
    {modalCancelVisible && <ModalCancel {...modalCancelProps} />}
  </div >)
}

Detail.propTypes = {
  transferOutDetail: PropTypes.object
}

export default connect(({ transferOut, transferOutDetail, dispatch, loading, app }) => ({ transferOut, transferOutDetail, dispatch, loading, app }))(Detail)
