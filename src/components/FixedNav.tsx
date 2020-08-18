import useScroll from "../hooks/useScroll"
import React, { RefObject, useState, useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from "react"

export interface fixedNavProps<T = string | number, S = RefObject<HTMLElement> | string> {
  scrollContainer: S;
  scrollNavContainer: S;
  keyList?: Array<T>
  floorIdPrefix?: string
  navIdPrefix?: string
  children?: any
  style?: React.CSSProperties
  onChange?(key?: T): void
}

export const mergeStyle = (style: React.CSSProperties): React.CSSProperties => {
  return {
    position: "fixed",
    left: 0,
    right: 0,
    top: 0,
    ...style
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

export interface floorOffsetTopMapProps {
  [propsName: string]: number;
}

export interface fixedNavUtilProps<T = string | number, S = RefObject<HTMLElement> | string>{
  floorOffsetTopMap?: floorOffsetTopMapProps,
  mergeStyle(style: React.CSSProperties): React.CSSProperties
  getOffsetLeft?(elment: HTMLElement): number
  getOffsetTop?(elment: HTMLElement): number
  getNavHeight?:(navElment: HTMLElement | null) => number
  getFloorOffsetTop?(keyList:Array<T>, floorIdPrefix: string): floorOffsetTopMapProps
  getActiveFloorKey?(keyList:Array<T>, floorIdPrefix: string, clientHeight:number,scrollTop:number): T
  scrollToNav?(scrollNavContainer:S ,key: T,navIdPrefix: string):void
  scrollToFloor?(scrollElment: HTMLElement,key: T, floorIdPrefix: string,navHeight: number)
  getNavNodeByKey(key: T, navIdPrefix: string): HTMLElement| null
  getNavFloorByKey(key: T, floorIdPrefix: string): HTMLElement| null
}



const fixedNavUtil: fixedNavUtilProps = {
  floorOffsetTopMap: {},
  mergeStyle(style){
    return {
      position: "fixed",
      left: 0,
      right: 0,
      top: 0,
      ...style
    }
  },
  getOffsetLeft(elment) {
    let offsetLeft = 0;
    while (elment != window.document.body && elment != null) {
      offsetLeft += elment.offsetLeft;
      elment = (elment.offsetParent as HTMLElement);
    }
    return offsetLeft;
  },
  getOffsetTop(elment) {
    let offsetTop = 0;
    while (elment != window.document.body && elment != null) {
      offsetTop += elment.offsetTop;
      elment = (elment.offsetParent as HTMLElement);
    }
    return offsetTop;
  },
  getFloorOffsetTop(keyList, floorIdPrefix) {
    let maps = {}
    keyList.forEach((item: any) => {
      const idName = `${floorIdPrefix}${item}`
      const floorElement: HTMLElement | null = document.getElementById(idName)
      if (floorElement) {
        maps[idName] = getOffsetTop(floorElement)
      }
    })
    return maps
  },
  getNavHeight = (navElment) => {
    let height = 0
    if (navElment) {
      height = navElment.clientHeight
    }
    return height
  },
  getActiveFloorKey(keyList, floorIdPrefix, clientHeight, scrollTop) {
    this.floorOffsetTopMap = this.getFloorOffsetTop(keyList, floorIdPrefix)
    let floorIdNames:string = "";
    let floorKey:string | number | null = null;
    for (let floor in this.floorOffsetTopMap) {
      if ((this.floorOffsetTopMap[floor] - clientHeight) < scrollTop) {
        floorIdNames = floor;
      }
    }
    if(floorIdNames){
      floorKey = floorIdNames.split(floorIdPrefix)[1]
    }
    if(floorKey){
      if(typeof keyList[0] === "number"){
        floorKey = Number(keyList[0])
      }
    }
    return floorKey;
  },
  getNavNodeByKey(key,navIdPrefix){
    return document.getElementById(`${navIdPrefix}${key}`)
  },
  getNavFloorByKey(key,floorIdPrefix){
    return document.getElementById(`${floorIdPrefix}${key}`)
  },
  scrollToNav(scrollNavContainer, key,navIdPrefix){
    let scrollNavElement: HTMLElement | null = null
    if (typeof scrollNavContainer === "string") {
      scrollNavElement = document.querySelector(scrollNavContainer)
    } else {
      scrollNavElement = scrollNavContainer.current
    }
    if (scrollNavElement) {
      const navNode = this.getNavNodeByKey(key, navIdPrefix)
      if (navNode) {
        const cha = navNode.offsetLeft - scrollNavElement.scrollLeft + navNode.clientWidth - scrollNavElement.clientWidth
        const cha1 = navNode.offsetLeft - scrollNavElement.scrollLeft
        if (cha > 0) {
          scrollNavElement.scrollTo(scrollNavElement.scrollLeft + cha, 0)
        } else if (cha1 < 0) {
          scrollNavElement.scrollTo(scrollNavElement.scrollLeft - Math.abs(cha1), 0)
        }
      }
    }
  },
  scrollToFloor(scrollElment, key,floorIdPrefix, navHeight = 0){
    const floorNode = this.getNavFloorByKey(key, floorIdPrefix)
    if (key && scrollElment && floorNode) {
        const offsetTop = this.getOffsetTop(floorNode)
        scrollElment.scrollTo(0, offsetTop - navHeight)
    }
  }
}


const FixedNav = (props: fixedNavProps, ref: React.Ref<any>) => {
  let { children, scrollContainer, floorIdPrefix, keyList = [], scrollNavContainer, navIdPrefix, onChange = () => { }, style } = props
  const [cloneChildren, setCloneChildre] = useState<any>(null)
  const [navStyle, setNavStyle] = useState<React.CSSProperties>({})
  const [navHeight, setNavHeight] = useState(0)
  const disScrollRef = useRef(false)
  const navRef = useRef<any>(null)
  const childrenRef = useRef<RefObject<HTMLElement>>(null)
  const scrollInfo = useScroll(scrollContainer, 30)
  const getChildrenHeight = (childrenNote: HTMLElement | null) => {
    let height = 0
    if (childrenNote) {
      height = childrenNote.clientHeight
    }
    return height
  }

  const handleScrollToNav = useCallback((key) => {
    fixedNavUtil.scrollToNav(scrollNavContainer, key, navIdPrefix)
  },[scrollNavContainer, navIdPrefix])

  const setDisScrollRef = (status: boolean) => {
    disScrollRef.current = status
  }

  const scrollToFloor = (activeKey: number) => {
    setDisScrollRef(true)
    const scrollElment = scrollInfo.scrollElement
    if (activeKey && scrollElment) {
      const floorElement: HTMLElement | null = document.getElementById(`${floorIdPrefix}${activeKey}`)
      if (floorElement) {
        const offsetTop = getOffsetTop(floorElement)
        scrollElment.scrollTo(0, offsetTop - navHeight)
        scrollToNav(activeKey)
      }
    }
  }

  useImperativeHandle(ref, () => ({
    scrollToFloor
  }))

  useEffect(() => {
    const navNode: HTMLElement = navRef.current
    if (navNode) {
      const navRect = navNode.getBoundingClientRect()
      if (navRect.top <= 0) {
        const cssStyle = mergeStyle(style)
        setNavStyle(cssStyle)
      } else {
        setNavStyle({})
      }
    }
  }, [scrollInfo, style])
  useEffect(() => {
    const cloneReactNode: any = React.cloneElement(children, { ref: childrenRef })
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

  const scrollToNav = (key: string | number) => {
    let scrollNavElement: HTMLElement | null = null
    if (typeof scrollNavContainer === "string") {
      scrollNavElement = document.querySelector(scrollNavContainer)
    } else {
      scrollNavElement = scrollNavContainer.current
    }
    if (scrollNavElement) {
      const navNode: HTMLElement | null = document.getElementById(`${navIdPrefix}${key}`)
      if (navNode) {
        const cha = navNode.offsetLeft - scrollNavElement.scrollLeft + navNode.clientWidth - scrollNavElement.clientWidth
        const cha1 = navNode.offsetLeft - scrollNavElement.scrollLeft
        if (cha > 0) {
          scrollNavElement.scrollTo(scrollNavElement.scrollLeft + cha, 0)
        } else if (cha1 < 0) {
          scrollNavElement.scrollTo(scrollNavElement.scrollLeft - Math.abs(cha1), 0)
        }
      }
    }
  }


  useEffect(() => {
    if (!disScrollRef.current) {
      const activeNavKey = fixedNavUtil.getActiveFloorKey(keyList, floorIdPrefix, scrollInfo.clientHeight, scrollInfo.scrollTop)
      if (activeNavKey) {
        handleScrollToNav(activeNavKey)
        onChange(activeNavKey)
      }
    }
    setDisScrollRef(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollInfo])


  return <div ref={navRef} style={{ height: `${navHeight}px` }}>
    <div style={navStyle}>{cloneChildren}</div>
  </div>
}


export default forwardRef(FixedNav)
