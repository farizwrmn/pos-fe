import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Table, DatePicker, Form } from 'antd'

const { RangePicker } = DatePicker
const FormItem = Form.Item

const ModalListHistory = ({
  ...tableProps,
  columns,
  changeDate
}) => {
  const onChange = (date, dateString) => {
    const fromDate = moment(dateString[0]).format('YYYY-MM-DD')
    const toDate = moment(dateString[1]).format('YYYY-MM-DD')
    changeDate(fromDate, toDate)
  }

  return (
    <div>
      <Form layout="inline">
        <FormItem>
          <RangePicker size="small" onChange={onChange} />
        </FormItem>
      </Form>

      <Table
        {...tableProps}
        bordered
        scroll={{ x: '640px', y: 388 }}
        columns={columns}
        simple
        size="small"
        rowKey={record => record.id}
      />
    </div>
  )
}

ModalListHistory.propTypes = {
  location: PropTypes.object,
  columns: PropTypes.object,
  dispatch: PropTypes.func,
  changeDate: PropTypes.func,
  from: PropTypes.string,
  to: PropTypes.string
}

export default ModalListHistory
