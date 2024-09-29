export type CategoryType = {
  id: number,
  name: string,
  pic: string,
}[]

export type GoodsType = {
  productId: number,
  productCount: number,
  productName: string,
  productPic: string,
  productUnit: string,
  productPrice: number
}

export type userInfoType = {
  userId: number,
  username: string,
  phone: string,
  balance: number,
  debtBalance: number,
  debt:number,

}

export type OrderType = {
  id: number,
  orderNo: number,
  createTime: number,
  orderPrice: number,
  orderRefundAmount: number,
  orderRefundStatus: number,
  orderState: number,
  phone: string,
  price: number,
  userId: number,
  username: string,
  items: {
    product: {
      productId: number
      productName: string
      productPic: string
      productPrice: number
      productUnit: string
    }
    productCount: number,
    refundAmount: string,
    refundCount: string,
  }[]
}[]

export type BillType = {

    billingType: number;
    income: number;
    createTime: number;
    amount: number;
    username:string;
    userId:number;
    type:number
    phone:string;
}[]


export type RefundType = {
  id: number,
  orderNo: string,
  refundNo:string,
  userId: number,
  phone: string,
  username: string,
  refundStatus: number,
  createTime: number,
  refundAmount:number,
  items: {
    product: {
      productId: number
      productName: string
      productPic: string
      productPrice: number
      productUnit: string
    }
    refundAmount: string,
    refundCount: string,
  }[]
}[]