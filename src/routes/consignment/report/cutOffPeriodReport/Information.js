import React from 'react'
import { Card } from 'antd'

const Information = () => {
  return (
    <div>
      <Card
        bordered={false}
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.0)', border: 0 }}
        bodyStyle={{ backgroundColor: 'rgb(216,236,244, 0.4)', border: 0 }}
      >
        <p><strong style={{ color: '#FF00FF' }}>Close Period</strong> adalah tanggal untuk tutup periode Sales Cut Off</p>
        <p>Misalkan:</p>
        <p>* Tanggal tutup periode terakhir Sales Cut Off adalah <strong style={{ color: '#FF00FF' }}>03 Jan 2018</strong>
          Jika tutup periode di <strong style={{ color: '#FF00FF' }}>17 Jan 2018</strong>.
          Data yang dihitung dari <strong style={{ color: '#FF00FF' }}>03 Jan 2018 00:00:00 WIB</strong> s/d <strong style={{ color: '#FF00FF' }}>16 Jan 2018 23:59:59 WIB</strong>
        </p>
        <p>
          * Selanjutnya, jika tutup periode di <strong style={{ color: '#FF00FF' }}>31 Jan 2018</strong>
          Data yang dihitung dari <strong style={{ color: '#FF00FF' }}>17 Jan 2018 00:00:00 WIB</strong> s/d <strong style={{ color: '#FF00FF' }}>30 Jan 2018 23:59:59 WIB</strong>
        </p>
        <p>
          * Selanjutnya, bagaimana jika tutup period di <strong style={{ color: '#FF00FF' }}>3 Feb 2018</strong> (Case: Human Error)
          Data yang dihitung dari <strong style={{ color: '#FF00FF' }}>31 Jan 2018 00:00:00 WIB</strong> s/d <strong style={{ color: '#FF00FF' }}>2 Feb 2018 23:59:59 WIB</strong>
        </p>
        <p>
          * Dst.
        </p>
        <p>
          * Pergunakan dengan baik :{')'}
        </p>
      </Card>
    </div>
  )
}

export default Information
