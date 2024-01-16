import React from 'react'
import { connect } from 'dva'
import { Card, Button, Row, Col, Modal } from 'antd'
import { routerRedux } from 'dva/router'
import { BasicReport } from 'components'
// import k3martLogo from '../../../../../public/k3mart-text-logo.png'
import List from './List'
import ListTransferOut from './ListTransferOut'
import './index.css'

const columnProps = {
  md: 12,
  lg: 6
}

const DeliveryOrderDetail = ({ dispatch, deliveryOrder }) => {
  const { listTransferOut, currentItem } = deliveryOrder
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
    dispatch(routerRedux.push(`/delivery-order-packer/${currentItem.id}`))
  }

  // const templatePrint = () => {
  //   const printDate = () => {
  //     const parsedDate = new Date()
  //     const options = {
  //       weekday: 'long',
  //       year: 'numeric',
  //       month: 'numeric',
  //       day: 'numeric',
  //       hour: 'numeric',
  //       minute: 'numeric',
  //       hour12: false,
  //       timeZone: 'Asia/Jakarta' // Set the time zone to Jakarta (GMT+7)
  //     }
  //     return parsedDate.toLocaleDateString('id-ID', options)
  //   }

  //   const totalQty = () => {
  //     const data = currentItem && currentItem.deliveryOrderDetail
  //     const totalQty = data.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
  //     return totalQty
  //   }

  //   let template = [
  //     {
  //       alignment: 'two',
  //       text: '',
  //       rightText: ''
  //     },
  //     {
  //       alignment: 'center',
  //       text: 'Delivery Order',
  //       rightText: ''
  //     },
  //     {
  //       alignment: 'center',
  //       text: `Ref: ${currentItem.transNo}`,
  //       rightText: ''
  //     },
  //     {
  //       alignment: 'center',
  //       text: `Description: ${currentItem.description}`,
  //       rightText: ''
  //     },
  //     {
  //       alignment: 'center',
  //       text: `Store: ${currentItem.storeName} ke ${currentItem.storeNameReceiver}`,
  //       rightText: ''
  //     },
  //     {
  //       alignment: 'center',
  //       text: printDate(),
  //       rightText: ''
  //     },
  //     {
  //       alignment: 'line',
  //       text: ''
  //     }
  //   ]

  //   const pushProductToTemplate = () => {
  //     let data = currentItem && currentItem.deliveryOrderDetail
  //     for (let key in data) {
  //       let item = data[key]
  //       template.push(
  //         {
  //           alignment: 'two',
  //           text: item.productName,
  //           rightText: ''
  //         },
  //         {
  //           alignment: 'two',
  //           text: `qty: ${item.qty}`,
  //           rightText: item.productCode
  //         })
  //     }
  //   }

  //   const pushFooterToTemplate = () => {
  //     let arr = [
  //       {
  //         alignment: 'line',
  //         text: ''
  //       },
  //       {
  //         alignment: 'two',
  //         text: 'Total Item:',
  //         rightText: totalQty()
  //       },
  //       {
  //         alignment: 'line',
  //         text: ''
  //       },
  //       {
  //         alignment: 'two',
  //         text: 'Picking By',
  //         rightText: 'Staging By'
  //       },
  //       {
  //         alignment: 'two',
  //         text: '',
  //         rightText: ''
  //       },
  //       {
  //         alignment: 'two',
  //         text: '',
  //         rightText: ''
  //       },
  //       {
  //         alignment: 'two',
  //         text: '',
  //         rightText: ''
  //       },
  //       {
  //         alignment: 'two',
  //         text: '',
  //         rightText: ''
  //       },
  //       {
  //         alignment: 'two',
  //         text: 'ttd',
  //         rightText: 'ttd'
  //       },
  //       {
  //         alignment: 'two',
  //         text: 'nama staff',
  //         rightText: 'nama staff'
  //       },
  //       {
  //         alignment: 'line',
  //         text: ''
  //       },
  //       {
  //         alignment: 'two',
  //         text: '',
  //         rightText: ''
  //       },
  //       {
  //         alignment: 'two',
  //         text: '',
  //         rightText: ''
  //       },
  //       {
  //         alignment: 'two',
  //         text: '',
  //         rightText: ''
  //       }
  //     ]
  //     for (let key in arr) {
  //       let item = arr[key]
  //       template.push(item)
  //     }
  //   }
  //   pushProductToTemplate()
  //   pushFooterToTemplate()

  //   return template
  // }

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

  const totalQty = () => {
    const data = currentItem && currentItem.deliveryOrderDetail
    const totalQty = data.reduce((cnt, o) => cnt + parseFloat(o.qty), 0)
    return totalQty
  }

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

  // const printA4 = () => {
  //   return (
  //     <div>
  //       <div className="grid-container">
  //         {/* <!-- Headlines --> */}
  //         <div className="full-span center grid-item">Delivery Order</div>
  //         <div className="grid-item">Ref:</div>
  //         <div className="full-span center k">${currentItem.transNo}</div>
  //         <div className="grid-item">Description:</div>
  //         <div className="full-span center grid-item">${currentItem.description}</div>
  //         <div className="grid-item">Store:</div>
  //         <div className="full-span center grid-item">${currentItem.storeName} ke ${currentItem.storeNameReceiver}</div>
  //         <div className="grid-item">Date:</div>
  //         <div className="full-span center grid-item">${printDate()}</div>
  //         <div className="line" />

  //         {/* <!-- Product Data --> */}
  //         {currentItem.deliveryOrderDetail && currentItem.deliveryOrderDetail.length > 0
  //           && currentItem.deliveryOrderDetail.map((item) => {
  //             return (
  //               <div>
  //                 <div className="full-span grid-item">${item.productName}</div>
  //                 <div className="grid-item">qty:</div>
  //                 <div className="grid-item right-align">${item.qty}</div>
  //                 <div className="full-span grid-item right-align">${item.productCode}</div>
  //               </div>
  //             )
  //           })}

  //         {/* <!-- Line --> */}
  //         <div className="line" />

  //         {/* <!-- Total Item --> */}
  //         <div className="grid-item">Total Item:</div>
  //         <div className="full-span grid-item right-align">${totalQty()}</div>

  //         {/* <!-- Line --> */}
  //         <div className="line" />

  //         {/* <!-- Picking By and Staging By --> */}
  //         <div className="grid-item">Picking By</div>
  //         <div className="full-span grid-item right-align">Staging By</div>

  //         {/* <!-- Signature --> */}
  //         <div className="grid-item">ttd</div>
  //         <div className="full-span grid-item right-align">ttd</div>
  //         <div className="grid-item">nama staff</div>
  //         <div className="full-span grid-item right-align">nama staff</div>

  //         {/* <!-- Line --> */}
  //         <div className="line" />
  //       </div>
  //     </div>
  //   )
  // }

  const generatePDFContent = () => {
    const content = [
      [
        { text: 'Delivery Order', colSpan: 6, style: { alignment: 'center', bold: true, fontSize: 18, margin: [0, 0, 0, 10] } }
      ],
      [{ text: 'Ref:', style: { fontSize: 12 } }, '', { text: currentItem.transNo, colSpan: 4, style: { fontSize: 12, alignment: 'center' } }, ''],
      [{ text: 'Description:', style: { fontSize: 12 } }, '', { text: currentItem.description, colSpan: 4, style: { fontSize: 12, alignment: 'center' } }, ''],
      [{ text: 'Store:', style: { fontSize: 12 } }, '', { text: `${currentItem.storeName} ke ${currentItem.storeNameReceiver}`, colSpan: 4, style: { fontSize: 12, alignment: 'center' } }, ''],
      [{ text: 'Date:', style: { fontSize: 12 } }, '', { text: printDate(), colSpan: 4, style: { fontSize: 12, alignment: 'center' } }, ''],
      [{ canvas: [{ type: 'line', x1: 0, y1: 5, x2: 500, y2: 5 }] }],
      ...currentItem.deliveryOrderDetail.map(item => [
        { text: item.productName, colSpan: 6, style: { fontSize: 12 } },
        { text: 'qty:', style: { fontSize: 12 } },
        { text: item.qty, style: { fontSize: 12, alignment: 'right' } },
        { text: item.productCode, colSpan: 4, style: { fontSize: 12, alignment: 'right' } }
      ]),
      [{ canvas: [{ type: 'line', x1: 0, y1: 5, x2: 500, y2: 5 }] }],
      [{ text: 'Total Item:', style: { fontSize: 12 } }, '', { text: totalQty(), colSpan: 4, style: { fontSize: 12, alignment: 'right' } }, ''],
      [{ canvas: [{ type: 'line', x1: 0, y1: 5, x2: 500, y2: 5 }] }],
      [{ text: 'Picking By', style: { fontSize: 12 } }, '', { text: 'Staging By', colSpan: 4, style: { fontSize: 12, alignment: 'right' } }, ''],
      [{ text: 'ttd', style: { fontSize: 12 } }, '', { text: 'ttd', colSpan: 4, style: { fontSize: 12, alignment: 'right' } }, ''],
      [{ text: 'nama staff', style: { fontSize: 12 } }, '', { text: 'nama staff', colSpan: 4, style: { fontSize: 12, alignment: 'right' } }, ''],
      [{ canvas: [{ type: 'line', x1: 0, y1: 5, x2: 500, y2: 5 }] }]
    ]

    return content
  }

  const printDO = () => {
    Modal.confirm({
      title: 'Print Delivery Order?',
      content: '',
      onOk () {
        const tableHeader = [
          [
            { fontSize: 12, text: 'NO', style: 'tableHeader', alignment: 'center' }
          ]
        ]
        const tableFooter = [
          [
            { fontSize: 12, text: 'NO', style: 'tableFooter', alignment: 'center' }
          ]
        ]

        const pdfProps = {
          className: 'button-width02 button-extra-large bgcolor-blue',
          width: ['50%', '50%'],
          pageMargins: [50, 50],
          pageSize: 'A4',
          pageOrientation: 'landscape',
          layout: 'noBorder',
          tableHeader,
          tableBody: [
            [
              { fontSize: 12, text: generatePDFContent(), style: 'tableBody', alignment: 'center' }
            ]
          ],
          tableFooter,
          data: [],
          header: {},
          footer: {}
        }

        // <div style={{ backgroundColor: color.primary, width: '100%', height: 'auto' }}>
        //   <img src="/k3mart-text-logo.png" alt="" style={{ margin: '20px 0 20px 0', maxWidth: '250px' }} width="100%" height="auto" />
        // </div>
        return (
          <BasicReport {...pdfProps} />
        )

        // const newWindow = window.open('', '_blank', 'width=600,height=600')
        // const content = generatePDFContent() // Get the PDF content
        // // const content = printA4() // Get the PDF content
        // newWindow.document.write('<html><head><title>Print</title></head><body>')
        // newWindow.document.write('<div style="margin: 20px;">') // Add margin for better display
        // newWindow.document.write('<h1 style="text-align: center;">Delivery Order</h1>')
        // newWindow.document.write('<hr style="border: 1px solid black; margin-top: 0; margin-bottom: 10px;">')
        // newWindow.document.write(content)
        // // newWindow.document.write(JSON.stringify(content))
        // newWindow.document.write('</div>')
        // newWindow.document.write('</body></html>')
        // newWindow.document.close()
      }
    })
  }

  return (
    <Card>
      <div style={{ display: 'grid', gridTemplateColumns: '80% minmax(0, 20%)' }}>
        <div>
          <Row>
            <Col {...columnProps}>
              <h3>Trans No.</h3>
            </Col>
            <Col {...columnProps}>
              <strong>{currentItem.transNo}</strong>
            </Col>
          </Row>

          {/* <Row>
            <Col {...columnProps}>
              <h3>Quantity MUOUT</h3>
            </Col>
            <Col {...columnProps}>
              <h3>{currentItem.totalColly}</h3>
            </Col>
          </Row> */}

          {/* <Row>
            <Col {...columnProps}>
              <h3>Box Number</h3>
            </Col>
            <Col {...columnProps}>
              <span />
            </Col>
          </Row> */}

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
              <Button type="primary" icon="check" onClick={() => onCompleteDeliveryOrder(currentItem.id, currentItem.storeId, currentItem.transNo, currentItem.storeIdReceiver)}>
                Complete
              </Button>
            </Col>
          </Row>
        </div>

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
    </Card>
  )
}

export default connect(({ deliveryOrder, payment, loading, app }) => ({ deliveryOrder, payment, loading, app }))(DeliveryOrderDetail)
