import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import Form from './Form'

const SupplierBank = ({
  dispatch,
  className,
  supplierData,
  visible = false,
  onRowClick,
  supplierBank,
  ...tableProps
}) => {
  const { currentItem } = supplierBank
  const formProps = {
    ...tableProps,
    visible,
    supplierData,
    currentItem,
    onSubmit (data) {
      dispatch({
        type: 'supplierBank/add',
        payload: {
          data
        }
      })
    }
  }

  return (
    <Form {...formProps} />
  )
}

SupplierBank.propTypes = {
  form: PropTypes.object.isRequired,
  supplierBank: PropTypes.object.isRequired
}

export default connect(({ supplierBank }) => ({ supplierBank }))(SupplierBank)
