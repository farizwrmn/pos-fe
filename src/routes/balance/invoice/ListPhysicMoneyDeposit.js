import React from 'react'
import { currencyFormatterSetoran } from 'utils/string'

const TableView = ({ dataSource, totalQty, currentItem }) => {
  return (
    <div>
      <table style={{ border: '1px solid #A5A5A5' }}>
        <tr>
          <th style={{ border: '1px solid #A5A5A5', textAlign: 'center' }}>JUMLAH LEMBAR</th>
          <th style={{ border: '1px solid #A5A5A5', textAlign: 'center' }}>LEMBAR</th>
          <th style={{ border: '1px solid #A5A5A5', textAlign: 'center' }}>PECAHAN</th>
          <th style={{ border: '1px solid #A5A5A5', textAlign: 'center' }}>TOTAL</th>
        </tr>
        {dataSource && dataSource.length > 0 && dataSource.map((column, index) => (
          <tr key={index}>
            <td style={{ textAlign: 'center', border: '1px solid #A5A5A5' }}>
              <input style={{ textAlign: 'center', border: 'none', width: 12 }} min={0} value={column.qty} disabled />
            </td>
            <td style={{ textAlign: 'center', border: '1px solid #A5A5A5' }}>
              <div>
                <p>{column.physicalMoneyType}</p>
              </div>
            </td>
            <td style={{ textAlign: 'center', border: '1px solid #A5A5A5' }}>
              <div>
                <p>{column.physicalMoneyName}</p>
              </div>
            </td>
            <td style={{ textAlign: 'center', border: '1px solid #A5A5A5' }}>
              <div>
                <p>{currencyFormatterSetoran(column.amount)}</p>
              </div>
            </td>
          </tr>
        ))}
        {/* End of loop */}
        <tr>
          <th style={{ textAlign: 'left', border: '1px solid #A5A5A5' }}>
            <p style={{ fontWeight: 'bold' }}>Qty</p>
          </th>
          <th colSpan={3} style={{ textAlign: 'center', border: '1px solid #A5A5A5' }}>
            <p style={{ fontWeight: 'bold' }}>{totalQty}</p>
          </th>
        </tr>
        <tr>
          <td style={{ textAlign: 'left', border: '1px solid #A5A5A5' }}>
            <p style={{ fontWeight: 'bold' }}>Subtotal</p>
          </td>
          <td colSpan={3} style={{ textAlign: 'center', border: '1px solid #A5A5A5' }}>
            <p style={{ fontWeight: 'bold' }}>{currencyFormatterSetoran(currentItem.total)}</p>
          </td>
        </tr>
      </table>

    </div>
  )
}


const ListPhysicMoneyDeposit = ({
  currentItem,
  dataSource
}) => {
  const totalQty = dataSource && dataSource.length > 0 && dataSource.reduce((acc, item) => acc + item.qty, 0)
  return (
    <div>
      <h3 style={{ fontWeight: 'bold' }}>SETORAN UANG TUNAI</h3>
      <TableView
        dataSource={dataSource}
        currentItem={currentItem}
        totalQty={totalQty}
      />
    </div>
  )
}


export default ListPhysicMoneyDeposit
