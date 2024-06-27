import React from 'react'

const EmbeddedSalesByDate = ({ iframeUrl }) => {
  return (
    <div>
      <iframe
        title="Report"
        src={iframeUrl}
        frameBorder="0"
        width="100%"
        height="600"
        allowTransparency
      />
    </div>
  )
}

export default EmbeddedSalesByDate
