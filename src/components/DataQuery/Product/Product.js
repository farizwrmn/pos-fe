import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'

const FormItem = Form.Item

const Product = ({
  dispatch,
  className,
  visible = false,
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '5%'
    },
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '15%'
    }, {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '30%'
    }, {
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: '15%',
      render: text => text.toLocaleString()
    }, {
      title: 'Dist Price 01',
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      width: '15%',
      render: text => text.toLocaleString()
    }, {
      title: 'Dist Price 02',
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      width: '15%',
      render: text => text.toLocaleString()
    }
  ],
  isModal = true,
  onRowClick,
  productstock,
  ...tableProps
}) => {
  const { searchText, list, pagination } = productstock
  // const { pagination } = tableProps
  const handleSearch = () => {
    dispatch({
      type: 'productstock/query',
      payload: {
        page: 1,
        pageSize: 10,
        q: searchText
      }
    })
  }
  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'productstock/updateState',
      payload: {
        searchText: value
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'productstock/query',
      payload: {
        page: 1,
        pageSize: pagination.pageSize,
        q: null
      }
    })
    dispatch({
      type: 'productstock/updateState',
      payload: {
        searchText: null
      }
    })
  }
  const changeProduct = (page) => {
    dispatch({
      type: 'productstock/query',
      payload: {
        q: searchText,
        page: page.current,
        pageSize: page.pageSize
      }
    })
  }

  return (
    <div>
      {isModal && <Modal
        className={className}
        visible={visible}
        width="80%"
        height="80%"
        footer={null}
        {...tableProps}
      >
        <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Product Name"
              value={searchText}
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
          {...tableProps}
          pagination={pagination}
          dataSource={list}
          bordered
          scroll={{ x: 500, y: 388 }}
          columns={columns}
          simple
          size="small"
          onChange={changeProduct}
          rowKey={record => record.productCode}
          onRowClick={onRowClick}
        />
      </Modal>}
      {!isModal &&
        (<div>
          <Form layout="inline">
            <FormItem>
              <Input
                placeholder="Search Product Name"
                autoFocus
                value={searchText}
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
            {...tableProps}
            pagination={pagination}
            dataSource={list}
            bordered
            scroll={{ x: 500, y: 388 }}
            columns={columns}
            simple
            size="small"
            onChange={changeProduct}
            rowKey={record => record.productCode}
            onRowClick={onRowClick}
          />
        </div>)
      }
    </div>
  )
}

Product.propTypes = {
  form: PropTypes.object.isRequired,
  productstock: PropTypes.object.isRequired
}

export default connect(({ productstock }) => ({ productstock }))(Product)
