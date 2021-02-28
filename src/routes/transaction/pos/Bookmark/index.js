import React from 'react'
import PropTypes from 'prop-types'
import { Card, Tabs, Spin, Pagination } from 'antd'
import { currencyFormatter } from 'utils/string'
import styles from './bookmark.less'
import EmptyBookmark from './EmptyBookmark'
import EmptyBookmarkGroup from './EmptyBookmarkGroup'

const Bookmark = ({
  onChange,
  onChoose,
  onChooseBundle,
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
    <div>
      {listBookmark && listBookmark.length > 0 ? (
        <Card title="Bookmark">
          <Tabs onChange={onChange}>
            {listBookmark.map((item => (
              <Tabs.TabPane tab={item.name} key={`${item.id}`}>
                {loading ? (
                  <Spin className={styles.spin} />
                )
                  : (
                    <div>
                      {list && list.length > 0 ?
                        list.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className={styles.card}
                              onClick={() => {
                                if (item.type === 'PRODUCT') {
                                  onChoose(item.product)
                                }
                                if (item.type === 'BUNDLE') {
                                  onChooseBundle(item.bundle)
                                }
                              }}
                            >
                              {/* <div>
                                <Avatar size="large" src="/product-placeholder.jpg" />
                              </div> */}
                              <div>{item && item.product ? item.product.productCode : item.bundle.code}</div>
                              <div>
                                <h3>{item && item.product ? item.product.productName : item.bundle.name}</h3>
                              </div>
                              <div>{item && item.product ? currencyFormatter(item.product.sellPrice) : null}</div>
                            </div>
                          )
                        }) : (
                          <EmptyBookmark id={item.id} />
                        )}
                    </div>
                  )}
              </Tabs.TabPane>
            )))}
          </Tabs>
          {listBookmark && listBookmark.length === 0 && (<EmptyBookmarkGroup />)}
          <Pagination onChange={handleChangePagination} {...pagination} showQuickJumper={false} showSizeChanger={false} />
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
