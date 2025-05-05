import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'dva'
import { Table, Tag, Modal, Form, Input, Button } from 'antd'
import { Link } from 'dva/router'
import { lstorage, calendar } from 'utils'
import PromoProductReward from '../PromoProductReward'

const { dayByNumber } = calendar
const FormItem = Form.Item
const width = 1000
const Promo = ({
  dispatch,
  className,
  visible = false,
  loading,
  detail = true,
  onChooseItem,
  enableChoosePromoDetail = true,
  showPagination = true,
  columns = [
    {
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      width: `${width * 0.115}px`,
      render: (text) => {
        if (`${text}` === '1') {
          return 'Bundling'
        }
        if (`${text}` === '2') {
          return 'Discount Auto On Quantity'
        }
        if (`${text}` === '3') {
          return 'Discount For Specific Items'
        }
      }
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: `${width * 0.1}px`
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
        return `${moment(record.startDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')} ~ ${moment(record.endDate, 'YYYY-MM-DD').format('DD-MMM-YYYY')}`
      }
    },
    {
      title: 'Available Date',
      dataIndex: 'availableDate',
      key: 'availableDate',
      width: `${width * 0.15}px`,
      render: (text) => {
        let date = text !== null ? text.split(',').sort() : <Tag color="green">{'Everyday'}</Tag>
        if (text !== null && (date || []).length === 7) {
          date = <Tag color="green">{'Everyday'}</Tag>
        }
        if (text !== null && (date || []).length < 7) {
          date = date.map(dateNumber => <Tag color="blue">{dayByNumber(dateNumber)}</Tag>)
        }
        return date
      }
    },
    {
      title: 'Apply Multiple',
      dataIndex: 'applyMultiple',
      key: 'applyMultiple',
      width: `${width * 0.15}px`,
      render: (text) => {
        return (
          <Tag color={text === '1' ? 'blue' : 'yellow'}>
            {text === '1' ? 'Multiple' : 'One Per Transaction'}
          </Tag>
        )
      }
    },
    {
      title: 'Available Hour',
      dataIndex: 'availableHour',
      key: 'availableHour',
      width: `${width * 0.1}px`,
      render: (text, record) => {
        return `${moment(record.startHour, 'HH:mm:ss').format('HH:mm')} ~ ${moment(record.endHour, 'HH:mm:ss').format('HH:mm')}`
      }
    }
  ],
  isModal = true,
  enableFilter = true,
  dataSource,
  onRowClick,
  promo,
  ...tableProps
}) => {
  const { searchText, list, pagination } = promo
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

  if (detail) {
    columns = columns.concat([{
      title: '',
      width: `${width * 0.08}px`,
      render: (text, record) => {
        return (
          <div>
            <PromoProductReward enableChoosePromoDetail={enableChoosePromoDetail} currentId={record.id} item={record} onChooseItem={() => onChooseItem(record)} />
          </div>
        )
      }
    }])
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
        {enableFilter && <Form layout="inline">
          <FormItem>
            <Input placeholder="Search Promo Name"
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
          dataSource={dataSource && dataSource.length > 0 ? dataSource : list}
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
            dataSource={dataSource && dataSource.length > 0 ? dataSource : list}
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
