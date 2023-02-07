import React from 'react'
import { IMAGEURL } from 'utils/config.company'
import { withoutFormat } from 'utils/string'

const ImageBookmark = ({ item }) => {
  if (item && item.product) {
    if (item.product
      && item.product != null
      && item.product.productImage != null
      && item.product.productImage !== '["no_image.png"]'
      && item.product.productImage !== '"no_image.png"'
      && item.product.productImage !== 'no_image.png') {
      const bookmarkImage = JSON.parse(item.product.productImage)
      if (bookmarkImage && bookmarkImage[0]) {
        return <img height="70px" src={`${IMAGEURL}/${withoutFormat(bookmarkImage[0])}-main.jpg`} alt="no_image" />
      }
    }
  }

  if (item && item.bundle) {
    if (item.bundle
      && item.bundle != null
      && item.bundle.productImage != null
      && item.bundle.productImage !== '["no_image.png"]'
      && item.bundle.productImage !== '"no_image.png"'
      && item.bundle.productImage !== 'no_image.png') {
      const bookmarkImage = JSON.parse(item.bundle.productImage)
      if (bookmarkImage && bookmarkImage[0]) {
        return <img height="70px" src={`${IMAGEURL}/${withoutFormat(bookmarkImage[0])}-main.jpg`} alt="no_image" />
      }
    }
  }

  return <img height="70px" src="/logo-k3mart.png" alt="no_image" />
}

export default ImageBookmark
