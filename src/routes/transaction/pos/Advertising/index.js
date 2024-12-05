import React from 'react'
import { IMAGEURL } from 'utils/config.company'
import { withoutFormat } from 'utils/string'
import { lstorage } from 'utils'

const Advertising = ({ list }) => {
  const storeId = lstorage.getCurrentUserStore()
  return (
    <div>
      {list && list.length > 0 && list.map((item) => {
        if (item && item.availableStore) {
          const listStores = item.availableStore.split(',')
          const isExistsStore = listStores.includes(`${storeId}`)
          if (isExistsStore) {
            return (
              <img
                height={item.height}
                width={item.width}
                src={`${IMAGEURL}/${withoutFormat(item.image)}-main.jpg`}
                alt="no_image"
              />
            )
          }
          return null
        }
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
