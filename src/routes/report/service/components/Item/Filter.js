/**
 * Created by Veirry on 02/08/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Icon } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const leftColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12
}

const Filter = ({ onListReset, ...printProps }) => {
  const handleReset = () => {
    onListReset()
  }

  return (
    <Row >
      <Col {...leftColumn} />
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-lightskyblue"
          onClick={() => handleReset()}
        >
          <Icon type="filter" className="icon-large" />
        </Button>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large bgcolor-lightgrey"
          onClick={() => handleReset()}
        >
          <Icon type="rollback" className="icon-large" />
        </Button>
        {<PrintPDF {...printProps} />}
        {<PrintXLS {...printProps} />}
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Filter
