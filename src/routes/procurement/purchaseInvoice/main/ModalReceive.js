import React from 'react'
import { Modal, Button, DatePicker, Row, Col, Table, Select, Input, Form } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

const ModalReceive = ({
  loading,
  onCancel,
  from,
  to,
  supplierId,
  listSupplier,
  onFilterChange,
  modalReceiveTableProps,
  onChooseInvoice,
  searchReceive,
  handleChange,
  handleSearch,
  handleReset,
  form: { getFieldDecorator },
  ...modalProps
}) => {
  const columns = [
    {
      title: 'No',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier.supplierName',
      key: 'supplier.supplierName'
    },
    {
      title: 'Reference',
      dataIndex: 'referenceTransNo',
      key: 'referenceTransNo'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      render: text => (text || 0).toLocaleString()
    },
    {
      title: 'Netto',
      dataIndex: 'netto',
      key: 'netto',
      render: text => (text || 0).toLocaleString()
    }
  ]

  const onSupplierChange = (selectedValue) => {
    console.log('selectedValue', selectedValue)
    onFilterChange({
      ...location.query,
      supplierId: selectedValue
    })
  }

  const supplierData = (listSupplier || []).length > 0 ?
    listSupplier.map(b => <Option value={b.id} key={b.id}>{b.supplierName}</Option>)
    : []

  const onDateChange = (rangePicker) => {
    onFilterChange({
      ...location.query,
      from: rangePicker[0].format('YYYY-MM-DD'),
      to: rangePicker[1].format('YYYY-MM-DD')
    })
  }

  return (
    <Modal
      width="80%"
      onCancel={onCancel}
      footer={[
        (<Button id="buttonCancel" type="default" onClick={onCancel} disabled={loading.effects['purchaseOrder/querySupplierCount']}>Cancel</Button>)
      ]}
      {...modalProps}
    >
      <Form layout="inline">
        <Row>
          <Col md={24} lg={12}>
            <FormItem required label="Supplier">
              {getFieldDecorator('supplierId', {
                initialValue: supplierId ? Number(supplierId) : undefined,
                rules: [
                  {
                    required: true
                  }
                ]
              })(<Select
                showSearch
                allowClear
                optionFilterProp="children"
                style={{ width: '200px' }}
                onChange={onSupplierChange}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toString().toLowerCase()) >= 0}
              >
                {supplierData}
              </Select>)}
            </FormItem>
          </Col>
          <Col md={24} lg={12}>
            <FormItem required label="Date">
              {getFieldDecorator('rangeDate', {
                initialValue: from && to ? [moment.utc(from), moment.utc(to)] : undefined,
                rules: [
                  { required: true }
                ]
              })(
                <RangePicker allowClear={false} onChange={onDateChange} size="large" format="DD-MMM-YYYY" />
              )}
            </FormItem>
          </Col>
        </Row>
        <FormItem>
          <Input placeholder="Search Invoice"
            value={searchReceive}
            ref={input => input && input.focus()}
            size="small"
            onChange={e => handleChange(e)}
            onPressEnter={handleSearch}
            style={{ marginBottom: 16 }}
          />
        </FormItem>
        <FormItem>
          <Button size="small" type="primary" onClick={handleSearch}>Search</Button>
        </FormItem>
        <FormItem>
          <Button size="small" type="primary" onClick={handleReset}>Reset</Button>
        </FormItem>
      </Form>

      <Table
        {...modalReceiveTableProps}
        bordered
        columns={columns}
        simple
        size="small"
        onRowClick={_record => onChooseInvoice(_record)}
      />
    </Modal>
  )
}


export default Form.create()(ModalReceive)
