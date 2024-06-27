import React from 'react'

const EmbeddedSalesByDate = ({ iframeUrl }) => {
  return (
    <div>
      <iframe
        src={iframeUrl}
        frameBorder="0"
        width="100%"
        height="600"
        allowTransparency
      ></iframe>
    </div>
  )
}

export default EmbeddedSalesByDate
