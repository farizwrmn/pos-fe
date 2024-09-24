import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Row, Col, Select, DatePicker } from 'antd'

const { RangePicker } = DatePicker
const FormItem = Form.Item

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Filter = ({
  onFilterChange,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const handleSubmit = (value) => {
    validateFields((errors) => {
      if (errors) {
        return
      }

      const data = {
        ...getFieldsValue()
      }
      onFilterChange({
        question: data.question,
        from: data.transDate[0].format('YYYY-MM-DD'),
        to: data.transDate[1].format('YYYY-MM-DD')
      })
    })
  }

  return (
    <Row>
      <Col {...searchBarLayout} >
        <FormItem label="Report Name">
          {getFieldDecorator('question', {
            rules: [
              {
                required: false
              }
            ]
          })(
            <Select style={{ width: '100%' }} size="large">
              <Select.Option value="1684">01. Report OOS Harian Group By Date & Product</Select.Option>
              <Select.Option value="1687">02. Report Laporan mutasi stock pertanggal ( QTY )</Select.Option>
              <Select.Option value="1685">03. Report Mutasi Rupiah Per Department</Select.Option>
              <Select.Option value="1683">04. Report OOS Harian Group By Product</Select.Option>
              <Select.Option value="1688">05. Report Sales By Date</Select.Option>
              <Select.Option value="1689">06. Report DSI Store</Select.Option>
              <Select.Option value="1690">07. Report Transfer IN</Select.Option>
              <Select.Option value="1692">08. Report Adjust Out / In Where Stock Opname</Select.Option>
              <Select.Option value="1693">09. Report Adjust Out / In Retur or Adjustment or Waste</Select.Option>
              <Select.Option value="1691">10. Report Transfer Out</Select.Option>
              <Select.Option value="1694">12. Produk Paling Laris</Select.Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="Date">
          {getFieldDecorator('transDate', {
            rules: [
              {
                required: false
              }
            ]
          })(
            <RangePicker size="large" format="DD-MMM-YYYY" />
          )}
        </FormItem>
        <Button type="primary" onClick={handleSubmit}>Query</Button>
      </Col>
      <Col span={12} />
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
