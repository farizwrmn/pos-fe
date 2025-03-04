import React from 'react'
import { connect } from 'dva'
import { Button, Row, Col, Modal, Card } from 'antd'
import { routerRedux } from 'dva/router'
import { lstorage } from 'utils'
// import k3martLogo from '../../../../../public/k3mart-text-logo.png'
import List from './List'
import ListTransferOut from './ListTransferOut'
import PrintPDF from './PrintPDF'
import ModalBoxNumber from './ModalBoxNumber'
import './index.css'

const columnProps = {
  md: 12,
  lg: 6
}

const DeliveryOrderDetail = ({ loading, dispatch, app, deliveryOrder }) => {
  const { listTransferOut, currentItem, latestBoxNumber, modalBoxNumberVisible } = deliveryOrder
  const { user } = app

  const listProps = {
    dataSource: currentItem && currentItem.deliveryOrderDetail
  }

  const listTransferOutProps = {
    dataSource: listTransferOut && listTransferOut.length > 0 ? listTransferOut : [],
    toDetail: (record) => {
      dispatch(routerRedux.push(`/inventory/transfer/out/${record.transNo}`))
    }
  }

  const startScan = () => {
    dispatch({
      type: 'deliveryOrder/showBoxNumberModal',
      payload: {
        detail: currentItem
      }
    })
    // dispatch(routerRedux.push(`/delivery-order-packer/${currentItem.id}`))
  }

  const templatePrint = () => {
    const printDate = () => {
      const parsedDate = new Date()
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
        timeZone: 'Asia/Jakarta' // Set the time zone to Jakarta (GMT+7)
      }
      return parsedDate.toLocaleDateString('id-ID', options)
    }

    const totalQty = () => {
      const data = currentItem && currentItem.deliveryOrderDetail
      const totalQty = data.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
      return totalQty
    }

    let template = [
      {
        alignment: 'two',
        text: '',
        rightText: ''
      },
      {
        alignment: 'center',
        text: 'Delivery Order',
        rightText: ''
      },
      {
        alignment: 'center',
        text: `Ref: ${currentItem.transNo}`,
        rightText: ''
      },
      {
        alignment: 'center',
        text: `Description: ${currentItem.description}`,
        rightText: ''
      },
      {
        alignment: 'center',
        text: `Store: ${currentItem.storeName} ke ${currentItem.storeNameReceiver}`,
        rightText: ''
      },
      {
        alignment: 'center',
        text: printDate(),
        rightText: ''
      },
      {
        alignment: 'line',
        text: ''
      }
    ]

    const pushProductToTemplate = () => {
      let data = currentItem && currentItem.deliveryOrderDetail
      for (let key in data) {
        let item = data[key]
        template.push(
          {
            alignment: 'two',
            text: item.productName,
            rightText: ''
          },
          {
            alignment: 'two',
            text: `qty: ${item.qty}`,
            rightText: item.productCode
          })
      }
    }

    const pushFooterToTemplate = () => {
      let arr = [
        {
          alignment: 'line',
          text: ''
        },
        {
          alignment: 'two',
          text: 'Total Item:',
          rightText: totalQty()
        },
        {
          alignment: 'line',
          text: ''
        },
        {
          alignment: 'two',
          text: 'Picking By',
          rightText: 'Staging By'
        },
        {
          alignment: 'two',
          text: '',
          rightText: ''
        },
        {
          alignment: 'two',
          text: '',
          rightText: ''
        },
        {
          alignment: 'two',
          text: '',
          rightText: ''
        },
        {
          alignment: 'two',
          text: '',
          rightText: ''
        },
        {
          alignment: 'two',
          text: 'ttd',
          rightText: 'ttd'
        },
        {
          alignment: 'two',
          text: 'nama staff',
          rightText: 'nama staff'
        },
        {
          alignment: 'line',
          text: ''
        },
        {
          alignment: 'two',
          text: '',
          rightText: ''
        },
        {
          alignment: 'two',
          text: '',
          rightText: ''
        },
        {
          alignment: 'two',
          text: '',
          rightText: ''
        }
      ]
      for (let key in arr) {
        let item = arr[key]
        template.push(item)
      }
    }
    pushProductToTemplate()
    pushFooterToTemplate()

    dispatch({
      type: 'deliveryOrder/directPrinting',
      payload: template
    })
  }

  const onCompleteDeliveryOrder = (id, storeId, transNo, storeIdReceiver) => {
    Modal.confirm({
      title: 'Complete delivery order',
      content: 'Are you sure ?',
      onOk () {
        dispatch({
          type: 'deliveryOrder/updateAsFinished',
          payload: {
            id,
            storeId,
            transNo,
            storeIdReceiver
          }
        })
      }
    })
  }

  const printDO = () => {
    Modal.confirm({
      title: 'Print Delivery Order?',
      content: '',
      onOk () {
        templatePrint()
      }
    })
  }

  const printProps = {
    listTrans: currentItem && currentItem.deliveryOrderDetail ? currentItem.deliveryOrderDetail : [],
    itemPrint: currentItem,
    user
  }

  const modalBoxNumberProps = {
    visible: modalBoxNumberVisible,
    boxNumber: latestBoxNumber,
    loading,
    onOk (data) {
      Modal.confirm({
        title: 'Start Scanning',
        content: 'Are you sure ?',
        onOk () {
          dispatch({
            type: 'deliveryOrder/printBoxNumber',
            payload: {
              boxNumber: data.boxNumber,
              detail: currentItem
            }
          })
        }
      })
    },
    onCancel () {
      dispatch({
        type: 'deliveryOrder/updateState',
        payload: {
          modalBoxNumberVisible: false,
          latestBoxNumber: 1
        }
      })
    }
  }

  if (currentItem && currentItem.storeId !== lstorage.getCurrentUserStore()) {
    return (
      <div className="content-inner">
        Please move to store {currentItem.storeName}
      </div>
    )
  }

  return (
    <Card>
      {currentItem && currentItem.id && <PrintPDF name="Print PDF" {...printProps} />}
      <div style={{ display: 'grid', gridTemplateColumns: '80% minmax(0, 20%)' }}>
        {modalBoxNumberProps.visible && <ModalBoxNumber {...modalBoxNumberProps} />}
        <div>
          <Row>
            <Col {...columnProps}>
              <h3>Trans No.</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.transNo}</h3>
            </Col>
          </Row>

          <Row>
            <Col {...columnProps}>
              <h3>From</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.storeName}</h3>
            </Col>
          </Row>

          <Row>
            <Col {...columnProps}>
              <h3>To</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.storeNameReceiver}</h3>
            </Col>
          </Row>

          <Row>
            <Col {...columnProps}>
              <h3>Date</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.transDate}</h3>
            </Col>
          </Row>

          {/* <Row>
            <Col {...columnProps}>
              <h3>Duration</h3>
            </Col>
            <Col {...columnProps}>
              <span />
            </Col>
          </Row> */}

          <Row>
            <Col {...columnProps}>
              <h3>Expired DO</h3>
            </Col>
            <Col {...columnProps}>
              <span />
            </Col>
          </Row>

          <Row>
            <Col {...columnProps}>
              <h3>Description</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.description}</h3>
            </Col>
          </Row>
          <Row>
            <Col {...columnProps}>
              <h3>Complete</h3>
            </Col>
            <Col {...columnProps}>
              <Button disabled={(currentItem && currentItem.status) || loading.effects['deliveryOrder/updateAsFinished']} type="primary" icon="check" onClick={() => onCompleteDeliveryOrder(currentItem.id, currentItem.storeId, currentItem.transNo, currentItem.storeIdReceiver)}>
                Complete
              </Button>
            </Col>
          </Row>

          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ margin: '0.5em' }}>
              <Button type="default" onClick={() => printDO()}>
                Print For Picking
              </Button>
            </div>
            <div style={{ margin: '0.5em' }}>
              <Button type="primary" onClick={() => startScan()}>
                Start Scan
              </Button>
            </div>
          </div>

          <Row style={{ marginTop: '1em' }}>
            <Col>
              <List {...listProps} />
            </Col>
          </Row>
          <Row style={{ marginTop: '1em' }}>
            <Col>
              <ListTransferOut {...listTransferOutProps} />
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  )
}

export default connect(({ deliveryOrder, payment, loading, app }) => ({ deliveryOrder, payment, loading, app }))(DeliveryOrderDetail)
