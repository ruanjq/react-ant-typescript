import useScroll from "../hooks/useScroll"
import React, { RefObject, useState, useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from "react"

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


export interface floorOffsetTopMapProps {
  [propsName: string]: number;
}

export interface fixedNavUtilProps<T = string | number, S = RefObject<HTMLElement> | string> {
  floorOffsetTopMap?: floorOffsetTopMapProps,
  mergeStyle(style: React.CSSProperties): React.CSSProperties
  getOffsetLeft?(elment: HTMLElement): number
  getOffsetTop?(elment: HTMLElement): number
  getNavHeight?: (navElment: HTMLElement | null) => number
  getFloorOffsetTop?(keyList: Array<T>, floorIdPrefix: string): floorOffsetTopMapProps
  getActiveFloorKey?(keyList: Array<T>, floorIdPrefix: string, clientHeight: number, scrollTop: number): T
  scrollToNav?(scrollNavContainer: S, key: T, navIdPrefix: string): void
  scrollToFloor?(scrollElment: HTMLElement, key: T, floorIdPrefix: string, navHeight: number)
  getNavNodeByKey(key: T, navIdPrefix: string): HTMLElement | null
  getNavFloorByKey(key: T, floorIdPrefix: string): HTMLElement | null
}


export class FixedNavUtil {
  floorOffsetTopMap = null
  mergeStyle(style) {
    return {
      position: "fixed",
      left: 0,
      right: 0,
      top: 0,
      ...style
    }
  }
  getOffsetLeft(elment) {
    let offsetLeft = 0;
    while (elment != window.document.body && elment != null) {
      offsetLeft += elment.offsetLeft;
      elment = (elment.offsetParent as HTMLElement);
    }
    return offsetLeft;
  }
  getOffsetTop(elment) {
    let offsetTop = 0;
    while (elment != window.document.body && elment != null) {
      offsetTop += elment.offsetTop;
      elment = (elment.offsetParent as HTMLElement);
    }
    return offsetTop;
  }
  getFloorOffsetTop(keyList, floorIdPrefix) {
    let maps = {}
    keyList.forEach((item: any) => {
      const idName = `${floorIdPrefix}${item}`
      const floorElement: HTMLElement | null = document.getElementById(idName)
      if (floorElement) {
        maps[idName] = this.getOffsetTop(floorElement)
      }
    })
    return maps
  }
  getNavHeight(navElment) {
    let height = 0
    if (navElment) {
      height = navElment.clientHeight
    }
    return height
  }
  getActiveFloorKey(keyList, floorIdPrefix, clientHeight, scrollTop) {
    this.floorOffsetTopMap = this.getFloorOffsetTop(keyList, floorIdPrefix)
    let floorIdNames: string = floorIdPrefix;
    for (let floor in this.floorOffsetTopMap) {
      if ((this.floorOffsetTopMap[floor] - clientHeight) < scrollTop) {
        floorIdNames = floor;
      }
    }
    return floorIdNames.split(floorIdPrefix)[1]
  }
  getNavNodeByKey(key, navIdPrefix) {
    return document.getElementById(`${navIdPrefix}${key}`)
  }
  getNavFloorByKey(key, floorIdPrefix) {
    return document.getElementById(`${floorIdPrefix}${key}`)
  }
  scrollToNav(scrollNavContainer, key, navIdPrefix) {
    let scrollNavElement: HTMLElement | null = null
    if (typeof scrollNavContainer === "string") {
      scrollNavElement = document.querySelector(scrollNavContainer)
    } else {
      scrollNavElement = scrollNavContainer.current
    }
    if (scrollNavElement) {
      const navNode = this.getNavNodeByKey(key, navIdPrefix)
      if (navNode) {
        const overflowWidthRight = navNode.offsetLeft - scrollNavElement.scrollLeft + navNode.clientWidth - scrollNavElement.clientWidth
        const overflowWidthLeft = navNode.offsetLeft - scrollNavElement.scrollLeft
        if (overflowWidthRight > 0) {
          scrollNavElement.scrollTo(scrollNavElement.scrollLeft + navNode.clientWidth, 0)
        } else if (overflowWidthLeft < 0) {
          scrollNavElement.scrollTo(scrollNavElement.scrollLeft - Math.abs(navNode.clientWidth), 0)
        }
      }
    }
  }
  scrollToFloor(scrollElment, key, floorIdPrefix, navHeight = 0) {
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
  const fixedNavUtilInstanceRef = useRef<fixedNavUtilProps>(new FixedNavUtil())

  const fixedNavUtil = useMemo(() => {
    return fixedNavUtilInstanceRef.current
  },[fixedNavUtilInstanceRef])

  const handleScrollToNav = (key) => {
    fixedNavUtil.scrollToNav(scrollNavContainer, key, navIdPrefix)
  }

  const handleScrollToFloor = (key) => {
    setDisScroll(true)
    const scrollElment = scrollInfo.scrollElement
    fixedNavUtil.scrollToFloor(scrollElment, key, floorIdPrefix, navHeight)
    handleScrollToNav(key)
  }

  const setDisScroll = (status: boolean) => {
    disScrollRef.current = status
  }
  const getDisScroll = (): boolean => {
    return disScrollRef.current
  }

  useImperativeHandle(ref, () => ({
    handleScrollToFloor,
    handleScrollToNav
  }))

  useEffect(() => {
    const navNode: HTMLElement = navRef.current
    if (navNode) {
      const navRect = navNode.getBoundingClientRect()
      if (navRect.top <= 0) {
        if(navStyle.position !== "fixed"){
          const mergeStyle = fixedNavUtil.mergeStyle(style)
          setNavStyle(mergeStyle)
        }
      } else {
        if(navStyle.position === "fixed"){
          setNavStyle({})
        }
      }
    }
  }, [scrollInfo, style])

  useEffect(() => {
    const cloneReactNode: any = React.cloneElement(children, { ref: childrenRef })
    if (cloneReactNode && cloneReactNode.ref) {
      const cloneChildrenRef = cloneReactNode.ref
      const cloneChildrenNode: HTMLElement = cloneChildrenRef.current
      const height = fixedNavUtil.getNavHeight(cloneChildrenNode)
      setNavHeight(height)
    }
    setCloneChildre(cloneReactNode)
  }, [children])

  useEffect(() => {
    if (!getDisScroll()) {
      const activeFloorKey = fixedNavUtil.getActiveFloorKey(keyList, floorIdPrefix, scrollInfo.clientHeight, scrollInfo.scrollTop)
      if (activeFloorKey) {
        handleScrollToNav(activeFloorKey)
        onChange(activeFloorKey)
      }
    }
    setDisScroll(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollInfo])


  return <div ref={navRef} style={{ height: `${navHeight}px` }}>
    <div style={navStyle}>{cloneChildren}</div>
  </div>
}


export default forwardRef(FixedNav)
