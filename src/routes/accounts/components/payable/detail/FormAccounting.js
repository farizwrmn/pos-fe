import React from 'react'
import PropTypes from 'prop-types'
import {
  Form
} from 'antd'
import ListAccounting from './ListAccounting'

const FormAccounting = ({
  listAccounting
}) => {
  const listProps = {
    dataSource: listAccounting
  }

  return (
    <Form layout="horizontal">
      <ListAccounting {...listProps} />
    </Form>
  )
}

FormAccounting.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(FormAccounting)
