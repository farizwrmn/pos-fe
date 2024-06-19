import { currencyFormatter } from 'utils/string'
import { color } from 'utils/theme'
import CountdownTimer from './CountDownTimer'
import QRCodeGenerator from './QRCodeGenerator'

const DynamicQrisTemplate = ({
  qrisImage,
  total,
  dynamicQrisTimeLimit,
  qrisMerchantTradeNo,
  onTimeout
}) => {
  const countDownTimerProps = {
    onTimerFinish: () => {
      onTimeout()
    },
    duration: parseInt(dynamicQrisTimeLimit * 60, 10)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '40px' }}>
      <div style={{ width: '100%', height: 'auto', alignSelf: 'center' }}>
        <img src="/qris-logo.png" alt="" width="100%" height="auto" style={{ marginTop: '30px' }} />
        <div style={{ width: '100%', textAlign: 'center', fontSize: '20px', fontWeight: 'bolder' }}>{qrisMerchantTradeNo}</div>
        <QRCodeGenerator data={qrisImage} />
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

        <div style={{
          height: 'auto',
          width: '100%',
          backgroundColor: color.white,
          marginTop: '20px'
        }}
        >
          <div style={{ backgroundColor: color.termConditionQris, width: '100%', height: 'auto', paddingTop: 10, paddingBottom: 10 }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: color.charcoal }}>Ketentuan Pembayaran QRIS</div>
          </div>
          <div style={{ paddingTop: 8, textAlign: 'left', fontSize: '18px', color: color.black }}>
            <p>
            Jika pembayaran belum terkonfirmasi, mohon lakukan pembayaran tunai<br />
            Transaksi di rekening Anda bukan bukti pembayaran berhasil<br />
            Jika terjadi keberhasilan dalam proses pembayaran, dana akan dikembalikan dalam waktu 3 hari kerja<br />
            Pembayaran melalui EDC atau QRIS dianggap telah disetujui oleh pelanggan<br /><br />
            Terima kasih atas pengertiannya.
            </p>
            <div style={{ textAlign: 'left', fontSize: '18px', color: color.black, marginTop: 10 }}>Hubungi CS kami: <span
              style={{
                textAlign: 'left',
                fontSize: '18px',
                fontWeight: 'bold',
                color: color.black
              }}
            >0822-5450-3201</span></div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DynamicQrisTemplate
