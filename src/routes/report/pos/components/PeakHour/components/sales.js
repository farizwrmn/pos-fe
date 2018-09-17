import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { color, numberFormat } from 'utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { connect } from 'dva'
import moment from 'moment'
import styles from './sales.less'

const formatNumberIndonesia = numberFormat.formatNumberIndonesia

class CustomizedLabel extends React.Component {
  render () {
    const { x, y, stroke, value } = this.props

    return <text x={x} y={y} dy={-4} fill={stroke} fontSize={11} textAnchor="middle">{value === 0 ? null : value}</text>
  }
}

const Sales = ({
  data
}) => {
  return (
    <div className={styles.sales}>
      <div className={styles.title}>
        Peak Hour
      </div>
      <ResponsiveContainer minHeight={360}>
        <LineChart data={data}>
          <Legend verticalAlign="top"
            content={(prop) => {
              const { payload } = prop
              return (<ul className={classnames({ [styles.legend]: true, clearfix: true })}>
                {payload.map((item, key) => <li key={key}><span className={styles.radiusdot} style={{ background: item.color }} />{item.value}</li>)}
              </ul>)
            }}
          />
          <XAxis dataKey="name" axisLine={{ stroke: color.borderBase, strokeWidth: 1 }} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <CartesianGrid vertical={false} stroke={color.borderBase} strokeDasharray="3 3" />
          <Tooltip
            wrapperStyle={{ border: 'none', boxShadow: '4px 4px 40px rgba(0, 0, 0, 0.05)' }}
            content={(content) => {
              const label = (parseFloat(content.label) + 1 || '').toString()
              const list = content.payload.map((item, key) => <li key={key} className={styles.tipitem}><span className={styles.radiusdot} style={{ background: item.color }} />{`${item.name}:${formatNumberIndonesia(item.value)}`}</li>)
              return <div className={styles.tooltip}><p className={styles.tiptitle}>{`${moment(content.label, 'H').format('HH:mm')} ~ ${moment(label, 'H').format('HH:mm')}`}</p><ul>{list}</ul></div>
            }}
          />
          <Line type="linear" dataKey="CustomerIn" stroke={color.pastelgreen} strokeWidth={3} dot={{ fill: color.pastelgreen }} activeDot={{ r: 5, strokeWidth: 0 }} label={<CustomizedLabel />} />
          <Line type="linear" dataKey="CustomerOut" stroke={color.wewak} strokeWidth={3} dot={{ fill: color.wewak }} activeDot={{ r: 5, strokeWidth: 0 }} label={<CustomizedLabel />} />
          <Line type="linear" dataKey="CurrentCustomer" stroke={color.orange} strokeWidth={3} dot={{ fill: color.wewak }} activeDot={{ r: 5, strokeWidth: 0 }} label={<CustomizedLabel />} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

Sales.propTypes = {
  data: PropTypes.array
}

export default connect(({ dashboard }) => ({ dashboard }))(Sales)
