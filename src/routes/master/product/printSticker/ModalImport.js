import React, { Component } from 'react'
import { Form, Modal, Button, message } from 'antd'
import SimpleExcelTemplate from './PrintXLS'
import { convertExcelToJson } from './utils'

const FormItem = Form.Item

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

  handleFileChange = (e) => {
    this.setState({
      selectedFile: e.target.files[0],
      fileReady: Boolean(e.target.files[0])
    })
  };


  handleImport = async () => {
    const {
      dispatch,
      resetChild,
      resetChildShelf,
      resetChildLong
    } = this.props
    const { selectedFile } = this.state

    if (!selectedFile) {
      message.warning('Please select a file first')
      return
    }

    this.setState({ isLoading: true })

    try {
      const productCode = await convertExcelToJson(selectedFile)
      console.log('dispatch', productCode)

      dispatch({
        type: 'productstock/printStickerImport',
        payload: {
          productCode,
          resetChild,
          resetChildShelf,
          resetChildLong
        }
      })

      message.success('File imported successfully')
    } catch (error) {
      message.error(`Import failed: ${error.message}`)
      console.error('Import Error:', error)
    } finally {
      this.setState({ isLoading: false, selectedFile: null })
      this.props.onCancel()
    }
  }


  render () {
    const {
      visible,
      onCancel,
      loading,
      form: { getFieldDecorator }
    } = this.props

    const modalProps = {
      visible,
      title: 'Import Data',
      width: 400,
      onCancel,
      footer: [
        <Button key="import"
          type="primary"
          onClick={this.handleImport}
          loading={loading}
        >
          Import Data
        </Button>
      ]
    }

    return (
      <Modal {...modalProps} onCancel={onCancel}>
        <div style={{ width: '100%', justifyContent: 'end' }}>Download template : <div style={{ justifyContent: 'end' }}><SimpleExcelTemplate /></div></div>
        <Form layout="vertical">
          <FormItem label="File">
            {getFieldDecorator('file', {
              rules: [{ required: true, message: 'Please select a file!' }]
            })(
              <input type="file"
                id="excel-upload"
                onChange={this.handleFileChange}
                accept=".xlsx,.xls,.csv"
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(ModalImport)
