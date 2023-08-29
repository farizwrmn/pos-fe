import { Button, Col, Icon, Modal, Row } from 'antd'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const ModalPrint = ({
  loading,
  PDFModalProps,
  printProps,
  mode,
  list,
  getAllData,
  changed,
  listPrintAll
}) => {
  let buttonClickPDF = (changed && listPrintAll.length) ? (<PrintPDF dataSource={listPrintAll} name="Print All Data" {...printProps} />) : (<Button type="default" disabled={loading.effects['xenditRecon/queryAllTransactionDetail']} size="default" onClick={getAllData} loading={loading.effects['xenditRecon/queryAllTransactionDetail']}><Icon type="file-pdf" />Get All Data</Button>)
  let buttonClickXLS = (changed && listPrintAll.length) ? (<PrintXLS dataSource={listPrintAll} name="Print All Data" {...printProps} />) : (<Button type="default" disabled={loading.effects['xenditRecon/queryAllTransactionDetail']} size="default" onClick={getAllData} loading={loading.effects['xenditRecon/queryAllTransactionDetail']}><Icon type="file-pdf" />Get All Data</Button>)
  let notification = (changed && listPrintAll.length) ? "Click 'Print All Data' to print!" : "Click 'Get All Data' to get all data!"

  let printMode
  if (mode === 'pdf') {
    printMode = (
      <Row>
        <Col md={8}>
          {buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
        </Col>
        <Col md={8}>
          <PrintPDF dataSource={list} name="Print Current Page" {...printProps} />
        </Col>
      </Row>
    )
  } else {
    printMode = (<Row>
      <Col md={8}>
        {buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
      </Col>
      <Col md={8}>
        <PrintXLS dataSource={list} name="Print Current Page" {...printProps} />
      </Col>
    </Row>)
  }

  return (
    <div>
      <Modal {...PDFModalProps}>
        {printMode}
      </Modal>
    </div>
  )
}

export default ModalPrint
