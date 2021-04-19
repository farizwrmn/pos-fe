import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'
import { Link } from 'dva/router'

const FormItem = Form.Item

const ProductCategory = ({
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
      title: 'Category Code',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      width: '15%'
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: '30%'
    }
  ],
  isModal = true,
  enableFilter = true,
  showPagination = true,
  onRowClick,
  productcategory,
  ...tableProps
}) => {
  const { searchText, listCategory, pagination } = productcategory
  // const { pagination } = tableProps
  const handleSearch = () => {
    dispatch({
      type: 'productcategory/query',
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
      type: 'productcategory/updateState',
      payload: {
        searchText: value
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'productcategory/query',
      payload: {
        page: 1,
        pageSize: pagination.pageSize,
        q: null
      }
    })
    dispatch({
      type: 'productcategory/updateState',
      payload: {
        searchText: null
      }
    })
  }
  const changeProduct = (page) => {
    dispatch({
      type: 'productcategory/query',
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
        {enableFilter && <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Service"
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
          <Link target="_blank" to={'/master/product/category'}><Button className="button-add-items-right" style={{ margin: '0px' }} icon="plus" type="dashed" size="large">Add New</Button></Link>
        </Form>}
        <Table
          {...tableProps}
          pagination={showPagination ? pagination : false}
          dataSource={listCategory}
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
                placeholder="Search Service"
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
            <Link target="_blank" to={'/master/product/category'}><Button className="button-add-items-right" style={{ margin: '0px' }} icon="plus" type="dashed" size="large">Add New</Button></Link>
          </Form>}
          <Table
            {...tableProps}
            pagination={showPagination ? pagination : false}
            dataSource={listCategory}
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

ProductCategory.propTypes = {
  form: PropTypes.object.isRequired,
  productcategory: PropTypes.object.isRequired
}

export default connect(({ productcategory }) => ({ productcategory }))(ProductCategory)
