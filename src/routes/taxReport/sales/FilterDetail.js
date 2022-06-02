import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Select, Icon, DatePicker, Modal } from 'antd'
import { getCountryTaxPercentage, getVATPercentage } from 'utils/tax'
import { DropOption } from 'components'
import moment from 'moment'

const { RangePicker } = DatePicker
const { Option } = Select

const FormItem = Form.Item

const searchBarLayout = {
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 12 },
  xl: { span: 12 }
}

const Filter = ({
  selectedRowKeys,
  listBrand,
  listCategory,
  onFilterChange,
  loading,
  deleteItem,
  form: {
    getFieldDecorator,
    getFieldsValue
  }
}) => {
  const handleSubmit = () => {
    let field = getFieldsValue()
    onFilterChange({
      from: field.rangeDate[0].format('YYYY-MM-DD'),
      to: field.rangeDate[1].format('YYYY-MM-DD'),
      taxType: field.taxType,
      categoryId: field.categoryId,
      brandId: field.brandId
    })
  }

  const handleMenuClick = (event, selectedRowKeys) => {
    if (event.key === '1') {
      Modal.confirm({
        title: `Are you sure delete ${selectedRowKeys.length} items ?`,
        onOk () {
          deleteItem(selectedRowKeys)
        }
      })
    }
  }

  return (
    <Row>
      <Col span={12}>
        <FormItem>
          {getFieldDecorator('rangeDate', {
            initialValue: [moment().add('-1', 'months'), moment()],
            rules: [
              { required: true }
            ]
          })(
            <RangePicker allowClear={false} size="large" format="DD-MMM-YYYY" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('taxType', {
            rules: [{
              required: false,
              message: 'Required'
            }]
          })(<Select allowClear style={{ width: '60%' }} placeholder="Tax Type">
            <Option value="E">Exclude (0%)</Option>
            <Option value="I">Include ({getVATPercentage()}%)</Option>
            <Option value="O">Include ({getCountryTaxPercentage()}%)</Option>
          </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('categoryId', {
            rules: [{
              required: false,
              message: 'Required'
            }]
          })(<Select
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            showSearch
            allowClear
            style={{ width: '60%' }}
            placeholder="Product Category"
          >
            {listCategory && listCategory.map(item => (<Option value={item.id} title={item.categoryName}>{item.categoryName}</Option>))}
          </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('brandId', {
            rules: [{
              required: false,
              message: 'Required'
            }]
          })(<Select
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            showSearch
            allowClear
            style={{ width: '60%' }}
            placeholder="Product Brand"
          >
            {listBrand && listBrand.map(item => (<Option value={item.id} title={item.brandName}>{item.brandName}</Option>))}
          </Select>)}
        </FormItem>
      </Col>
      <Col {...searchBarLayout} >
        <Button
          type="primary"
          size="large"
          style={{ marginLeft: '5px', float: 'right' }}
          className="button-width02 button-extra-large"
          onClick={() => handleSubmit()}
          loading={loading}
        >
          <Icon type="search" className="icon-large" />
        </Button>
        <div>
          {selectedRowKeys && selectedRowKeys.length > 0 ? (
            <div>
              <div>{selectedRowKeys.length} Selected</div>
              <div>
                <DropOption
                  onMenuClick={e => handleMenuClick(e, selectedRowKeys)}
                  menuOptions={[
                    { key: '1', name: 'Delete', disabled: false }
                  ]}
                />
              </div>
            </div>
          ) : null}
        </div>
      </Col>
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
