import React, { useState, useRef, useEffect } from "react";

import NavPage from "../components/NavPage"


export default function NavPageDemo() {
  const data = [{
    section_id: 1,
    list: "楼层1"
  }, {
    section_id: 2,
    list: "楼层2"
  }, {
    section_id: 3,
    list: "楼层3"
  }, {
    section_id: 4,
    list: "楼层4"
  },{
    section_id: 5,
    list: "楼层5"
  },{
    section_id: 6,
    list: "楼层6"
  },{
    section_id: 7,
    list: "楼层7"
  }]
  const keyList = data.map(item =>  item.section_id)
  const [currentKey, setCurrentKey] = useState(0)
  const scrollNavRef = useRef(null)
  const fixedNavRef = useRef(null)

  const handleChangeActive = (key) => {
    setCurrentKey(+key)
  }

  const handleClick = (key) => {
    setCurrentKey(+key)
    fixedNavRef.current.scrollToFloor(+key);
  }

  // scrollToFloor Default Key
  useEffect(() => {
    setTimeout(() => {
      const defaultKey = 5
      setCurrentKey(defaultKey)
      fixedNavRef.current.scrollTo(+defaultKey);
    });
  },[])
  
  const floorIdPrefix = "J_section"
  const navIdPrefix = "J_nav_item"
  return <div id="J_nav_page_demo" style={{ height: "100%", overflow: "auto" }}>
    <div style={{ height: "200px" }}><h2>React Nav Page Demo</h2></div>

    <NavPage fixedStyle={styleFixedStyle} height={60} ref={fixedNavRef}  onChange={handleChangeActive} floorIdPrefix={floorIdPrefix} scrollContainer="#J_nav_page_demo" scrollNavContainer={scrollNavRef} navIdPrefix={navIdPrefix} keyList={keyList}>
      <nav style={styleNavWrap}>
        <ul ref={scrollNavRef} style={styleScrollNav}>
          {data.map((item: any) => {
            return <li style={{...styleNavItem,...Object.assign({},item.section_id === currentKey ? styleCurrent : {})}} id={`${navIdPrefix}${item.section_id}`} onClick={e => handleClick(item.section_id)} className={` ${item.section_id === currentKey ? 'current' : ''}`} key={item.section_id}>
              {item.list}
            </li>
          })}
        </ul>
      </nav>
    </NavPage>
    {
      data.map((item:any) => {
        return <div key={item.section_id} id={`${floorIdPrefix}${item.section_id}`} style={styleFloorItem}><h2>{item.list}</h2></div>
      })
    }
  </div>
}

const styleNavWrap:React.CSSProperties = {backgroundColor:"red"}
const styleFixedStyle:React.CSSProperties = {zIndex:999}
const styleScrollNav:React.CSSProperties = {height: "60px", overflow:"auto",whiteSpace: "nowrap"}
const styleNavItem:React.CSSProperties = {display: "inline-block", lineHeight:"60px", width:"100px", textAlign:"center"}
const styleFloorItem :React.CSSProperties= { height: "600px", border: "1px solid red", backgroundColor: "gray" }
const styleCurrent :React.CSSProperties= {
  backgroundColor:"gray"
}