import React from 'react'
import { IMAGEURL } from 'utils/config.company'
import { withoutFormat } from 'utils/string'

const ImageExpress = ({ item }) => {
  if (item && item) {
    if (item
      && item != null
      && item.productImage != null
      && item.productImage !== '["no_image.png"]'
      && item.productImage !== '"no_image.png"'
      && item.productImage !== 'no_image.png') {
      const expressImage = JSON.parse(item.productImage)
      if (expressImage && expressImage[0]) {
        return <img height="70px" src={`${IMAGEURL}/${withoutFormat(expressImage[0])}-cropped.jpg`} alt="no_image" />
      }
    }
  }


  return <img height="70px" src="/logo-k3mart.png" alt="no_image" />
}

export default ImageExpress
