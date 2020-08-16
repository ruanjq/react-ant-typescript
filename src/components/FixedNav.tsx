import useScroll from "../hooks/useScroll"
import React, { RefObject, useState, useRef, ReactNode, FunctionComponentElement, useEffect, useMemo, useImperativeHandle, forwardRef } from "react"



interface fixedNavProps {
  scrollContainer: RefObject<HTMLElement> | string;
  scrollNavContainer: RefObject<HTMLElement> | string;
  zIndex?: number
  floorIdPrefix?: string
  navIdPrefix?: string
  children?: any
  activeKey?: string | number
  keyList?: any[]
  onChange?(key: string | number): void
  [propsName: string]: any
}

const getFixedNavStyle = (zIndex: number): React.CSSProperties => {
  return {
    position: "fixed",
    zIndex: zIndex,
    left: 0,
    right: 0,
    top: 0
  }
}

//获取当前元素的offsetTop
function getOffsetTop(obj: any): number {
  let offsetTop: number = 0;
  while (obj != window.document.body && obj != null) {
    offsetTop += obj.offsetTop;
    obj = obj.offsetParent;
  }
  return offsetTop;
}

//获取当前元素的offsetLeft
function getOffsetLeft(obj: any): number {
  let offsetLeft: number = 0;
  while (obj != window.document.body && obj != null) {
    offsetLeft += obj.offsetLeft;
    obj = obj.offsetParent;
  }
  return offsetLeft;
}

const pageNav = {
  floorOffsetTop: {},
  getFloorsOffsetTop: function (keyList: string[] | number[], floorIdPrefix) {
    keyList.forEach((item) => {
      const idName = `${floorIdPrefix}${item}`
      const floorElement: HTMLElement = document.getElementById(idName)
      this.floorOffsetTop[item] = getOffsetTop(floorElement)
    })
  },
  getFloorKey: function (keyList, floorIdPrefix, clientHeight: number, scrollTop: number) {
    this.getFloorsOffsetTop(keyList, floorIdPrefix)
    let floorKey = null;
    for (let floor in this.floorOffsetTop) {
      if ((this.floorOffsetTop[floor] - clientHeight) < scrollTop) {
        floorKey = floor;
      }
    }
    return floorKey;
  },
}


const FixedNav = (props: fixedNavProps, ref: React.Ref<any>) => {
  let { children, scrollContainer, zIndex = 999, floorIdPrefix, keyList = [],scrollNavContainer, navIdPrefix,onChange = (key) => { } } = props
  const [cloneChildren, setCloneChildre] = useState(null)
  const [navStyle, setNavTyle] = useState<React.CSSProperties>({})
  const disScrollRef = useRef(false)
  const [navHeight, setNavHeight] = useState(0)
  const navRef = useRef(null)
  const childrenRef = useRef<RefObject<HTMLElement>>(null)
  const scrollInfo = useScroll(scrollContainer, 30)

  
  const getChildrenHeight = (childrenNote: HTMLElement | null | undefined) => {
    let height = 0
    if (childrenNote) {
      height = childrenNote.clientHeight
    }
    return height
  }
  const setDisScrollRef = (status) => {
    disScrollRef.current = status
  }

  // 暴露 fn
  useImperativeHandle(ref, () => ({
    handleClickScrollTo(activeKey){
      setDisScrollRef(true)
      const scrollElment = scrollInfo.scrollElement
      if (activeKey && scrollElment) {
        const floorElement: HTMLElement = document.getElementById(`${floorIdPrefix}${activeKey}`)
        if (floorElement) {
          const offsetTop = getOffsetTop(floorElement)
          scrollElment.scrollTo(0, offsetTop - navHeight)
          scrollToNav(activeKey)
        }
      }
    }
  }))

  useEffect(() => {
    const navNode: HTMLElement = navRef.current
    if (navNode) {
      const navRect = navNode.getBoundingClientRect()
      if (navRect.top <= 0) {
        const style = getFixedNavStyle(zIndex)
        setNavTyle(style)
      } else {
        setNavTyle({})
      }
    }
  }, [scrollInfo])
  useEffect(() => {
    const cloneReactNode = React.cloneElement(props.children, { ref: childrenRef })
    setCloneChildre(cloneReactNode)
  }, [children])

  useEffect(() => {
    if (cloneChildren && cloneChildren.ref) {
      const cloneChildrenRef = cloneChildren.ref
      const cloneChildrenNode: HTMLElement = cloneChildrenRef.current
      const height = getChildrenHeight(cloneChildrenNode)
      setNavHeight(height)
    }
  }, [cloneChildren])

  const scrollToNav = (key) => {
    let scrollNavElement: HTMLElement | null = null
    if (typeof scrollNavContainer === "string") {
      scrollNavElement = document.querySelector(scrollNavContainer)
    } else {
      scrollNavElement = scrollNavContainer.current
    }
    if (scrollNavElement) {
      const navNode:HTMLElement = document.getElementById(`${navIdPrefix}${key}`)
      const cha = navNode.offsetLeft - scrollNavElement.scrollLeft + navNode.clientWidth - scrollNavElement.clientWidth
      const cha1 = navNode.offsetLeft  - scrollNavElement.scrollLeft
      if(cha > 0){
        scrollNavElement.scrollTo(scrollNavElement.scrollLeft + cha,0)
      } else if(cha1 < 0){
        scrollNavElement.scrollTo(scrollNavElement.scrollLeft - Math.abs(cha1),0)
      }
    }
  }

  useEffect(() => {
    if (!disScrollRef.current) {
      const scrollCurrentKey = pageNav.getFloorKey(keyList, floorIdPrefix, scrollInfo.scrollTop, scrollInfo.clientHeight)
      
      if (scrollCurrentKey) {
        scrollToNav(scrollCurrentKey)
        onChange(scrollCurrentKey)
      }
    }
    setDisScrollRef(false)
  }, [scrollInfo])



  return <div ref={navRef} style={{ height: `${navHeight}px` }}>
    <div style={navStyle}>{cloneChildren}</div>
  </div>
}


export default forwardRef(FixedNav)