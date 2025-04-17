import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import ImportExcel from '../../procurement/purchaseOrder/main/ImportExcel'
import Form from './Form'


const SupplierPrice = ({ app, dispatch, loading }) => {
  const { user, storeInfo } = app
  const importExcelProps = {
    data: [{ id: 1 }],
    user,
    storeInfo
  }

  const formProps = {
    data: [{ id: 1 }],
    user,
    storeInfo,
    dispatch,
    loading
  }

  return (
    <div className="content-inner">
      <ImportExcel {...importExcelProps} />
      <Form {...formProps} />
    </div>
  )
}

SupplierPrice.propTypes = {
  productuom: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productuom, loading, app }) => ({ productuom, loading, app }))(SupplierPrice)
