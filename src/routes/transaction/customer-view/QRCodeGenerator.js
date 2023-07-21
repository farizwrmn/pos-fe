import React from 'react'
import QRCode from 'qrcode'

class QRCodeGenerator extends React.Component {
  componentDidMount () {
    this.generateQRCode()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.data !== this.props.data || prevProps.size !== this.props.size) {
      this.generateQRCode()
    }
  }

  generateQRCode = () => {
    const { data, size } = this.props
    const canvas = document.getElementById('qrcode-canvas')

    QRCode.toCanvas(canvas, data, { width: size, height: size }, (error) => {
      if (error) {
        console.error('Error generating QR code:', error)
      }
    })
  }

  render () {
    return <canvas id="qrcode-canvas" width="100%" height="auto" style={{ minHeight: '200px', maxHeight: '250px', maxWidth: '250px', marginTop: '30px' }} />
  }
}

export default QRCodeGenerator
