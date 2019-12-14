import React from 'react'
import { Link } from 'dva/router'

const EmptyBookmarkGroup = () => {
  return (
    <div>
      {'No Bookmark '}
      <Link target="_blank" to="/master/product/bookmark">Add</Link>
    </div>
  )
}

export default EmptyBookmarkGroup
