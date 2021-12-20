import React from 'react'
import { IMAGEURL } from 'utils/config.company'
import { withoutFormat } from 'utils/string'

const Advertising = ({ list }) => {
  return (
    <div>
      {list && list.length > 0 && list.map((item) => {
        return (
          <img
            height={item.height}
            width={item.width}
            src={`${IMAGEURL}/${withoutFormat(item.image)}-main.jpg`}
            alt="no_image"
          />
        )
      })}
    </div>
  )
}

export default Advertising
