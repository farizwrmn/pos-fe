import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import ImportExcel from '../../../routes/procurement/purchaseOrder/main/ImportExcel'
import Form from './Form'


const Counter = ({ app }) => {
  const { user, storeInfo } = app
  const importExcelProps = {
    data: [{ id: 1 }],
    user,
    storeInfo
  }

  const onSubmit = (value) => {
    console.log('value', value)
    // dispatch({
    //   type: 'productuom/query',
    //   payload: {
    //     ...value
    //   }
    // })
  }

  const formProps = {
    data: [{ id: 1 }],
    user,
    storeInfo,
    onSubmit
  }

  return (
    <div className="content-inner">
      <ImportExcel {...importExcelProps} />
      <Form {...formProps} />
    </div>
  )
}

Counter.propTypes = {
  productuom: PropTypes.object,
  loading: PropTypes.object,
  location: PropTypes.object,
  app: PropTypes.object,
  dispatch: PropTypes.func
}

export default connect(({ productuom, loading, app }) => ({ productuom, loading, app }))(Counter)
