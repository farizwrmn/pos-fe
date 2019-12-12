import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'antd'
import styles from './bookmark.less'

const Bookmark = ({
  productBookmarkGroup,
  productBookmark
}) => {
  console.log(
    productBookmarkGroup,
    productBookmark
  )

  return (
    <Card title="Bookmark">
      <Card.Grid className={styles.card}>Product</Card.Grid>
      <Card.Grid className={styles.card}>Product</Card.Grid>
      <Card.Grid className={styles.card}>Product</Card.Grid>
      <Card.Grid className={styles.card}>Product</Card.Grid>
      <Card.Grid className={styles.card}>Product</Card.Grid>
      <Card.Grid className={styles.card}>Product</Card.Grid>
    </Card>
  )
}

Bookmark.propTypes = () => ({
  productBookmarkGroup: PropTypes.object.isRequired,
  productBookmark: PropTypes.object.isRequired
})

export default Bookmark
