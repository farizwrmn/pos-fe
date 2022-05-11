import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'dva/router'
import {
  Form,
  Button,
  Row
} from 'antd'
import List from './List'

const FormItem = Form.Item

const FormPayment = ({
  listAmount,
  cancelPayment,
  editItem,
  form: {
    resetFields
  }
}) => {
  const listProps = {
    dataSource: listAmount,
    cancelPayment,
    editList (data) {
      editItem(data)
      resetFields()
    }
  }

  return (
    <Form layout="horizontal">
      <Row>
        <FormItem style={{ margin: '5px 10px', float: 'right' }}>
          <Link target="_blank" to={'/accounts/payable-form'}> <Button type="primary">Payment</Button></Link>
        </FormItem>
      </Row>
      <List {...listProps} />
    </Form >
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
