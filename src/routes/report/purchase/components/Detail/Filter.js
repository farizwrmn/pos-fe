import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const { RangePicker } = DatePicker

const Filter = ({
  onDateChange,
  onListReset,
  form: {
    resetFields,
    getFieldDecorator
  },
  ...printProps
}) => {
  const handleChange = (value) => {
    let transDate = []
    transDate[0] = value[0].format('YYYY-MM-DD')
    transDate[1] = value[1].format('YYYY-MM-DD')
    onDateChange(transDate)
  }

  const handleReset = () => {
    resetFields()
    onListReset()
  }

  return (
    <div>
      <Row style={{ display: 'flex' }}>
        <Col span={10} >
          <FilterItem label="Trans Date">
            {getFieldDecorator('rangePicker')(
              <RangePicker size="large" onChange={value => handleChange(value)} format="DD-MMM-YYYY" />
            )}
          </FilterItem>
        </Col>
        <Col span={14} style={{ float: 'right', textAlign: 'right' }}>
          <Button type="dashed"
            size="large"
            className="button-width02 button-extra-large bgcolor-lightgrey"
            onClick={() => handleReset()}
          >
            <Icon type="rollback" className="icon-large" />
          </Button>
          <PrintPDF {...printProps} />
          <PrintXLS {...printProps} />
        </Col>
      </Row>
    </div>
  )
}

Filter.propTypes = {
  form: PropTypes.object.isRequired
}

export default Form.create()(Filter)
