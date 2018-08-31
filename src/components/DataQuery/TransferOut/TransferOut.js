import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Table, Modal, Form, Input, Button } from 'antd'
import { numberFormat, formatDate } from 'utils'
import styles from 'themes/index.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

const FormItem = Form.Item

const TransferOut = ({
  dispatch,
  className,
  visible = false,
  columns = [
    {
      title: 'ID',
      dataIndex: 'transNoId',
      key: 'transNoId'
    },
    {
      title: 'TransNo',
      dataIndex: 'transNo',
      key: 'transNo'
    },
    {
      title: 'Date',
      dataIndex: 'transDate',
      key: 'transDate',
      render: text => formatDate(text)
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
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      className: styles.alignRight
    },
    {
      title: 'Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      className: styles.alignRight,
      render: text => formatNumberIndonesia(text)
    }
  ],
  loading,
  isModal = true,
  enableFilter = true,
  showPagination = true,
  onRowClick,
  transferOut,
  ...tableProps
}) => {
  const tableOpts = {
    ...tableProps
  }
  const { searchText, listTrans, filterSearch, pagination } = transferOut
  // const { pagination } = tableProps
  const handleSearch = () => {
    dispatch({
      type: 'transferOut/queryHpokok',
      payload: {
        ...filterSearch,
        page: 1,
        pageSize: 10,
        q: searchText
      }
    })
  }
  const handleChange = (e) => {
    const { value } = e.target

    dispatch({
      type: 'transferOut/updateState',
      payload: {
        ...filterSearch,
        searchText: value
      }
    })
  }
  const handleReset = () => {
    dispatch({
      type: 'transferOut/queryHpokok',
      payload: {
        ...filterSearch,
        page: 1,
        pageSize: pagination.pageSize,
        q: null
      }
    })
    dispatch({
      type: 'transferOut/updateState',
      payload: {
        ...filterSearch,
        searchText: null
      }
    })
  }
  const changeProduct = (pageInfo) => {
    const { page, pageSize, q, ...other } = filterSearch
    dispatch({
      type: 'transferOut/queryHpokok',
      payload: {
        q: searchText,
        page: pageInfo.current,
        pageSize: pageInfo.pageSize,
        ...other
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
        {...tableOpts}
      >
        {enableFilter && <Form layout="inline">
          <FormItem>
            <Input
              placeholder="Search Transaction"
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
          {...tableOpts}
          pagination={showPagination ? pagination : false}
          dataSource={listTrans}
          bordered
          columns={columns}
          simple
          loading={loading.effects['transferOut/queryHpokok']}
          onChange={changeProduct}
          rowKey={record => record.transNoId}
          onRowClick={onRowClick}
        />
      </Modal>}
      {!isModal &&
        (<div>
          {enableFilter && <Form layout="inline">
            <FormItem>
              <Input
                placeholder="Search Transaction"
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
            dataSource={listTrans}
            bordered
            columns={columns}
            simple
            loading={loading.effects['transferOut/queryHpokok']}
            onChange={changeProduct}
            rowKey={record => record.transNoId}
            onRowClick={onRowClick}
          />
        </div>)
      }
    </div>
  )
}

TransferOut.propTypes = {
  form: PropTypes.object.isRequired,
  transferOut: PropTypes.object.isRequired
}

export default connect(({ transferOut }) => ({ transferOut }))(TransferOut)
