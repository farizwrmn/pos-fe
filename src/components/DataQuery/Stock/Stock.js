import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Tag, Form, Input, Button, Icon } from 'antd'
import { numberFormat } from 'utils'
import styles from '../../../themes/index.less'

const { formatNumberIndonesia } = numberFormat

const FormItem = Form.Item

const Stock = ({
  dispatch,
  className,
  loading,
  visible = false,
  columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
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
      title: 'Sell Price',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    },
    {
      title: 'Active',
      dataIndex: 'active',
      key: 'active',
      render: (text) => {
        return <Tag color={text ? 'blue' : 'red'}>{text ? 'Active' : 'Non-Active'}</Tag>
      }
    },
    {
      title: 'Qty',
      dataIndex: 'count',
      key: 'count',
      width: '50px',
      className: styles.alignRight,
      render: (text) => {
        if (!loading.effects['pos/showProductQty']) {
          return text || 0
        }
        return <Icon type="loading" />
      }
    }
  ],
  isModal = true,
  enableFilter = true,
  showPagination = true,
  onRowClick,
  pos,
  ...tableProps
}) => {
  const { searchText, listProduct, pagination } = pos
  // const { pagination } = tableProps
  const handleSearch = () => {
    dispatch({
      type: 'pos/getProducts',
      payload: {
        page: 1,
        pageSize: 10,
        lov: 'variant',
        q: searchText
      }
    })
  }
  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'pos/updateState',
      payload: {
        searchText: value
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'pos/getProducts',
      payload: {
        page: 1,
        lov: 'variant'
      }
    })
    dispatch({
      type: 'pos/updateState',
      payload: {
        searchText: null
      }
    })
  }
  const changeProduct = (page) => {
    dispatch({
      type: 'pos/getProducts',
      payload: {
        q: searchText === '' ? null : searchText,
        lov: 'variant',
        page: Number(page.current),
        pageSize: Number(page.pageSize)
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
          dataSource={listProduct}
          loading={loading.effects['pos/getProducts']}
          bordered
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
          </Form>}
          <Table
            {...tableProps}
            pagination={showPagination ? pagination : false}
            dataSource={listProduct}
            bordered
            loading={loading.effects['pos/getProducts']}
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

Stock.propTypes = {
  form: PropTypes.object.isRequired,
  pos: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired
}

export default connect(({ pos, loading }) => ({ pos, loading }))(Stock)
