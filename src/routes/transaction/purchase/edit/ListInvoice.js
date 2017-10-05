import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form, Modal } from 'antd'
import { connect } from 'dva'

const FormItem = Form.Item
const Warning = Modal.confirm

const ListInvoice = ({ onChooseInvoice, purchase, dispatch, ...tableProps }) => {
  const { searchText, tmpInvoiceList } = purchase

  const handleMenuClick = (record) => {
    Warning({
      title: 'Warning: change record activity',
      content: 'Do you want to delete all recent activity',
      onOk () {
        onChooseInvoice(record)
      },
      onCancel () {
        console.log('cancel')
      },
    })
  }

  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'purchase/onInputChange',
      payload: {
        searchText: value,
      },
    })
  }

  const handleSearch = () => {
    dispatch({
      type: 'purchase/onInvoiceSearch',
      payload: {
        searchText: searchText,
        tmpInvoiceList: tmpInvoiceList,
      },
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'purchase/onInvoiceReset',
      payload: {
        searchText: '',
        tmpInvoiceList: tmpInvoiceList,
      },
    })
  }

  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo',
      width: '25%',
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate',
      width: '45%',
    },
    {
      title: 'SupplierName',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: '30%',
    },
  ]

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder="Search Invoice Number"
            value={searchText}
            size="small"
            onChange={_e => handleChange(_e)}
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
        {...tableProps}
        bordered
        scroll={{ x: 500, y: 388 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
        onRowClick={_record => handleMenuClick(_record)}
      />
    </div>
  )
}

ListInvoice.propTypes = {
  onChooseInvoice: PropTypes.func.isRequired,
  location: PropTypes.isRequired,
  purchase: PropTypes.isRequired,
  dispatch: PropTypes.isRequired,
}

export default connect(({ purchase }) => ({ purchase }))(ListInvoice)
