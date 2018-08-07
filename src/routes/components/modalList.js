import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, Input, Form } from 'antd'

const FormItem = Form.Item

const ModalList = ({
  ...tableProps,
  onSearch,
  onReset,
  onClickRow,
  changeText,
  searchText,
  columns,
  placeholderText
}) => {
  const search = (e) => {
    const { value } = e.target
    onSearch(value)
  }
  const handleChange = (e) => {
    const { value } = e.target
    changeText(value)
  }
  const clickSearch = () => {
    onSearch(searchText)
  }

  const clickReset = () => {
    onReset()
  }

  const handleRowClick = (record) => {
    onClickRow(record)
  }

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <Input placeholder={placeholderText || ''}
            size="small"
            value={searchText}
            style={{ marginBottom: 16 }}
            onChange={e => handleChange(e)}
            onPressEnter={e => search(e)}
          />
        </FormItem>
        <FormItem>
          <Button size="small" type="primary" onClick={clickSearch}>Search</Button>
        </FormItem>
        <FormItem>
          <Button size="small" type="primary" onClick={clickReset}>Reset</Button>
        </FormItem>
      </Form>

      <Table
        {...tableProps}
        bordered
        columns={columns}
        simple
        size="small"
        rowKey={record => record.memberCode}
        onRowClick={record => handleRowClick(record)}
      />
    </div>
  )
}

ModalList.propTypes = {
  location: PropTypes.object,
  placeholderText: PropTypes.string,
  columns: PropTypes.object,
  dispatch: PropTypes.func,
  onSearch: PropTypes.func,
  onReset: PropTypes.func,
  onClickRow: PropTypes.func,
  changeText: PropTypes.func,
  searchText: PropTypes.func
}

export default ModalList
