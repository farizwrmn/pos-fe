const reArrangeMember = (item) => {
  return {
    memberCode: item.memberCode,
    memberName: item.memberName,
    address01: item.address01,
    cashback: item.cashback ? item.cashback : 0,
    id: item.id,
    memberTypeName: item.memberTypeName,
    memberTypeId: item.memberTypeId,
    memberSellPrice: item.memberSellPrice,
    memberPendingPayment: item.memberPendingPayment,
    gender: item.gender,
    phone: item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
  }
}

const reArrangeMemberId = (item) => {
  return {
    memberCode: item.memberCode,
    memberName: item.memberName,
    address01: item.address01,
    cashback: item.cashback ? item.cashback : 0,
    id: item.memberId,
    memberTypeName: item.memberTypeName,
    memberTypeId: item.memberTypeId,
    memberSellPrice: item.memberSellPrice,
    memberPendingPayment: item.memberPendingPayment,
    gender: item.gender,
    phone: item.mobileNumber === '' ? item.phoneNumber : item.mobileNumber
  }
}

module.exports = {
  reArrangeMember,
  reArrangeMemberId
}
