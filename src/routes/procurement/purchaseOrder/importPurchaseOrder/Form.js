import React from 'react'
import PropTypes from 'prop-types'
import ImportExcel from './ImportExcel'
import List from './List'

const FormCounter = ({
  listProps,
  user,
  storeInfo,
  dispatch
}) => {
  const importExcelProps = {
    data: [{ id: 1 }],
    dispatch,
    user,
    storeInfo
  }

  return (
    <div>
      <ImportExcel {...importExcelProps} />
      <List {...listProps} />
    </div>
  )
}

FormCounter.propTypes = {
  form: PropTypes.object.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  button: PropTypes.string
}

export default FormCounter
