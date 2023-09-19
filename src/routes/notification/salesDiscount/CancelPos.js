import React from 'react'

const CancelPos = ({ listRequestCancel, fingerprintId, transNo, memo }) => {
  return (
    <div>
      <div>{`Trans No: ${transNo}`}</div>
      <div>{`Memo: ${memo}`}</div>
      {listRequestCancel && listRequestCancel.length > 0 ? (
        listRequestCancel.filter(filtered => filtered.fingerprintId === fingerprintId)
          .map((item) => {
            if (item.requestCancelDetail && item.requestCancelDetail.length > 0) {
              return (
                <div>
                  {item.requestCancelDetail.map((detail) => {
                    return (
                      <div>
                        <div style={{ color: detail.singleDeletion ? 'red' : undefined }}>{detail.singleDeletion ? 'Delete' : ''} {detail.qty} x {detail.productName} Rp {(detail.total || 0).toLocaleString()}</div>
                      </div>
                    )
                  })}
                </div>
              )
            }
            return null
          })
      ) : null}
    </div>
  )
}

export default CancelPos
