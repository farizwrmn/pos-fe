/**
 * Created by Veirry on 19/09/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form } from 'antd'
import PrintXLS from './PrintXLS'
import PrintPDF from './PrintPDF'

const { RangePicker } = DatePicker

const Filter = ({ onDateChange, dispatch, onListReset, form: { getFieldsValue, setFieldsValue, resetFields, getFieldDecorator }, ...printProps }) => {

  const handleChange = (value) => {
    const from = value[0].format('YYYY-MM-DD')
    const to = value[1].format('YYYY-MM-DD')
    onDateChange(from, to)
  }

  const handleReset = () => {
    const { query, pathname } = location
    dispatch(routerRedux.push({
      pathname,
    }))
    resetFields()
    onListReset()
  }

  return (
    <div>
      <Row style={{ display: 'flex' }}>
        <Col span={10} >
          <FilterItem label="Trans Date">
            {getFieldDecorator('rangePicker')(
              <RangePicker size="large" onChange={(value) => handleChange(value)} format="DD-MMM-YYYY" />
            )}
          </FilterItem>
        </Col>
        <Col span={14} style={{ float: 'right', textAlign: 'right' }}>
          <Button type="dashed" size="large"
            className="button-width02 button-extra-large bgcolor-lightgrey"
            onClick={() => handleReset()}
          >
            <Icon type="rollback" className="icon-large" />
          </Button>
          {<PrintPDF {...printProps} />}
          {<PrintXLS {...printProps} />}
        </Col>
      </Row>
    </div>
  )
}

Filter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  onListReset: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
}

export default Form.create()(Filter)
