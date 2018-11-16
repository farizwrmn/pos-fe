import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'
import { Link } from 'dva/router'

const FormItem = Form.Item

const Asset = ({
  dispatch,
  className,
  visible = false,
  columns = [
    {
      title: 'Police No',
      dataIndex: 'policeNo',
      key: 'policeNo'
    },
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
  onRowClick,
  customerunit,
  ...tableProps
}) => {
  const { searchText, listAsset, pagination } = customerunit
  // const { pagination } = tableProps
  const handleSearch = () => {
    dispatch({
      type: 'customerunit/getMemberAssets',
      payload: {
        license: searchText
      }
    })
  }
  const handleChange = (e) => {
    const { value } = e.target
    dispatch({
      type: 'customerunit/updateState',
      payload: {
        searchText: value
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'customerunit/getMemberAssets',
      payload: {
        license: '',
        searchText: ''
      }
    })
  }
  const handleChangePagination = (page) => {
    dispatch({
      type: 'customerunit/updateState',
      payload: {
        listAsset: []
      }
    })
    dispatch({
      type: 'customerunit/getMemberAssets',
      payload: {
        license: searchText,
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
        title="Search Member By Asset"
        width="80%"
        height="80%"
        footer={null}
        {...tableProps}
      >
        {enableFilter && <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Member By Asset"
              value={searchText}
              onChange={e => handleChange(e)}
              onPressEnter={handleSearch}
              dataSource={listAsset}
              style={{ marginBottom: 16 }}
            />
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={handleSearch}>Search</Button>
          </FormItem>
          <FormItem>
            <Button onClick={handleReset}>Reset</Button>
          </FormItem>
          <Link target="_blank" to={'/master/customerunit'}><Button className="button-add-items-right" style={{ margin: '0px' }} icon="plus" type="dashed" size="large">Add New</Button></Link>
        </Form>}
        <Table
          {...tableProps}
          dataSource={listAsset}
          bordered
          columns={columns}
          simple
          pagination={pagination}
          onRowClick={onRowClick}
          onChange={handleChangePagination}
        />
      </Modal>}
      {!isModal &&
        (<div>
          {enableFilter && <Form layout="inline">
            <FormItem>
              <Input
                placeholder="Search Member By Asset"
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
            <Link target="_blank" to={'/master/service'}><Button className="button-add-items-right" style={{ margin: '0px' }} icon="plus" type="dashed" size="large">Add New</Button></Link>
          </Form>}
          <Table
            {...tableProps}
            dataSource={listAsset}
            bordered
            columns={columns}
            simple
            pagination={pagination}
            onRowClick={onRowClick}
            onChange={handleChangePagination}
          />
        </div>)
      }
    </div>
  )
}

Asset.propTypes = {
  form: PropTypes.object.isRequired,
  customerunit: PropTypes.object.isRequired
}

export default connect(({ customerunit }) => ({ customerunit }))(Asset)
