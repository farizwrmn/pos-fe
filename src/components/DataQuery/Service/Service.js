import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'
import { numberFormat } from 'utils'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const FormItem = Form.Item

const Service = ({
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
      title: 'Service Code',
      dataIndex: 'serviceCode',
      key: 'serviceCode',
      width: '15%'
    }, {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: '30%'
    }, {
      title: 'Service Cost',
      dataIndex: 'serviceCost',
      key: 'serviceCost',
      width: '15%',
      render: text => formatNumberIndonesia(text)
    }
  ],
  isModal = true,
  onRowClick,
  service,
  ...tableProps
}) => {
  const { searchText, list, pagination } = service
  // const { pagination } = tableProps
  const handleSearch = () => {
    dispatch({
      type: 'service/query',
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
      type: 'service/updateState',
      payload: {
        searchText: value
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'service/query',
      payload: {
        page: 1,
        pageSize: pagination.pageSize,
        q: null
      }
    })
    dispatch({
      type: 'service/updateState',
      payload: {
        searchText: null
      }
    })
  }
  const changeProduct = (page) => {
    dispatch({
      type: 'service/query',
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
            <Input placeholder="Search Service"
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
          rowKey={record => record.id}
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
            rowKey={record => record.id}
            onRowClick={onRowClick}
          />
        </div>)
      }
    </div>
  )
}

Service.propTypes = {
  form: PropTypes.object.isRequired,
  service: PropTypes.object.isRequired
}

export default connect(({ service }) => ({ service }))(Service)
