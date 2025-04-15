import React, { Component } from 'react'
import { Form, Modal, message } from 'antd'
import * as Excel from 'exceljs/dist/exceljs.min.js'
import SimpleExcelTemplate from './PrintXLS'


class ModalImport extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showTemplate: true,
      onCancel: props.onCancel
    }
  }

  handleDownloadTemplate = () => {
    this.setState({ showTemplate: true }, () => {
      setTimeout(() => this.setState({ showTemplate: false }), 100)
      message.success('Downloading template...')
    })
  };

  handleChangeFile = (event) => {
    const {
      dispatch,
      resetChild,
      resetChildShelf,
      resetChildLong,
      onCancel
    } = this.props
    const file = event.target.files[0]
    const reader = new FileReader()
    const workbook = new Excel.Workbook()
    const productCodes = []

    if (!file) {
      message.warning('Please select a file first')
      return
    }

    reader.readAsArrayBuffer(file)

    reader.onload = () => {
      const buffer = reader.result

      workbook.xlsx.load(buffer)
        .then((workbook) => {
          const sheet = workbook.getWorksheet('POS 1')
          sheet.eachRow({ includeEmpty: false }, (row, rowIndex) => {
            const code = row.values[3]
            console.log(code, 'test')
            if (rowIndex >= 6 && code && code.toString().trim() !== '') {
              productCodes.push(code.toString().trim())
            }
          })
        })
        .then(() => {
          if (productCodes.length > 0) {
            dispatch({
              type: 'productstock/printStickerImport',
              payload: {
                productCode: productCodes,
                resetChild,
                resetChildShelf,
                resetChildLong
              }
            })
            onCancel()
          } else {
            message.error('No valid product codes found')
          }
        })
        .catch((err) => {
          console.error('Excel load error:', err)
          message.error('Failed to read file')
        })
    }
  }

  render () {
    const {
      visible,
      onCancel,
      loading
    } = this.props

    const modalProps = {
      visible,
      title: 'Import Data',
      width: 400,
      onCancel,
      footer: null
    }

    return (
      <Modal {...modalProps} onCancel={onCancel}>
        <div style={{ width: '100%', justifyContent: 'end' }}>Download template : <div style={{ justifyContent: 'end' }}><SimpleExcelTemplate /></div></div>
        <span>
          <button className="ant-btn ant-btn-primary ant-btn-lg"
            onClick={() => {
              document.getElementById('importCsv').click()
            }}
          >
            Import
          </button>

          <input
            id="importCsv"
            type="file"
            accept=".xlsx"
            className="ant-btn ant-btn-default ant-btn-lg"
            style={{ visibility: 'hidden' }}
            onClick={(event) => {
              event.target.value = null
            }}
            onInput={event => this.handleChangeFile(event)}
            disabled={loading}
          />
        </span>
      </Modal>
    )
  }
}

export default Form.create()(ModalImport)
