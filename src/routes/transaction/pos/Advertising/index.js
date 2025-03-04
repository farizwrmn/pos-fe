import React from 'react'
import { IMAGEURL } from 'utils/config.company'
import { withoutFormat } from 'utils/string'
import { lstorage } from 'utils'
import { Carousel } from 'antd'

const Advertising = ({ list }) => {
  const storeId = lstorage.getCurrentUserStore()
  return (
    <div>
      {list && list.length > 0 && list.map((item) => {
        let listImage = []
        if (item.typeAds === 'CUSTROLL') {
          try {
            listImage = JSON.parse(item.image)
          } catch (error) {
            console.log('Error: ', error)
          }
        }
        if (item && item.availableStore) {
          const listStores = item.availableStore.split(',')
          const isExistsStore = listStores.includes(`${storeId}`)
          if (isExistsStore) {
            if (item.typeAds === 'CUSTROLL' && listImage && listImage.length > 1) {
              return (
                <Carousel
                  height={item.height}
                  width={item.width}
                  autoplay
                >
                  {listImage.map((imageAds) => {
                    return (
                      <div>
                        <img
                          height={item.height}
                          width={item.width}
                          src={`${IMAGEURL}/${withoutFormat(imageAds)}-main.jpg`}
                          alt="no_image"
                        />
                      </div>
                    )
                  })}
                </Carousel>
              )
            }
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
        if (item.typeAds === 'CUSTROLL' && listImage && listImage.length > 1) {
          return (
            <Carousel
              height={item.height}
              width={item.width}
              autoplay
            >
              {listImage.map((imageAds) => {
                return (
                  <div>
                    <img
                      height={item.height}
                      width={item.width}
                      src={`${IMAGEURL}/${withoutFormat(imageAds)}-main.jpg`}
                      alt="no_image"
                    />
                  </div>
                )
              })}
            </Carousel>
          )
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
