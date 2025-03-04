import React from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Row
} from 'antd'
import List from './ListDetail'

const TransDetail = ({
  dataSource,
  editList
}) => {
  const listProps = {
    dataSource,
    editList
  }

  return (
    <Form layout="horizontal">
      <Row>
        <List {...listProps} />
      </Row>
    </Form>
  )
}

TransDetail.propTypes = {
  form: PropTypes.object.isRequired,
  disabled: PropTypes.string,
  item: PropTypes.object,
  onSubmit: PropTypes.func,
  changeTab: PropTypes.func,
  clickBrowse: PropTypes.func,
  activeKey: PropTypes.string,
  button: PropTypes.string
}

export default Form.create()(TransDetail)
