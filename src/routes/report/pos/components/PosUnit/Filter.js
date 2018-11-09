/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
// import moment from 'moment'
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

const Filter = ({ showFilter, onListReset, listTrans, ...printProps }) => {
  const handleReset = () => {
    onListReset()
  }

  const printOpts = {
    listTrans,
    ...printProps
  }

  return (
    <Row >
      <Col {...leftColumn} />
      <Col {...rightColumn} style={{ float: 'right', textAlign: 'right' }}>
        <Button type="dashed"
          size="large"
          className="button-width02 button-extra-large"
          onClick={() => showFilter()}
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
        {<PrintPDF {...printOpts} />}
        {<PrintXLS {...printOpts} />}
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  onListReset: PropTypes.func.isRequired,
  showFilter: PropTypes.func,
  listTrans: PropTypes.array.isRequired
}

export default Filter
