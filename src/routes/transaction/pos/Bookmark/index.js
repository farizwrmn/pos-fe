import React from 'react'
import PropTypes from 'prop-types'
import { Card, Tabs, Spin, Pagination } from 'antd'
// import { currencyFormatter } from 'utils/string'
import styles from './bookmark.less'
import EmptyBookmark from './EmptyBookmark'
import EmptyBookmarkGroup from './EmptyBookmarkGroup'

const gridStyle = {
  width: '50%',
  textAlign: 'center'
}

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
  const handleChangePagination = (page) => {
    onChange(filter.groupId, page)
  }

  return (
    <div>
      {listBookmark && listBookmark.length > 0 ? (
        <Card title={null}>
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
                            <Card.Grid
                              style={gridStyle}
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
                              <div>
                                <h4>{item && item.product ? item.product.productName : item.bundle.name}</h4>
                              </div>
                            </Card.Grid>
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
          <Pagination pageSize={14} onChange={handleChangePagination} {...pagination} showQuickJumper={false} showSizeChanger={false} />
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
