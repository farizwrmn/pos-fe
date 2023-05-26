/* eslint-disable no-return-assign */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import { Row, Col, Button, Modal, message } from 'antd'
import { lstorage, alertModal } from 'utils'
import moment from 'moment'
import FormAccounting from 'components/accounting/FormAccounting'
import { prefix } from 'utils/config.main'
import PrintShelf from '../../../../master/product/printSticker/PrintShelf'
import PrintAvancedShelf from '../../../../master/product/printSticker/PrintAvancedShelf'
import ModalCancel from './ModalCancel'
import PrintPDF from './PrintPDF'
import TransDetail from './TransDetail'
import styles from './index.less'

const { checkPermissionMonthTransaction } = alertModal

class Detail extends Component {
  render () {
    const { transferIn, transferInDetail, dispatch, app } = this.props
    const { data, listDetail, disableConfirm, showPrint, modalCancelVisible, listAccounting } = transferInDetail
    const { listProducts, printMode, selectedRowKeys } = transferIn
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
      dispatch(routerRedux.push('/inventory/transfer/in'))
    }

    const voidTrans = () => {
      const checkPermission = checkPermissionMonthTransaction(data[0].transDate)
      if (checkPermission) {
        return
      }
      dispatch({
        type: 'transferInDetail/updateState',
        payload: {
          modalCancelVisible: true
        }
      })
      // dispatch(routerRedux.push('/inventory/transfer/in'))
    }

    const printProps = {
      listItem: listProducts,
      itemPrint: data[0],
      itemHeader: data[0],
      storeInfo,
      user,
      printNo: 1
    }

    const rowSelection = {
      onChange: (selectedRowKeys) => {
        dispatch({
          type: 'transferIn/editSelected',
          payload: {
            selectedRowKeys,
            source: 'transferInDetail',
            resetChild: this.clickChild,
            resetChildShelf: this.clickChildShelf
          }
        })
      }
    }

    const formDetailProps = {
      dataSource: listDetail
    }

    if (printMode === 'select') {
      formDetailProps.selectedRowKeys = selectedRowKeys
      formDetailProps.rowSelection = rowSelection
    }

    const getProducts = (transNo) => {
      dispatch({
        type: 'transferIn/queryProducts',
        payload: {
          transNo
        }
      })
    }
    const getTrans = (transNo, storeId) => {
      dispatch({
        type: 'transferIn/queryByTrans',
        payload: {
          transNo,
          storeId
        }
      })
    }

    const clickPrint = () => {
      const { transNo, storeIdReceiver } = data[0]
      getProducts(transNo)
      getTrans(transNo, storeIdReceiver)
      dispatch({
        type: 'transferInDetail/updateState',
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
            const startPeriod = localStorage.getItem(`${prefix}store`) ? JSON.parse(localStorage.getItem(`${prefix}store`)).startPeriod : {}
            const formattedStartPeriod = moment(startPeriod).format('YYYY-MM-DD')
            if (moment(data[0].transDate).format('YYYY-MM-DD') >= formattedStartPeriod) {
              dispatch({
                type: 'transferIn/updateState',
                payload: {
                  listTransferIn: []
                }
              })
              dispatch({
                type: 'transferInDetail/updateState',
                payload: {
                  disableConfirm: true
                }
              })
              dispatch({
                type: 'transferInDetail/voidTrans',
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
          type: 'transferInDetail/updateState',
          payload: {
            modalCancelVisible: false
          }
        })
      }
    }

    const onPrintBarcode = () => {
      message.info('Choose product to print barcode')
      dispatch({
        type: 'transferIn/updateState',
        payload: {
          printMode: 'select'
        }
      })
    }

    let listSticker = []

    const printStickerProps = {
      aliases: {
        check1: true,
        alias1: 'RETAIL PRICE',
        price1: 'sellPrice'
      },
      user,
      storeInfo
    }

    if (listDetail && listDetail.length > 0 && selectedRowKeys && selectedRowKeys.length > 0) {
      listSticker = listDetail.filter(filtered => selectedRowKeys.includes(filtered.no)).map((item) => {
        return ({
          info: item,
          name: item.productName,
          qty: 1
        })
      })
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
                {(user.permissions.role === 'OWN'
                  || user.permissions.role === 'SPR'
                  || user.permissions.role === 'HPC'
                  || user.permissions.role === 'SPC'
                  || user.permissions.role === 'HFC'
                  || user.permissions.role === 'SFC') && (
                    <div>
                      {!showPrint && <Button onClick={() => clickPrint()}>Print</Button>}
                      {showPrint && <PrintPDF {...printProps} />}
                    </div>
                  )}
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
            {(user.permissions.role === 'OWN'
              || user.permissions.role === 'SPR'
              || user.permissions.role === 'HPC'
              || user.permissions.role === 'SPC'
              || user.permissions.role === 'HFC'
              || user.permissions.role === 'SFC') && (
                <Button type="danger" icon="delete" disabled={data.length > 0 ? !data[0].active : 1} onClick={() => voidTrans()}>Void</Button>
              )}
            {printMode === 'default' && <Button type="primary" style={{ marginLeft: '10px' }} icon="barcode" disabled={data.length > 0 ? !data[0].active : 1} onClick={() => onPrintBarcode()}>Print Barcode</Button>}
            {selectedRowKeys && selectedRowKeys.length > 0 && (
              <span style={{ marginLeft: '10px' }}>
                <PrintShelf setClick={click => this.clickChildShelf = click} stickers={listSticker} user={user} {...printStickerProps} />
                <PrintAvancedShelf setClick={click => this.clickChild = click} stickers={listSticker} user={user} {...printStickerProps} />
              </span>
            )}
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
                  <FormAccounting listAccounting={listAccounting} />
                </Row>
              </div>
            )}
        </Col>
      </Row>
      {modalCancelVisible && <ModalCancel {...modalCancelProps} />}
    </div>)
  }
}

Detail.propTypes = {
  transferInDetail: PropTypes.object
}

export default connect(({ transferIn, transferInDetail, dispatch, loading, app }) => ({ transferIn, transferInDetail, dispatch, loading, app }))(Detail)
