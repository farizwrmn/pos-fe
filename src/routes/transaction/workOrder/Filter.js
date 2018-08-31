import React from 'react'
import moment from 'moment'
import { Form, Row, Col, DatePicker, Input, Button } from 'antd'
import styles from './index.less'
import ModalFilter from './ModalFilter'

const Search = Input.Search
const FormItem = Form.Item
const { RangePicker } = DatePicker

const formItemLayout = {
  labelCol: {
    xs: { span: 5 },
    sm: { span: 4 },
    md: { span: 4 },
    lg: { span: 2 }
  },
  wrapperCol: {
    xs: { span: 19 },
    sm: { span: 14 },
    md: { span: 14 },
    lg: { span: 12 }
  }
}

const leftColumn = {
  xs: 24,
  sm: 11,
  md: 12,
  lg: 14,
  style: {
    marginBottom: 10
  }
}

const rightColumn = {
  xs: 24,
  sm: 13,
  md: 12,
  lg: 10
}

const Filter = ({
  onFilterPeriod,
  onSearchByKeyword,
  openCloseModalFilter,
  onSubmitDataFilter,
  onResetDataFilter,
  modalFilter,
  start,
  end,
  q,
  form: {
    getFieldDecorator,
    resetFields
  }
}) => {
  const handleChangeDate = (date) => {
    let start = moment(date[0]).format('YYYY-MM-DD')
    let end = moment(date[1]).format('YYYY-MM-DD')
    onFilterPeriod(start, end)
    resetFields(['q'])
  }

  const searchByKeyword = (value) => {
    onSearchByKeyword(value)
    resetFields(['period'])
  }

  const disabledDate = (current) => {
    return current > moment(new Date())
  }

  const modalProps = {
    title: 'Filter',
    visible: modalFilter,
    onCheckDataSubmit (data) {
      onSubmitDataFilter(data)
      resetFields()
    },
    onCancel () {
      openCloseModalFilter()
    },
    disabledDate
  }

  return (
    <Row >
      <Col {...leftColumn} >
        <FormItem label="Period" {...formItemLayout}>
          {getFieldDecorator('period', {
            initialValue: (start && end) ? [moment(start), moment(end)] : []
          })(
            <RangePicker allowClear={false} disabledDate={disabledDate} onChange={handleChangeDate} />
          )}
        </FormItem>
      </Col>
      <Col {...rightColumn} >
        <div className={styles.filterWrapper}>
          <Button size="large" type="danger" onClick={onResetDataFilter}>Reset</Button>
          <Button size="large" onClick={openCloseModalFilter}>Filter</Button>
          {modalFilter && <ModalFilter {...modalProps} />}
          <FormItem className={styles.formSearch}>
            {getFieldDecorator('q', { initialValue: q })(
              <Search placeholder="Search" onSearch={searchByKeyword} />
            )}
          </FormItem>
        </div>
      </Col>
    </Row>
  )
}

export default Form.create()(Filter)
