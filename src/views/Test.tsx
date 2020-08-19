import React, { useState, useRef, useEffect, FC, useCallback } from "react";

import CountDown from "../hooks/CountDown"
import FixedNav from "../components/FixedNav"
// export default function App() {

//   const template = `
//     <div className="count-down">
//       <span className="num">%H</span>
//       <span className="text">时</span>
//       <span className="num">%M</span>
//       <span className="text">分</span>
//       <span className="num">%S</span>
//       <span className="text">秒</span>
//     </div>
//   `
//   const handleFinish = () => {
//     console.log("倒计时结束")
//   }
//   return <div>
//     <CountDown onFinish={handleFinish} leftTime={10} template={template}></CountDown>


//   </div>
// }


export default function PageNavTime() {
  const [active, setActive] = useState(1)
  const [currentKey, setCurrentKey] = useState(1)
  const data = [{
    section_id: 1,
    list: "灰色"
  }, {
    section_id: 2,
    list: "白色"
  }, {
    section_id: 3,
    list: "红色"
  }, {
    section_id: 4,
    list: "蓝色"
  },{
    section_id: 5,
    list: "橙色"
  },{
    section_id: 6,
    list: "黑色"
  },{
    section_id: 7,
    list: "粉色"
  }]
  const themeColor = "red"
  let styleNavItem: React.CSSProperties = { width: '100%' }
  if (data.length > 3) {
    styleNavItem = { width: 'auto', paddingLeft: "8px", paddingRight: "8px" }
  } else if (data.length === 3) {
    styleNavItem = { width: '33.3333%' }
  } else if (data.length === 2) {
    styleNavItem = { width: '50%' }
  }

  const scrollNavRef = useRef(null)
  const fixedNavRef = useRef(null)

  const handleChangeActive = (key) => {
    setCurrentKey(+key)
  }

  const handleClick = (key) => {
    setCurrentKey(+key)
    fixedNavRef.current.handleScrollToFloor(+key);
  }



  return <div id="J_seckill_list_wrap" style={{ height: "100%", overflow: "auto" }}>
    <div style={{ height: "200px" }}><h2>哈哈</h2></div>

    <FixedNav ref={fixedNavRef}  onChange={handleChangeActive} floorIdPrefix="J_section" scrollContainer="#J_seckill_list_wrap" scrollNavContainer={scrollNavRef} navIdPrefix="J_nav_time" keyList={[1,2,3,4,5,6,7]}>
      <div className="nav-time-wrap">
        <nav className="time-list">
          <ul ref={scrollNavRef}>
            {data.map((item: any, index) => {
              return <li id={`J_nav_time${item.section_id}`} onClick={e => handleClick(item.section_id)} className={` ${item.section_id === currentKey ? 'current' : ''}`} key={item.section_id} style={styleNavItem}>
                <span className="time">8月6日 12:00</span>
                <span className="status-text">{item.list}</span>
              </li>
            })}
          </ul>
        </nav>
      </div>
    </FixedNav>
    <div id="J_section1" style={{ height: "200px", border: "1px solid gray", backgroundColor: "gray" }}><h2>灰色</h2></div>
    <div id="J_section2" style={{ height: "200px", border: "1px solid gray", backgroundColor: "#FFF",paddingTop:"100px",marginTop:"20px" }}><h2>白色</h2></div>
    <div id="J_section3" style={{ height: "200px", border: "1px solid red",backgroundColor:"red" }}><h2>红色</h2></div>
    <div id="J_section4" style={{ height: "200px", border: "1px solid blue" ,backgroundColor:"blue"}}><h2>蓝色</h2></div>
    <div id="J_section5" style={{ height: "200px", border: "1px solid blue" ,backgroundColor:"yellow"}}><h2>蓝色</h2></div>
    <div id="J_section6" style={{ height: "200px", border: "1px solid blue" ,backgroundColor:"black"}}><h2>黑色</h2></div>
    <div id="J_section7" style={{ height: "200px", border: "1px solid blue" ,backgroundColor:"pink"}}><h2>粉色</h2></div>
    
  </div>
}
