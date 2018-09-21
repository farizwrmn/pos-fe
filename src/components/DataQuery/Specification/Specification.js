import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'

const FormItem = Form.Item

const Specification = ({
  dispatch,
  className,
  visible = false,
  columns = [
    {
      title: 'Product Code',
      dataIndex: 'productCode',
      key: 'productCode'
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName'
    },
    {
      title: 'Specification',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    }
  ],
  isModal = true,
  enableFilter = true,
  showPagination = true,
  onRowClick,
  specificationStock,
  ...tableProps
}) => {
  const { searchText, listSpecificationCode, pagination } = specificationStock
  // const { pagination } = tableProps
  const handleSearch = () => {
    dispatch({
      type: 'specificationStock/query',
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
      type: 'specificationStock/updateState',
      payload: {
        searchText: value
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'specificationStock/query',
      payload: {
        page: 1,
        pageSize: pagination.pageSize,
        q: null
      }
    })
    dispatch({
      type: 'specificationStock/updateState',
      payload: {
        searchText: null
      }
    })
  }
  const changeProduct = (page) => {
    dispatch({
      type: 'specificationStock/query',
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
        title="Search Specification"
        width="80%"
        height="80%"
        footer={null}
        {...tableProps}
      >
        {enableFilter && <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Specification"
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
          dataSource={listSpecificationCode}
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
                placeholder="Search Specification"
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
            dataSource={listSpecificationCode}
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

Specification.propTypes = {
  form: PropTypes.object.isRequired,
  specificationStock: PropTypes.object.isRequired
}

export default connect(({ specificationStock }) => ({ specificationStock }))(Specification)
