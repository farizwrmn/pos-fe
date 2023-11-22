import React from 'react'

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
    const { data } = this.props
    // Replace 'yourBase64String' with your actual Base64 encoded PNG string
    const base64String = `data:image/png;base64,${data}`
    const canvas = document.getElementById('qrcode-canvas')
    canvas.setAttribute('src', base64String)
  }

  render () {
    return <img id="qrcode-canvas" alt="qrcode" style={{ minHeight: '250px', width: 'auto', marginTop: '10px' }} />
  }
}

export default QRCodeGenerator
