import { Col, Modal, Row } from 'antd'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const ModalPrint = ({
  PDFModalProps,
  printProps,
  mode,
  changed,
  listPrintAll
}) => {
  let buttonClickPDF = <PrintPDF dataSource={listPrintAll} name="Print All Data" {...printProps} />
  let buttonClickXLS = <PrintXLS dataSource={listPrintAll} name="Print All Data" {...printProps} />
  let notification = (changed && listPrintAll.length) ? "Click 'Print All Data' to print!" : "Click 'Get All Data' to get all data!"

  let printMode
  if (mode === 'pdf') {
    printMode = (
      <Row>
        <Col md={8}>
          {buttonClickPDF}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
        </Col>
      </Row>
    )
  } else {
    printMode = (<Row>
      <Col md={8}>
        {buttonClickXLS}<p style={{ color: 'red', fontSize: 10 }}>{notification}</p>
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
