import React, { useState,useRef, useEffect, FC, useCallback } from "react";


const Child = React.memo((props:any) => {
  console.log("子组件props", props)
  const {name,list} = props;
  const showName = useCallback(() => {
    console.log("子组件的name", list.length)
  },[list])
  return <div>
    <button onClick={props.onChange}>回调</button>
    <button onClick={showName}>打印父组件的name</button>
    <h2>父组件传递回来的name ： {name}</h2>
  </div>
})


export default function App() {
  const [count,setCount] = useState(0)
  const [name,setName] = useState("哈哈")
  const [list ,setList] = useState([])
  const handleCount = (e:any) => {
    setCount(c => c + 1)
  }

  const handleName = (e:any) => {
    setList([12])
    setName("呵呵")
  }
  const handleChange = useCallback(() => {
    console.log("父组件的回调函数")
  },[])
  return <div>
    <h2>我是父组件 {count}</h2>
    <button onClick={e => handleCount(e)}>更改count</button>
    <button onClick={e => handleName(e)}>更改name</button>
    <Child name={name} list={list} onChange={handleChange}/>
  </div>
}

