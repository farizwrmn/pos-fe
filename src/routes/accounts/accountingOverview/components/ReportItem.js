import React from 'react'
import { Button } from 'antd'
import classes from './ReportItem.less'

const ReportItem = ({
  title,
  content,
  paramText,
  onClick
}) => {
  return (
    <div className={classes.container}>
      <div><h1 className={classes.title}>{title}</h1></div>
      <div className={classes.content}>
        {content}
      </div>
      <div className={classes.buttonAction}>
        <Button onClick={() => onClick()}>{paramText || 'Lihat Laporan'}</Button>
      </div>
    </div>
  )
}

export default ReportItem
