import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form, Row, Col } from 'antd'
import styles from 'themes/index.less'
import { numberFormatter } from 'utils/string'

const FormItem = Form.Item

const ListInvoice = ({ loading, updateSelectedKey, selectedRowKeys, listInvoice, purchase, dispatch, ...tableProps }) => {
  const { searchText, tmpInvoiceList } = purchase

  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'purchase/updateState',
      payload: {
        searchText: value
      }
    })
  }

  const handleSearch = () => {
    dispatch({
      type: 'purchase/onInvoiceSearch',
      payload: {
        searchText,
        tmpInvoiceList
      }
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'purchase/onInvoiceReset',
      payload: {
        searchText: '',
        tmpInvoiceList
      }
    })
  }

  const handleSubmitAll = () => {
    dispatch({
      type: 'payableForm/addMultipleItem',
      payload: {
        selectedRowKeys
      }
    })
  }

  const rowSelection = {
    selectedRowKeys,
    hideDefaultSelections: false,
    onChange: (selectedRowKeys) => {
      updateSelectedKey(selectedRowKeys)
    }
  }

  const columns = [
    {
      title: 'Invoice',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Trans Date',
      dataIndex: 'transDate',
      key: 'transDate'
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName'
    },
    {
      title: 'Must Paid',
      dataIndex: 'paymentTotal',
      key: 'paymentTotal',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    },
    {
      title: 'Netto',
      dataIndex: 'netto',
      key: 'netto',
      className: styles.alignRight,
      render: text => (text || '-').toLocaleString()
    }
  ]

  return (
    <div>
      <Form layout="inline">
        <Row>
          <Col lg={16} md={14}>
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
              <Button size="small" type="default" onClick={handleReset}>Reset</Button>
            </FormItem>
            {selectedRowKeys && selectedRowKeys.length > 0 ? (
              <FormItem>
                <Button disabled={loading} size="small" type="primary" onClick={handleSubmitAll}>{`Add ${selectedRowKeys.length} Selected`}</Button>
              </FormItem>
            ) : null}
          </Col>
        </Row>
      </Form>

      <Table
        {...tableProps}
        title={() => `Total: ${numberFormatter(listInvoice ? listInvoice.reduce((prev, next) => prev + next.paymentTotal, 0) : 0)}`}
        pagination={false}
        rowSelection={rowSelection}
        bordered
        columns={columns}
        simple
        size="small"
        rowKey={record => record.productCode}
      />
    </div>
  )
}

ListInvoice.propTypes = {
  onChooseInvoice: PropTypes.func.isRequired,
  onInvoiceHeader: PropTypes.func.isRequired,
  location: PropTypes.isRequired,
  purchase: PropTypes.isRequired,
  dispatch: PropTypes.isRequired
}

export default ListInvoice
