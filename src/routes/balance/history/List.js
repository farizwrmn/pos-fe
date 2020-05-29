import React from 'react'
// import PropTypes from 'prop-types'
import { Calendar } from 'antd'
import moment from 'moment'
import { lstorage } from 'utils'
import styles from './List.less'

const List = ({
  listBalance,
  allStore,
  dispatch
}) => {
  function getListData (value) {
    const filteredData = listBalance.filter(filtered => moment(filtered.open).format('YYYY-MM-DD') === value.format('YYYY-MM-DD'))
    let listData = filteredData
    return listData || []
  }

  const queryDetail = (item) => {
    dispatch({
      type: 'balanceDetail/query',
      payload: {
        balanceId: item.id,
        relationship: 1,
        type: 'all'
      }
    })
    dispatch({
      type: 'balance/updateState',
      payload: {
        modalDetailVisible: true,
        currentItem: item
      }
    })
  }

  function dateCellRender (value) {
    const listData = getListData(value)
    return (
      <ul className="events">
        {
          listData.map((item, index) => (
            <li key={index}>
              <span onClick={() => queryDetail(item)} className={item.closed ? styles.eventClose : styles.eventOpen}>{`● ${allStore ? `${item.store.storeName}: ` : ''}${item.shift.shiftName} - ${item.closed ? 'closed' : 'open'}`}</span>
            </li>
          ))
        }
      </ul>
    )
  }
  const calendarProps = {
    mode: 'month',
    fullscreen: true,
    dateCellRender,
    // onSelect (value) {
    //   showBirthDayListModal(value)
    // },
    onPanelChange (value) {
      const month = moment(value).format('MM')
      const year = moment(value).format('YYYY')
      dispatch({
        type: 'balance/query',
        payload: {
          relationship: 1,
          history: 1,
          month,
          year,
          storeId: lstorage.getCurrentUserStore()
        }
      })
      dispatch({
        type: 'balance/updateState',
        payload: {
          currentDate: value
        }
      })
    },
    disabledDate (current) {
      return current >= moment().startOf('day')
    }
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
