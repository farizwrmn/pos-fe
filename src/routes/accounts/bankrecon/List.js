import React from 'react'
import PropTypes from 'prop-types'

const List = ({
  summaryBankRecon,
  listBankRecon,
  onSubmit
}) => {
  return (
    <div>
      {summaryBankRecon && summaryBankRecon[0] && (
        <div>
          {summaryBankRecon[0].amount}
        </div>
      )}
      {listBankRecon && listBankRecon.map((item) => {
        return (
          <div>
            <div>{item.debit}</div>
            <div>{item.credit}</div>
          </div>
        )
      })}
    </div>
  )
}

List.propTypes = {
  summaryBankRecon: PropTypes.array.isRequired,
  listBankRecon: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default List
