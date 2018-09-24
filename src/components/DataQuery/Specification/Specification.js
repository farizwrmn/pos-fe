import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'

const FormItem = Form.Item

const Specification = ({
  dispatch,
  className,
  visible = false,
  isModal = true,
  enableFilter = true,
  showPagination = true,
  onRowClick,
  specification,
  specificationStock,
  modalType,
  editListItem,
  ...tableProps
}) => {
  let searchText = null
  let listSpecificationCode = []
  let pagination = {}
  if (modalType === 'add') {
    searchText = specification.searchText
    listSpecificationCode = specification.listSpecification
    pagination = specification.pagination
  } else if (modalType === 'edit') {
    searchText = specificationStock.searchText
    listSpecificationCode = specificationStock.listSpecificationCode
    pagination = specificationStock.pagination
  }

  const handleChangeInput = (e) => {
    const { name, id, value } = e.target
    editListItem(name || id, value)
  }

  const InputComponent = (text, record) => (
    <div key={record.id} onClick={(e) => { e.stopPropagation() }} >
      <Input placeholder="Insert a value" key={record.id} id={record.id} value={record.value || null} onChange={value => handleChangeInput(value)} />
    </div>
  )

  const columns = [
    {
      title: 'Category Code',
      dataIndex: 'categoryCode',
      key: 'categoryCode'
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
      key: 'categoryName'
    },
    {
      title: 'Specification',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (text, record) => {
        return InputComponent(null, record)
      }
    }
  ]

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
        title="Specification"
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
  specificationStock: PropTypes.object.isRequired,
  specification: PropTypes.object.isRequired
}

export default connect(({ specificationStock, specification }) => ({ specificationStock, specification }))(Specification)
