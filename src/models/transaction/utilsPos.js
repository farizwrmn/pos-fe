/* eslint-disable no-loop-func */
export const getListProductAfterBundling = (listProduct = [], bundle = []) => {
  let listNewCashier = [
    ...listProduct.filter(filtered => filtered.bundleId)
  ]
  let listNewBundle = [
    ...bundle
  ]
  const listProbBundle = listProduct.filter(filtered => !filtered.bundleId)
  let listBundle = {}
  for (let key in listProbBundle) {
    const product = listProbBundle[key]
    if (listBundle[product.probBundleId]) {
      listBundle[product.probBundleId] = {
        probBundleId: product.probBundleId,
        probBundleCode: product.probBundleCode,
        probBundleName: product.probBundleName,
        probBundleTargetQty: product.probBundleTargetQty,
        probFinalPrice: product.probFinalPrice,
        probBundle: product.probBundle,
        listProduct: []
      }
    } else {
      listBundle[product.probBundleId] = {
        probBundleId: product.probBundleId,
        probBundleCode: product.probBundleCode,
        probBundleName: product.probBundleName,
        probBundleTargetQty: product.probBundleTargetQty,
        probFinalPrice: product.probFinalPrice,
        probBundle: product.probBundle,
        listProduct: []
      }
    }
  }
  const listProductNotProcess = listProduct.filter(filtered => !filtered.bundleId)
  for (let key in listProductNotProcess) {
    const product = listProductNotProcess[key]
    if (!product.bundleId) {
      if (product.probBundleId
        && product.probBundleTargetQty > 0
        && product.qty > 0) {
        let qty = product.qty
        let existsQty = 0
        if (listBundle[product.probBundleId]
          && listBundle[product.probBundleId].listProduct
          && listBundle[product.probBundleId].listProduct.length > 0
        ) {
          existsQty = listBundle[product.probBundleId].listProduct.reduce((prev, next) => prev + next.qty, 0)
        }
        if ((existsQty + qty) >= product.probBundleTargetQty) {
          const price = Math.ceil(product.probFinalPrice / product.probBundleTargetQty)
          for (let index in listBundle[product.probBundleId].listProduct) {
            listBundle[product.probBundleId].listProduct[index].bundleId = product.probBundleId
            listBundle[product.probBundleId].listProduct[index].bundleCode = product.probBundleCode
            listBundle[product.probBundleId].listProduct[index].bundleName = product.probBundleName
            listBundle[product.probBundleId].listProduct[index].price = price
            listBundle[product.probBundleId].listProduct[index].retailPrice = price
            listBundle[product.probBundleId].listProduct[index].distPrice01 = price
            listBundle[product.probBundleId].listProduct[index].distPrice02 = price
            listBundle[product.probBundleId].listProduct[index].distPrice03 = price
            listBundle[product.probBundleId].listProduct[index].distPrice04 = price
            listBundle[product.probBundleId].listProduct[index].distPrice05 = price
            listBundle[product.probBundleId].listProduct[index].distPrice06 = price
            listBundle[product.probBundleId].listProduct[index].distPrice07 = price
            listBundle[product.probBundleId].listProduct[index].distPrice08 = price
            listBundle[product.probBundleId].listProduct[index].distPrice09 = price
            listBundle[product.probBundleId].listProduct[index].sellPrice = price
            listBundle[product.probBundleId].listProduct[index].sellingPrice = price
            listBundle[product.probBundleId].listProduct[index].total = price * listBundle[product.probBundleId].listProduct[index].qty

            listNewCashier.push({
              ...listBundle[product.probBundleId].listProduct[index],
              transLog: 1,
              probBundle: undefined,
              probBundleId: undefined,
              probBundleCode: undefined,
              probBundleName: undefined,
              probBundleTargetQty: undefined,
              probFinalPrice: undefined,
              no: listNewCashier.length + 1
            })
          }
          const newQtyPrevious = product.probBundleTargetQty - listBundle[product.probBundleId].listProduct.reduce((prev, next) => prev + next.qty, 0)
          const newTotalPrevious = product.probFinalPrice - listBundle[product.probBundleId].listProduct.reduce((prev, next) => prev + next.total, 0)
          const newPricePrevious = newTotalPrevious / newQtyPrevious

          listNewCashier.push({
            ...product,
            transLog: 2,
            no: listNewCashier.length + 1,
            probBundle: undefined,
            probBundleId: undefined,
            probBundleCode: undefined,
            probBundleName: undefined,
            probBundleTargetQty: undefined,
            probFinalPrice: undefined,
            bundleId: product.probBundleId,
            bundleCode: product.probBundleCode,
            bundleName: product.probBundleName,
            price: newPricePrevious,
            retailPrice: newPricePrevious,
            distPrice01: newPricePrevious,
            distPrice02: newPricePrevious,
            distPrice03: newPricePrevious,
            distPrice04: newPricePrevious,
            distPrice05: newPricePrevious,
            distPrice06: newPricePrevious,
            distPrice07: newPricePrevious,
            distPrice08: newPricePrevious,
            distPrice09: newPricePrevious,
            sellPrice: newPricePrevious,
            sellingPrice: newPricePrevious,
            total: newTotalPrevious,
            qty: newQtyPrevious
          })

          const existBundleId = listNewBundle.filter(filtered => filtered.bundleId === product.probBundle.id)
          if (existBundleId && existBundleId[0]) {
            listNewBundle = listNewBundle.map((item) => {
              if (item.bundleId === product.probBundle.id) {
                item.qty += 1
              }
              return item
            })
          } else {
            listNewBundle.push({
              alwaysOn: product.probBundle.alwaysOn,
              applyMultiple: product.probBundle.applyMultiple,
              availableDate: product.probBundle.availableDate,
              buildComponent: product.probBundle.buildComponent,
              bundleId: product.probBundle.id,
              code: product.probBundle.code,
              endDate: product.probBundle.endDate,
              endHour: product.probBundle.endHour,
              haveTargetPrice: false,
              inputTime: new Date().valueOf(),
              minimumPayment: product.probBundle.minimumPayment,
              name: product.probBundle.name,
              no: listNewBundle.length + 1,
              paymentBankId: product.probBundle.paymentBankId,
              paymentOption: product.probBundle.paymentOption,
              qty: 1,
              rewardCategory: [],
              startDate: product.probBundle.startDate,
              startHour: product.probBundle.startHour,
              targetCostPrice: product.probBundle.targetCostPrice,
              targetRetailPrice: product.probBundle.targetRetailPrice,
              type: product.probBundle.type
            })
          }

          listBundle[product.probBundleId].listProduct = []


          const productQty = (existsQty + qty) - product.probBundleTargetQty
          if (productQty > 0) {
            const bundleQty = productQty / product.probBundleTargetQty
            if (bundleQty >= 1) {
              const finalQty = productQty / product.probBundleTargetQty
              const finalPrice = Math.ceil((product.probFinalPrice * finalQty) / (product.probBundleTargetQty * finalQty))

              listNewCashier.push({
                ...product,
                transLog: 3,
                no: listNewCashier.length + 1,
                probBundle: undefined,
                probBundleId: undefined,
                probBundleCode: undefined,
                probBundleName: undefined,
                probBundleTargetQty: undefined,
                probFinalPrice: undefined,
                bundleId: product.probBundleId,
                bundleCode: product.probBundleCode,
                bundleName: product.probBundleName,
                price: finalPrice,
                retailPrice: finalPrice,
                distPrice01: finalPrice,
                distPrice02: finalPrice,
                distPrice03: finalPrice,
                distPrice04: finalPrice,
                distPrice05: finalPrice,
                distPrice06: finalPrice,
                distPrice07: finalPrice,
                distPrice08: finalPrice,
                distPrice09: finalPrice,
                sellPrice: finalPrice,
                sellingPrice: finalPrice,
                total: product.probFinalPrice * finalQty,
                qty: product.probBundleTargetQty * finalQty
              })

              const existBundleId = listNewBundle.filter(filtered => filtered.bundleId === product.probBundle.id)
              if (existBundleId && existBundleId[0]) {
                listNewBundle = listNewBundle.map((item) => {
                  if (item.bundleId === product.probBundle.id) {
                    item.qty += finalQty
                  }
                  return item
                })
              } else {
                listNewBundle.push({
                  alwaysOn: product.probBundle.alwaysOn,
                  applyMultiple: product.probBundle.applyMultiple,
                  availableDate: product.probBundle.availableDate,
                  buildComponent: product.probBundle.buildComponent,
                  bundleId: product.probBundle.id,
                  code: product.probBundle.code,
                  endDate: product.probBundle.endDate,
                  endHour: product.probBundle.endHour,
                  haveTargetPrice: false,
                  inputTime: new Date().valueOf(),
                  minimumPayment: product.probBundle.minimumPayment,
                  name: product.probBundle.name,
                  no: listNewBundle.length + 1,
                  paymentBankId: product.probBundle.paymentBankId,
                  paymentOption: product.probBundle.paymentOption,
                  qty: finalQty,
                  rewardCategory: [],
                  startDate: product.probBundle.startDate,
                  startHour: product.probBundle.startHour,
                  targetCostPrice: product.probBundle.targetCostPrice,
                  targetRetailPrice: product.probBundle.targetRetailPrice,
                  type: product.probBundle.type
                })
              }
            }
            const qtyLeft = productQty % product.probBundleTargetQty
            if (qtyLeft > 0) {
              listNewCashier.push({
                ...product,
                transLog: 4,
                probBundle: undefined,
                probBundleId: undefined,
                probBundleCode: undefined,
                probBundleName: undefined,
                probBundleTargetQty: undefined,
                probFinalPrice: undefined,
                no: listNewCashier.length + 1,
                total: product.sellPrice * qtyLeft,
                qty: qtyLeft
              })
            }
          }
        } else {
          // product.qty =
          listBundle[product.probBundleId].listProduct = listBundle[product.probBundleId].listProduct.concat([product])
        }
      } else {
        const existsProduct = listNewCashier.filter(filtered => filtered.productId === product.productId && !filtered.bundleId)
        if (existsProduct && existsProduct[0]) {
          listNewCashier = listNewCashier.map((item) => {
            if (item.productId === product.productId && item.bundleId == null) {
              item.qty += product.qty
              item.total += product.total
            }
            return item
          })
        } else {
          listNewCashier.push({
            ...product,
            transLog: 5,
            no: listNewCashier.length + 1
          })
        }
      }
    } else {
      const existsProduct = listNewCashier.filter(filtered => filtered.productId === product.productId && !filtered.bundleId)
      if (existsProduct && existsProduct[0]) {
        listNewCashier = listNewCashier.map((item) => {
          if (item.productId === product.productId && item.bundleId == null) {
            item.qty += product.qty
            item.total += product.total
          }
          return item
        })
      } else {
        listNewCashier.push({
          ...product,
          transLog: 6,
          no: listNewCashier.length + 1
        })
      }
    }
  }
  for (let key in listBundle) {
    const bundle = listBundle[key]
    for (let index in bundle.listProduct) {
      const product = bundle.listProduct[index]
      const existsProduct = listNewCashier.filter(filtered => filtered.productId === product.productId && !filtered.bundleId)
      if (existsProduct && existsProduct[0]) {
        listNewCashier = listNewCashier.map((item) => {
          if (item.productId === product.productId && item.bundleId == null) {
            item.qty += product.qty
            item.total += product.total
          }
          return item
        })
      } else {
        listNewCashier.push({
          ...product,
          transLog: 7,
          no: listNewCashier.length + 1
        })
      }
    }
  }
  return ({
    cashier: listNewCashier.map((item, index) => ({ ...item, no: index + 1 })),
    bundle: listNewBundle
  })
}
