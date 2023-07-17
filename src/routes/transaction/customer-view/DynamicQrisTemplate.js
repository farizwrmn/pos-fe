import { currencyFormatter } from 'utils/string'
import { color } from 'utils/theme'
import { lstorage } from 'utils'
import CountdownTimer from './CountDownTimer'

const DynamicQrisTemplate = ({ qrisImage, total, dynamicQrisTimeLimit }) => {
  const countDownTimerProps = {
    onTimerFinish: () => {
      lstorage.removeDynamicQrisTimeLimit()
    },
    duration: dynamicQrisTimeLimit * 60
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
      <div style={{ width: '100%', height: 'auto', alignSelf: 'center' }}>
        <img src="/qris-logo.png" alt="" width="100%" height="auto" style={{ marginTop: '30px' }} />
        <img src={qrisImage} alt="no_img" width="100%" height="auto" style={{ minHeight: '200px', maxHeight: '250px', maxWidth: '250px', marginTop: '30px' }} />
        <div style={{
          height: 'auto',
          width: '100%',
          backgroundColor: color.white,
          boxShadow: '-2px 3px 13px 2px rgba(0,0,0,0.3)',
          '-webkit-box-shadow': '-2px 3px 13px 2px rgba(0,0,0,0.3)',
          '-moz-box-shadow': '-2px 3px 13px 2px rgba(0,0,0,0.3);',
          marginTop: '30px'
        }}
        >
          <div style={{ backgroundColor: color.primary, width: '100%', height: 'auto' }}>
            <img src="/k3mart-text-logo.png" alt="" style={{ margin: '20px 0 20px 0', maxWidth: '250px' }} width="100%" height="auto" />
          </div>
          <div style={{ fontSize: '20px', color: color.charcoal }}>Total Belanja :</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: color.black }}>{currencyFormatter(total)}</div>
          <CountdownTimer {...countDownTimerProps} />
        </div>
        <div style={{ textAlign: 'center', fontSize: '14px' }}>
          Buka Aplikasi e-wallet atau m-Banking anda dan scan QR-Code untuk membayar pesanan
        </div>
      </div>
    </div>
  )
}

export default DynamicQrisTemplate
