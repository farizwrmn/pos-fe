import React from 'react'
import { Link } from 'dva/router'

const EmptyBookmark = ({ id }) => {
  return (
    <div>
      {'No Bookmark '}
      <Link target="_blank" to={`/master/product/bookmark/${id}`}>Add</Link>
    </div>
  )
}

export default EmptyBookmark
