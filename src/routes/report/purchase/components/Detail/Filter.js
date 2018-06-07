import React from 'react'
import PropTypes from 'prop-types'
import { FilterItem } from 'components'
import { Button, DatePicker, Row, Col, Icon, Form, Select, Input } from 'antd'
import PrintPDF from './PrintPDF'
import PrintXLS from './PrintXLS'

const { RangePicker } = DatePicker
const Option = Select.Option

const Filter = ({
  onDateChange,
  onListReset,
  onSearch,
  list,
  onSearchSupplier,
  form: {
    resetFields,
    getFieldDecorator,
    getFieldsValue
  },
  ...printProps
}) => {
  const handleChange = (value) => {
    let transDate = []
    transDate[0] = value[0].format('YYYY-MM-DD')
    transDate[1] = value[1].format('YYYY-MM-DD')
    onDateChange(transDate)
  }

  const handleSearch = () => {
    const data = {
      ...getFieldsValue()
    }
    let startPeriod = data.rangePicker[0].format('YYYY-MM-DD')
    let endPeriod = data.rangePicker[1].format('YYYY-MM-DD')
    delete data.rangePicker
    onSearch(data, startPeriod, endPeriod)
  }

  const handleReset = () => {
    resetFields()
    onListReset()
  }

  const searchSupplier = () => {
    onSearchSupplier()
  }

  let suppliers = []
  if (list && list.length > 0) {
    suppliers = list.map(x => (<Option value={x.id}>{x.supplierName}</Option>))
  }

  return (
    <div>
      <Row style={{ display: 'flex' }}>
        <Col lg={10} md={24}>
          <FilterItem label="Trans Date">
            {getFieldDecorator('rangePicker')(
              <RangePicker size="large" format="DD-MMM-YYYY" />
            )}
          </FilterItem>
          <FilterItem label="Supplier">
            {getFieldDecorator('supplierId')(
              <Select
                showSearch
                placeholder="Select a supplier"
                onFocus={() => searchSupplier()}
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                style={{ width: '100%', marginTop: '5px' }}
              >
                {suppliers}
              </Select>
            )}
          </FilterItem>
          <FilterItem label="Trans No">
            {getFieldDecorator('transNo')(
              <Input maxLength={50} style={{ width: '100%', marginTop: '5px' }} />
            )}
          </FilterItem>
        </Col>
        <Col lg={14} md={24} style={{ float: 'right', textAlign: 'right' }}>
          <Button
            size="large"
            style={{ marginLeft: '5px' }}
            type="primary"
            className="button-width02 button-extra-large"
            onClick={() => handleSearch()}
          >
            <Icon type="search" className="icon-large" />
          </Button>
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
