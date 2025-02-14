import QRCodeGenerator from './QRCodeGenerator'

const DynamicQrisTemplate = ({
  qrisImage
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
      <div style={{ width: '100%', height: 'auto', alignSelf: 'center' }}>
        <QRCodeGenerator data={qrisImage} size={300} />
      </div>
    </div>
  )
}

export default DynamicQrisTemplate
