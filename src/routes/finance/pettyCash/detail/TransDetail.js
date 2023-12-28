import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row
} from 'antd'
import List from './ListDetail'

const FormPayment = ({
  loading,
  storeInfo,
  user,
  data,
  dataSource,
  listDetailTrans,
  form: {
    resetFields
  }
}) => {
  const listProps = {
    loading,
    storeInfo,
    user,
    data,
    listDetailTrans,
    dataSource,
    editList () {
      resetFields()
    }
  }

  return (
    <Form layout="horizontal">
      <Row>
        <List {...listProps} />
      </Row>
    </Form>
  )
}

FormPayment.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(FormPayment)
