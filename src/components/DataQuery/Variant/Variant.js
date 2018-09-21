import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'

const FormItem = Form.Item

const Variant = ({
  dispatch,
  className,
  visible = false,
  columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode'
    }, {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    }, {
      title: 'Variant',
      dataIndex: 'name',
      key: 'name'
    }
  ],
  isModal = true,
  item = {},
  enableFilter = true,
  showPagination = true,
  onRowClick,
  variantStock,
  ...tableProps
}) => {
  const { searchText, listVariantStock, pagination } = variantStock

  // const { pagination } = tableProps
  const handleSearch = () => {
    if (item.productParentId) {
      dispatch({
        type: 'variantStock/query',
        payload: {
          page: 1,
          pageSize: 10,
          q: searchText,
          productParentId: item.productParentId
        }
      })
    }
  }
  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'variantStock/updateState',
      payload: {
        searchText: value
      }
    })
  }
  const handleReset = () => {
    if (item.productParentId) {
      dispatch({
        type: 'variantStock/query',
        payload: {
          page: 1,
          pageSize: pagination.pageSize,
          q: null,
          productParentId: item.productParentId
        }
      })
    }
    dispatch({
      type: 'variantStock/updateState',
      payload: {
        searchText: null
      }
    })
  }
  const changeProduct = (page) => {
    if (item.productParentId) {
      dispatch({
        type: 'variantStock/query',
        payload: {
          q: searchText,
          productParentId: item.productParentId,
          page: page.current,
          pageSize: page.pageSize
        }
      })
    }
  }

  return (
    <div>
      {isModal && <Modal
        className={className}
        visible={visible}
        title="Search Variant"
        width="80%"
        height="80%"
        footer={null}
        {...tableProps}
      >
        {enableFilter && <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Variant"
              value={searchText}
              onChange={e => handleChange(e)}
              onPressEnter={handleSearch}
              style={{ marginBottom: 16 }}
            />
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={handleSearch}>Search</Button>
          </FormItem>
          <FormItem>
            <Button onClick={handleReset}>Reset</Button>
          </FormItem>
        </Form>}
        <Table
          {...tableProps}
          pagination={showPagination ? pagination : false}
          dataSource={listVariantStock}
          bordered
          columns={columns}
          simple
          onChange={changeProduct}
          onRowClick={onRowClick}
        />
      </Modal>}
      {!isModal &&
        (<div>
          {enableFilter && <Form layout="inline">
            <FormItem>
              <Input
                placeholder="Search Variant"
                autoFocus
                value={searchText}
                onChange={e => handleChange(e)}
                onPressEnter={handleSearch}
                style={{ marginBottom: 16 }}
              />
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={handleSearch}>Search</Button>
            </FormItem>
            <FormItem>
              <Button onClick={handleReset}>Reset</Button>
            </FormItem>
          </Form>}
          <Table
            {...tableProps}
            pagination={showPagination ? pagination : false}
            dataSource={listVariantStock}
            bordered
            columns={columns}
            simple
            onChange={changeProduct}
            onRowClick={onRowClick}
          />
        </div>)
      }
    </div>
  )
}

Variant.propTypes = {
  form: PropTypes.object.isRequired,
  variantStock: PropTypes.object.isRequired
}

export default connect(({ variantStock }) => ({ variantStock }))(Variant)
