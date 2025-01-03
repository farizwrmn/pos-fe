import Barcode from 'react-barcode'

const borderStyle = {
  border: '1px solid black',
  padding: '5px',
  textAlign: 'center',
  width: '200px'
}

const BarcodeLocation = ({ locationCode, location }) => {
  return (
    <div style={borderStyle}>
      <Barcode width={1} fontSize={10} height={50} value={locationCode} />
      <p>{location}</p>
    </div>)
}

export default BarcodeLocation
