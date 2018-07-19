import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'
import { Link } from 'dva/router'
import { lstorage } from 'utils'

const FormItem = Form.Item
const width = 1000
const Promo = ({
  dispatch,
  className,
  visible = false,
  loading,
  columns = [
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      width: `${width * 0.15}px`,
      render: (text) => {
        return text === '0' ? 'Buy X Get Y' : 'Buy X Get Discount Y'
      }
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: `${width * 0.15}px`
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: `${width * 0.15}px`
    },
    {
      title: 'Period',
      dataIndex: 'Date',
      key: 'Date',
      width: `${width * 0.15}px`,
      render: (text, record) => {
        return `${record.startDate} ~ ${record.endDate}`
      }
    },
    {
      title: 'Available Date',
      dataIndex: 'availableDate',
      key: 'availableDate',
      width: `${width * 0.15}px`
    },
    {
      title: 'Available Hour',
      dataIndex: 'availableHour',
      key: 'availableHour',
      width: `${width * 0.1}px`,
      render: (text, record) => {
        return `${record.startHour} ~ ${record.endHour}`
      }
    }
  ],
  isModal = true,
  onRowClick,
  promo,
  ...tableProps
}) => {
  const { searchText, list, pagination } = promo
  // const { pagination } = tableProps
  const handleSearch = () => {
    dispatch({
      type: 'promo/query',
      payload: {
        page: 1,
        pageSize: 10,
        storeId: lstorage.getCurrentUserStore(),
        q: searchText
      }
    })
  }
  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'promo/updateState',
      payload: {
        searchText: value
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'promo/query',
      payload: {
        page: 1,
        pageSize: pagination.pageSize,
        storeId: lstorage.getCurrentUserStore(),
        q: null
      }
    })
    dispatch({
      type: 'promo/updateState',
      payload: {
        searchText: null
      }
    })
  }
  const changeProduct = (page) => {
    dispatch({
      type: 'promo/query',
      payload: {
        q: searchText,
        storeId: lstorage.getCurrentUserStore(),
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
        height="400px"
        footer={null}
        {...tableProps}
      >
        <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Promo"
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
        </Form>
        <Table
          {...tableProps}
          pagination={pagination}
          dataSource={list}
          loading={loading.effects['promo/query']}
          bordered
          scroll={{ x: 1000, y: 388 }}
          columns={columns}
          simple
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
            <Link target="_blank" to={'/master/product/stock'}><Button className="button-add-items-right" style={{ margin: '0px' }} icon="plus" type="dashed" size="large">Add New</Button></Link>
          </Form>
          <Table
            {...tableProps}
            pagination={pagination}
            dataSource={list}
            loading={loading.effects['promo/query']}
            bordered
            scroll={{ x: 1000, y: 388 }}
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

Promo.propTypes = {
  form: PropTypes.object.isRequired,
  promo: PropTypes.object.isRequired,
  loading: PropTypes.object
}

export default connect(({ promo, loading }) => ({ promo, loading }))(Promo)
