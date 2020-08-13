import React, { useState, useRef, useEffect, FC, useCallback } from "react";

import useScroll from "../hooks/useScroll"

export default function App() {
  const myref = useRef<HTMLDivElement>(null)
  const scrollInfo = useScroll(myref)
  console.log(scrollInfo.distance,scrollInfo.direction)
  return <div ref={myref} style={{ height: "100%", width:"100%", overflow:"auto"}}>
    <div style={{height:"1500px", width:"1600px"}}>
      <h2>asdasd</h2>
      <pre>
        adas
        asdasd <br/>




        asdsad <br/>
        43<br/>
        53<br/>
        5345<br/>

        5<br/>

        56
        7<br/>
        3
        5

        const styles = S<br/>
        
        tyleSheet.create<br/>
          fd
          gdf<br/><br/>
          gds
          <br/>
          dsf
          sdf<br/>
          dsf<br/>
          ds
          fs

        
        
      </pre>
    </div>
  </div>
}

