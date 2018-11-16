import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'
import { Link } from 'dva/router'

const FormItem = Form.Item

const Customer = ({
  dispatch,
  className,
  addNew,
  visible = false,
  columns = [
    {
      title: 'Member Code',
      dataIndex: 'memberCode',
      key: 'memberCode'
    }, {
      title: 'Member Name',
      dataIndex: 'memberName',
      key: 'memberName'
    }, {
      title: 'Address',
      dataIndex: 'address01',
      key: 'address01'
    }, {
      title: 'Mobile',
      dataIndex: 'mobileNumber',
      key: 'mobileNumber'
    }, {
      title: 'Type',
      dataIndex: 'memberTypeName',
      key: 'memberTypeName'
    }
  ],
  isModal = true,
  enableFilter = true,
  showPagination = true,
  onRowClick,
  customer,
  ...tableProps
}) => {
  const { searchText, list, pagination } = customer
  // const { pagination } = tableProps
  const handleSearch = () => {
    dispatch({
      type: 'customer/query',
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
      type: 'customer/updateState',
      payload: {
        searchText: value
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'customer/query',
      payload: {
        page: 1,
        pageSize: pagination.pageSize,
        q: null
      }
    })
    dispatch({
      type: 'customer/updateState',
      payload: {
        searchText: null
      }
    })
  }
  const changeProduct = (page) => {
    dispatch({
      type: 'customer/query',
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
        title="Search Member"
        width="80%"
        height="80%"
        footer={null}
        {...tableProps}
      >
        {enableFilter && <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Member"
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
          {addNew && <Link target="_blank" to={'/master/customer'}><Button className="button-add-items-right" style={{ margin: '0px' }} icon="plus" type="dashed" size="large">Add New</Button></Link>}
        </Form>}
        <Table
          {...tableProps}
          pagination={showPagination ? pagination : false}
          dataSource={list}
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
                placeholder="Search Member"
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
            {addNew && <Link target="_blank" to={'/master/customer'}><Button className="button-add-items-right" style={{ margin: '0px' }} icon="plus" type="dashed" size="large">Add New</Button></Link>}
          </Form>}
          <Table
            {...tableProps}
            pagination={showPagination ? pagination : false}
            dataSource={list}
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

Customer.propTypes = {
  form: PropTypes.object.isRequired,
  customer: PropTypes.object.isRequired
}

Customer.defaultProps = {
  customer: {},
  addNew: true
}

export default connect(({ customer }) => ({ customer }))(Customer)
