import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'
import { numberFormat } from 'utils'
import { Link } from 'dva/router'
import { getDistPriceName } from 'utils/string'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const FormItem = Form.Item

const Product = ({
  dispatch,
  className,
  visible = false,
  isModal = true,
  enableFilter = true,
  showPagination = true,
  onRowClick,
  productstock,
  productcategory,
  productbrand,
  ...tableProps
}) => {
  const { searchText, list, pagination, filteredInfo } = productstock
  // const { pagination } = tableProps

  const columns = [
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
      width: '10%'
    }, {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '15%'
    }, {
      title: getDistPriceName('sellPrice'),
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      width: '15%',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice01'),
      dataIndex: 'distPrice01',
      key: 'distPrice01',
      width: '15%',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice02'),
      dataIndex: 'distPrice02',
      key: 'distPrice02',
      width: '15%',
      render: text => formatNumberIndonesia(text)
    }, {
      title: getDistPriceName('distPrice03'),
      dataIndex: 'distPrice03',
      key: 'distPrice03',
      width: '15%',
      render: text => formatNumberIndonesia(text)
    }
  ]

  const handleSearch = () => {
    dispatch({
      type: 'productstock/query',
      payload: {
        page: 1,
        pageSize: 10,
        q: searchText,
        ...filteredInfo
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
        searchText: null,
        filteredInfo: {}
      }
    })
  }
  const changeProduct = (page, filters) => {
    dispatch({
      type: 'productstock/updateState',
      payload: {
        filteredInfo: filters
      }
    })
    dispatch({
      type: 'productstock/query',
      payload: {
        q: searchText,
        page: page.current,
        pageSize: page.pageSize,
        ...filters
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
        {enableFilter && <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Product"
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
            <Button type="primary" onClick={handleReset}>Reset</Button>
          </FormItem>
        </Form>}
        <Table
          {...tableProps}
          pagination={showPagination ? pagination : false}
          dataSource={list}
          bordered
          scroll={{ x: 500, y: 388 }}
          columns={columns}
          simple
          onChange={changeProduct}
          rowKey={record => record.id}
          onRowClick={onRowClick}
        />
      </Modal>}
      {!isModal &&
        (<div>
          {enableFilter && <Form layout="inline">
            <FormItem>
              <Input
                placeholder="Search Product"
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
            <Link target="_blank" to={'/stock'}><Button className="button-add-items-right" style={{ margin: '0px' }} icon="plus" type="dashed" size="large">Add New</Button></Link>
          </Form>}
          <Table
            {...tableProps}
            pagination={showPagination ? pagination : false}
            dataSource={list}
            bordered
            scroll={{ x: 500, y: 388 }}
            columns={columns}
            simple
            onChange={changeProduct}
            rowKey={record => record.id}
            onRowClick={onRowClick}
          />
        </div>)
      }
    </div>
  )
}

Product.propTypes = {
  form: PropTypes.object.isRequired,
  productstock: PropTypes.object.isRequired,
  productcategory: PropTypes.object.isRequired,
  productbrand: PropTypes.object.isRequired
}

export default connect(
  ({
    productstock,
    productcategory,
    productbrand }) =>
  ({
    productstock,
    productcategory,
    productbrand
  }))(Product)
