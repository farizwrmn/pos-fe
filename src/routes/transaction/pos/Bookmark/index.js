import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
// import { currencyFormatter } from 'utils/string'
import styles from './bookmark.less'
import EmptyBookmarkGroup from './EmptyBookmarkGroup'

const gridStyle = {
  width: '50%',
  textAlign: 'center'
}

const Bookmark = ({
  onChange,
  productBookmarkGroup
}) => {
  const listBookmark = productBookmarkGroup.list
  return (
    <div>
      {listBookmark && listBookmark.length > 0 ? (
        <Card title={null}>
          {listBookmark.map((item => (
            <Card.Grid
              style={gridStyle}
              key={item.id}
              className={styles.card}
              onClick={() => {
                onChange(item.id, 1)
              }}
            >
              <div>
                <h4>{item.name}</h4>
              </div>
            </Card.Grid>
          )))}
          {listBookmark && listBookmark.length === 0 && (<EmptyBookmarkGroup />)}
        </Card>
      ) : null}
    </div>
  )
}

Bookmark.propTypes = () => ({
  productBookmarkGroup: PropTypes.object.isRequired,
  productBookmark: PropTypes.object.isRequired
})

export default Bookmark
