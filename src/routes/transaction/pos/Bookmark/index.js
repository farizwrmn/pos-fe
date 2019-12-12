import React from 'react'
import PropTypes from 'prop-types'
import { Card, Avatar, Tabs } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './bookmark.less'

const Bookmark = ({
  productBookmarkGroup,
  productBookmark
}) => {
  const listBookmark = productBookmarkGroup.list
  const { list } = productBookmark

  return (
    <Card title="Bookmark">
      <Tabs>
        {listBookmark && listBookmark.length > 0 ? listBookmark.map((item => (
          <Tabs.TabPane tab={item.name} key={item.id}>
            {list && list.length > 0 ?
              list.map((item, index) => (
                <Card.Grid key={index} className={styles.card}>
                  <div>
                    <Avatar size="large" src="/product-placeholder.jpg" />
                  </div>
                  <div>{item.product.productCode}</div>
                  <div>
                    <h3>{item.product.productName}</h3>
                  </div>
                  <div>{currencyFormatter(item.product.sellPrice)}</div>
                </Card.Grid>
              )) : (
                null
              )}
          </Tabs.TabPane>
        )))
          : (
            null
          )}
      </Tabs>
    </Card>
  )
}

Bookmark.propTypes = () => ({
  productBookmarkGroup: PropTypes.object.isRequired,
  productBookmark: PropTypes.object.isRequired
})

export default Bookmark
