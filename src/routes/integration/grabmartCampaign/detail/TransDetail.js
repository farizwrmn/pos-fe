import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row
} from 'antd'
import ListDetail from './ListDetail'

const formPayment = ({
  onUploadStore,
  dataSource,
  loading,
  form: {
    resetFields
  }
}) => {
  const listProps = {
    onUploadStore,
    dataSource,
    loading,
    editList () {
      resetFields()
    }
  }

  return (
    <Form layout="horizontal">
      <Row>
        <ListDetail {...listProps} />
      </Row>
    </Form>
  )
}

formPayment.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(formPayment)
