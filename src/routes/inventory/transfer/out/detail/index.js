import React from 'react'
import uniq from 'lodash/uniq'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Row, Col, Button, Modal } from 'antd'
import { lstorage, alertModal } from 'utils'
import moment from 'moment'
import FormAccounting from 'components/accounting/FormAccounting'
import { prefix } from 'utils/config.main'
import { routerRedux } from 'dva/router'
import ModalCancel from './ModalCancel'
import ModalEdit from './ModalEdit'
import PrintPDF from './PrintPDF'
import PrintPDFv2 from './PrintPDFv2'
import TransDetail from './TransDetail'
import styles from './index.less'

const { checkPermissionMonthTransaction } = alertModal

const Detail = ({ transferOut, transferOutDetail, location, dispatch, loading, app }) => {
  const { data, listAccounting, listDetail, disableConfirm, showPrint, modalCancelVisible, currentItem, modalEditVisible } = transferOutDetail
  const { deliveryOrderNo } = location.query
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
    dispatch(routerRedux.push('/inventory/transfer/out?activeKey=1'))
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
          deliveryOrderNo,
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
          deliveryOrderNo,
          transNo: deliveryOrderNo ? uniq(listDetail.map(item => item.transNo)) : data[0].transNo,
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

  let defaultRole = (lstorage.getStorageKey('udi')[2] || '')

  const formDetailProps = {
    dataSource: listDetail,
    editList (record) {
      if (defaultRole === 'CSH' || defaultRole === 'HKS') return
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

  const getTrans = (transNo, storeId) => {
    dispatch({
      type: 'transferOut/queryByTrans',
      payload: {
        transNo,
        storeId,
        type: 'detail'
      }
    })
  }

  const clickPrint = () => {
    const { transNo, storeId } = data[0]
    getTrans(transNo, storeId)
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
          const startPeriod = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)).startPeriod : {}
          const formattedStartPeriod = moment(startPeriod).format('YYYY-MM-DD')
          if (moment(data[0].transDate).format('YYYY-MM-DD') >= formattedStartPeriod) {
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
          } else {
            Modal.warning({
              title: 'Can`t Void this Invoice',
              content: 'has been Closed'
            })
          }
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

  const formProps = {
    data,
    listAccounting
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
              {!showPrint && <Button onClick={() => clickPrint()} disabled={loading.effects['transferOut/queryTransferOut'] || loading.effects['transferOut/queryProducts'] || loading.effects['transferOut/queryByTrans']}>Print</Button>}
              {showPrint && <PrintPDF {...printProps} />}
              {showPrint && <PrintPDFv2 {...printProps} />}
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
          {defaultRole !== 'CSH' && defaultRole !== 'HKS' && <Button type="danger" icon="delete" loading={loading.effects['transferOutDetail/queryDetail']} disabled={data.length > 0 ? !data[0].active : data[0] ? data[0].status : 1} onClick={() => voidTrans()}>Void</Button>}
          {defaultRole !== 'CSH' && defaultRole !== 'HKS' && data && data[0] && !data[0].paid && <Button type="default" style={{ float: 'right' }} loading={loading.effects['transferOutDetail/queryDetail'] || loading.effects['transferOutDetail/editTrans']} disabled={loading.effects['transferOutDetail/editTrans'] || (data.length > 0 ? !data[0].active : data[0] ? data[0].status : 1)} onClick={() => editTrans()}>Get Default Price</Button>}
          {defaultRole !== 'CSH' && defaultRole !== 'HKS' && data && data[0] && !data[0].posting && !data[0].invoicing && <Button type="default" style={{ float: 'right' }} loading={loading.effects['transferOutDetail/queryDetail']} disabled={data.length > 0 ? !data[0].active : data[0] ? data[0].status : 1} onClick={() => postTrans()}>Post</Button>}
          <Row style={{ padding: '10px', margin: '4px' }}>
            <TransDetail {...formDetailProps} />
          </Row>
        </div>

        {(user.permissions.role === 'OWN'
          || user.permissions.role === 'SPR'
          || user.permissions.role === 'HPC'
          || user.permissions.role === 'SPC'
          || user.permissions.role === 'HFC'
          || user.permissions.role === 'SFC') && (
            <div className="content-inner-zero-min-height">
              <h1>Accounting Journal</h1>
              <Row style={{ padding: '10px', margin: '4px' }}>
                <FormAccounting {...formProps} />
              </Row>
            </div>
          )}
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
