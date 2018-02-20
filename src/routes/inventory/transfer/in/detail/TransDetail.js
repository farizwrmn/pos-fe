import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row,
  Modal
} from 'antd'
import List from './ListDetail'

const formPayment = ({
  dataSource,
  form: {
    // getFieldDecorator,
    resetFields
  }
}) => {
  const listProps = {
    dataSource,
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
