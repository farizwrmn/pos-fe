import React from 'react'
import PropTypes from 'prop-types'
import { Card, Avatar, Tabs, Spin, Pagination } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './bookmark.less'
import EmptyBookmark from './EmptyBookmark'
import EmptyBookmarkGroup from './EmptyBookmarkGroup'

const Bookmark = ({
  onChange,
  onChoose,
  loading,
  productBookmarkGroup,
  productBookmark
}) => {
  const listBookmark = productBookmarkGroup.list
  const { filter, list, pagination } = productBookmark
  const handleChangePagination = (page, pageSize) => {
    onChange(filter.groupId, page, pageSize)
  }

  return (
    <Card title="Bookmark">
      <Tabs onChange={onChange}>
        {listBookmark && listBookmark.length > 0 ?
          listBookmark.map((item => (
            <Tabs.TabPane tab={item.name} key={`${item.id}`}>
              {loading ? (
                <Spin className={styles.spin} />
              )
                : (
                  <div>
                    {list && list.length > 0 ?
                      list.map((item, index) => (
                        <Card.Grid onClick={() => onChoose(item.product)} key={index} className={styles.card}>
                          <div>
                            <Avatar size="large" src="/product-placeholder.jpg" />
                          </div>
                          <div>{item && item.product ? item.product.productCode : null}</div>
                          <div>
                            <h3>{item && item.product ? item.product.productName : null}</h3>
                          </div>
                          <div>{currencyFormatter(item.product.sellPrice)}</div>
                        </Card.Grid>
                      )) : (
                        <EmptyBookmark id={item.id} />
                      )}
                  </div>
                )}
            </Tabs.TabPane>
          )))
          : null}
      </Tabs>
      {listBookmark && listBookmark.length === 0 && (<EmptyBookmarkGroup />)}
      <Pagination onChange={handleChangePagination} {...pagination} showQuickJumper={false} showSizeChanger={false} />
    </Card>
  )
}

Bookmark.propTypes = () => ({
  productBookmarkGroup: PropTypes.object.isRequired,
  productBookmark: PropTypes.object.isRequired
})

export default Bookmark
