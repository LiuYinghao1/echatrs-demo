import request from "@/utils/request";

const getSeller=()=>{
  return request({
    url:'seller',
    method:'POST'
  })
}


const getTrend=()=>{
  return request({
    url:'trend',
    method:'POST'
  })
}

const getMap=()=>{
  return request({
    url:'map',
    method:'POST'
  })
}

const getRank=()=>{
  return request({
    url:'rank',
    method:'POST'
  })
}

const getHot=()=>{
  return request({
    url:'hot',
    method:'POST'
  })
}

const getStock=()=>{
  return request({
    url:'stock',
    method:'POST'
  })
}

export default{
  getSeller,
  getTrend,
  getMap,
  getRank,
  getHot,
  getStock
}