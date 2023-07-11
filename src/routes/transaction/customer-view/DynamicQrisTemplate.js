import { currencyFormatter } from 'utils/string'
import { color } from 'utils/theme'

const DynamicQrisTemplate = ({ qrisImage, total }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
      <div style={{ width: '600px', alignSelf: 'center' }}>
        <img src="/qris-logo.png" alt="" style={{ width: '600px', marginTop: '30px' }} />
        <img src={qrisImage} alt="no_img" style={{ width: '400px', height: '400px', marginTop: '30px' }} />
        <div style={{
          width: '600px',
          backgroundColor: color.white,
          boxShadow: '-2px 3px 13px 2px rgba(0,0,0,0.3)',
          '-webkit-box-shadow': '-2px 3px 13px 2px rgba(0,0,0,0.3)',
          '-moz-box-shadow': '-2px 3px 13px 2px rgba(0,0,0,0.3);',
          marginTop: '30px'
        }}
        >
          <div style={{ backgroundColor: color.primary, width: '600px' }}>
            <img src="/k3mart-text-logo.png" alt="" style={{ margin: '20px 0 20px 0' }} />
          </div>
          <div style={{ fontSize: '30px', color: color.charcoal }}>Total Belanja :</div>
          <div style={{ fontSize: '50px', fontWeight: 'bolder', color: color.black, marginBottom: '30px' }}>{`${currencyFormatter(total)}`}</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '20px' }}>
          Buka Aplikasi e-wallet atau m-Banking anda dan scan QR-Code untuk membayar pesanan
        </div>
      </div>
    </div>
  )
}

export default DynamicQrisTemplate
