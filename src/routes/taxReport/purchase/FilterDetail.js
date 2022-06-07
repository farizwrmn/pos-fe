import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Select, Icon, DatePicker, Modal } from 'antd'
import { getVATPercentage } from 'utils/tax'
import { DropOption } from 'components'
import moment from 'moment'
import ModalRestore from './ModalRestore'
import ModalTax from './ModalTax'
import PrintPDF from './PrintPDFDetail'
import PrintXLS from './PrintXLSDetail'
import ModalEdit from './ModalEdit'

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
  modalEditProps,
  printDetailOpts,
  selectedRowKeys,
  onShowTaxEditor,
  loading,
  listBrand,
  listCategory,
  listSupplier,
  onFilterChange,
  deleteItem,
  modalRestoreProps,
  modalTaxEditorProps,
  onRestoreModal,
  form: {
    getFieldDecorator,
    getFieldsValue,
    validateFields
  }
}) => {
  const handleSubmit = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let field = getFieldsValue()
      onFilterChange({
        from: field.rangeDate[0].format('YYYY-MM-DD'),
        to: field.rangeDate[1].format('YYYY-MM-DD'),
        taxType: field.taxType,
        categoryId: field.categoryId,
        brandId: field.brandId,
        supplierId: field.supplierId
      })
    })
  }

  const handleMenuClick = (event, selectedRowKeys) => {
    if (event.key === '1') {
      onShowTaxEditor(selectedRowKeys)
    }
    if (event.key === '2') {
      Modal.confirm({
        title: `Are you sure delete ${selectedRowKeys.length} items ?`,
        onOk () {
          deleteItem(selectedRowKeys)
        }
      })
    }
  }

  const handleRestore = () => {
    validateFields((errors) => {
      if (errors) {
        return
      }
      let field = getFieldsValue()
      if (field && field.rangeDate && field.rangeDate[0]) {
        const from = field.rangeDate[0].format('YYYY-MM-DD')
        const to = field.rangeDate[1].format('YYYY-MM-DD')
        onRestoreModal({
          from,
          to,
          taxType: field.taxType,
          categoryId: field.categoryId,
          brandId: field.brandId,
          supplierId: field.supplierId
        })
      }
    })
  }

  return (
    <Row>
      <Col span={12}>
        <FormItem hasFeedback>
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
            <Option value="I">Include</Option>
            <Option value="E">Exclude (0%)</Option>
            <Option value="S">Exclude ({getVATPercentage()}%)</Option>
          </Select>)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('supplierId', {
            rules: [{
              required: false,
              message: 'Required'
            }]
          })(<Select
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
            showSearch
            allowClear
            style={{ width: '60%' }}
            placeholder="Supplier"
          >
            {listSupplier && listSupplier.map(item => (<Option value={item.id} title={item.supplierName}>{item.supplierName}</Option>))}
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
      <Col {...searchBarLayout}>
        <Button
          type="primary"
          size="large"
          style={{ marginLeft: '5px', marginRight: '5px' }}
          onClick={() => handleRestore()}
          loading={loading}
        >
          Restore
        </Button>
        <PrintPDF {...printDetailOpts} />
        <PrintXLS {...printDetailOpts} />
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
                    { key: '1', name: 'Tax Type', disabled: false },
                    { key: '2', name: 'Delete', disabled: false }
                  ]}
                />
              </div>
            </div>
          ) : null}
        </div>
      </Col>
      {modalEditProps.visible && <ModalEdit {...modalEditProps} />}
      {modalRestoreProps.visible && <ModalRestore {...modalRestoreProps} />}
      {modalTaxEditorProps.visible && <ModalTax {...modalTaxEditorProps} />}
    </Row>
  )
}

Filter.propTypes = {
  form: PropTypes.object,
  onFilterChange: PropTypes.func
}

export default Form.create()(Filter)
