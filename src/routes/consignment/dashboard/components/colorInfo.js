import React from 'react'

function ColorInfo () {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      margin: '15px 0px 15px 0px',
      flex: 1,
      alignItems: 'center'
    }}
    >
      <div
        style={{
          backgroundColor: '#808080',
          borderRadius: '5px',
          padding: '3px 10px 3px 10px',
          marginRight: '10px',
          color: '#FFFFFF'
        }}
      >
        On Rent
      </div>
      <div
        style={{
          backgroundColor: '#ffc300',
          borderRadius: '5px',
          padding: '3px 10px 3px 10px',
          marginRight: '10px',
          color: '#FFFFFF'
        }}
      >
        Rental period under 7 days
      </div>
      <div
        style={{
          backgroundColor: '#38b000',
          borderRadius: '5px',
          padding: '3px 10px 3px 10px',
          marginRight: '10px',
          color: '#FFFFFF'
        }}
      >
        Available
      </div>
    </div>
  )
}

export default (ColorInfo)
