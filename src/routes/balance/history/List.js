import React from 'react'
// import PropTypes from 'prop-types'
import { Calendar } from 'antd'

const List = () => {
  const calendarProps = {
    mode: 'month',
    fullscreen: true
    // dateCellRender,
    // onSelect (value) {
    //   showBirthDayListModal(value)
    // },
    // onPanelChange (value, mode) {
    //   const month = moment(value).format('MM')
    //   changeCalendarMode(month, mode)
    // },
    // disabledDate (current) {
    //   return current <= moment().startOf('day')
    // }
  }

  return (
    <div>
      <Calendar {...calendarProps} />
    </div>
  )
}

List.propTypes = {

}

export default List
