import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row
} from 'antd'
import List from './ListDetail'

const FormPayment = ({
  dataSource,
  rowSelection,
  selectedRowKeys,
  form: {
    // getFieldDecorator,
    resetFields
  }
}) => {
  const listProps = {
    dataSource,
    rowSelection,
    selectedRowKeys,
    editList () {
      // editItem(data)
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
