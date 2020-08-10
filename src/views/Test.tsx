import React, { useState, useRef, useEffect, FC, useCallback } from "react";


const Child = React.memo((props: any) => {
  console.log("子组件props", props)
  const { list, active } = props
  const handleClick = (item,e) => {
    props.onChange(item)
  }
  return <div>
    {
      list.map((item, index) => {
        return <div key={index} style={{backgroundColor: active === item ? 'red': 'transparent'}}><button onClick={e => handleClick(item,e)}>回调{item}</button> <br/></div>
      })
    }
  </div>
})


export default function App() {
  let [active, setActive] = useState(1)
  const [list, setList] = useState([1, 2, 3, 4, 5])
  
  const showActive = () => {
    console.log("当前key", active)
  }

  const handleChange = (key) => {
    console.log("key", key)
    setActive(key)
  }
  const add = () => {
    active +=1
    handleChange(active)
  }
  return <div>
    <h2>当前选中的key{active}</h2>
    <button onClick={add}>key 地增</button>
    <button onClick={showActive}>打印</button>
    <hr />
    <Child active={active} list={list} onChange={handleChange} />
  </div>
}

