import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Row, Col } from 'antd'

const Filter = ({
  onAddRole,
  editRole,
  saveRole,
  onCancel
}) => {
  return (
    <Row type="flex">
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button type="dashed"
          size="large"
          onClick={onAddRole}
          disabled={!!editRole}
          className="button-width02 button-extra-large"
        >
          <Icon type="plus" className="icon-large" />
        </Button>
        <Button type="dashed"
          size="large"
          onClick={saveRole}
          disabled={!editRole}
          className="button-width02 button-extra-large bgcolor-blue"
        >
          <Icon type="save" className="icon-large" />
        </Button>
        <Button type="dashed"
          size="large"
          onClick={onCancel}
          disabled={!editRole}
          className="button-width02 button-extra-large bgcolor-lightgrey"
        >
          <Icon type="rollback" className="icon-large" />
        </Button>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onAddRole: PropTypes.func,
  editRole: PropTypes.string,
  saveRole: PropTypes.func,
  onCancel: PropTypes.func
}

export default Filter
