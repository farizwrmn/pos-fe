import React from 'react'
import { Button } from 'antd'
import { Link } from 'dva/router'
import classes from './ReportItem.less'

const ReportItem = ({
  title,
  content,
  paramText,
  url
}) => {
  return (
    <div className={classes.container}>
      <div><h1 className={classes.title}>{title}</h1></div>
      <div className={classes.content}>
        {content}
      </div>
      <div className={classes.buttonAction}>
        <Link to={url}><Button>{paramText || 'Lihat Laporan'}</Button></Link>
      </div>
    </div>
  )
}

export default ReportItem
