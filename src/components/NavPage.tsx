import useScroll from "../hooks/useScroll"
import React, { RefObject, useState, useRef, useEffect, useImperativeHandle, forwardRef, useMemo } from "react"

export interface navPageProps<T = string | number, S = RefObject<HTMLElement> | string> {
  scrollContainer: S;
  scrollNavContainer: S;
  keyList?: Array<T>
  floorIdPrefix?: string
  navIdPrefix?: string
  children?: any
  height: number;
  fixedStyle?: React.CSSProperties
  onChange?(key?: T): void
}


export interface floorOffsetTopMapProps {
  [propsName: string]: number;
}

export interface navPageUtilProps<T = string | number, S = RefObject<HTMLElement> | string> {
  floorOffsetTopMap?: floorOffsetTopMapProps,
  mergeStyle(style: React.CSSProperties): React.CSSProperties
  getOffsetLeft?(elment: HTMLElement): number
  getOffsetTop?(elment: HTMLElement): number
  getFloorOffsetTop?(keyList: Array<T>, floorIdPrefix: string): floorOffsetTopMapProps
  getActiveFloorKey?(keyList: Array<T>, floorIdPrefix: string, clientHeight: number, scrollTop: number): T
  scrollToNav?(scrollNavContainer: S, key: T, navIdPrefix: string): void
  scrollToFloor?(scrollElment: HTMLElement, key: T, floorIdPrefix: string, navHeight: number): void
  getNavNodeByKey(key: T, navIdPrefix: string): HTMLElement | null
  getNavFloorByKey(key: T, floorIdPrefix: string): HTMLElement | null
}


export class NavPageUtil implements navPageUtilProps{
  floorOffsetTopMap = null
  mergeStyle(fixedStyle) {
    return {
      position: "fixed",
      left: 0,
      right: 0,
      top: 0,
      ...fixedStyle
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
  getActiveFloorKey(keyList, floorIdPrefix, clientHeight, scrollTop) {
    if(!this.floorOffsetTopMap){
      this.floorOffsetTopMap = this.getFloorOffsetTop(keyList, floorIdPrefix)
    }
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
    let scrollNavElement = null
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
          const scrollWidth = Math.abs(overflowWidthRight) >= navNode.clientWidth ? overflowWidthRight : navNode.clientWidth
          scrollNavElement.scrollTo(scrollNavElement.scrollLeft + scrollWidth, 0)
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

const NavPage = (props: navPageProps, ref: React.Ref<any>) => {
  let { children, scrollContainer, floorIdPrefix, keyList = [], scrollNavContainer, navIdPrefix,height = 0, onChange = () => { }, fixedStyle = {} } = props
  const [navStyle, setNavStyle] = useState<React.CSSProperties>({})
  const disScrollRef = useRef(false)
  const navRef = useRef<any>(null)
  const scrollInfo = useScroll(scrollContainer, 50)
  const navPageUtilInstanceRef = useRef<navPageUtilProps>(new NavPageUtil())

  const navPageUtil = useMemo(() => {
    return navPageUtilInstanceRef.current
  },[navPageUtilInstanceRef])

  const handleScrollToNav = (key) => {
    navPageUtil.scrollToNav(scrollNavContainer, key, navIdPrefix)
  }

  const handleScrollToFloor = (key) => {
    setDisScroll(true)
    navPageUtil.scrollToFloor(scrollInfo.scrollElement, key, floorIdPrefix, height)
    handleScrollToNav(key)
  }

  const setDisScroll = (status: boolean) => {
    disScrollRef.current = status
  }
  const getDisScroll = (): boolean => {
    return disScrollRef.current
  }

  useImperativeHandle(ref, () => ({
    scrollToFloor: handleScrollToFloor,
    scrollToNav: handleScrollToNav,
    scrollTo(key: string | number){
      handleScrollToNav(key);
      handleScrollToFloor(key);
    }
  }))

  useEffect(() => {
    const navNode: HTMLElement = navRef.current
    if (navNode) {
      const navRect = navNode.getBoundingClientRect()
      if (navRect.top <= 0 && navStyle.position !== "fixed") {
        const mergeStyle = navPageUtil.mergeStyle(fixedStyle)
        setNavStyle(mergeStyle)
      } else if(navRect.top > 0 && navStyle.position === "fixed") {
        setNavStyle(fixedStyle)
      }
    }
  }, [scrollInfo, navStyle])

  useEffect(() => {
    if (!getDisScroll()) {
      const activeFloorKey = navPageUtil.getActiveFloorKey(keyList, floorIdPrefix, scrollInfo.clientHeight, scrollInfo.scrollTop)
      if (activeFloorKey) {
        handleScrollToNav(activeFloorKey)
        onChange(activeFloorKey)
      }
    }
    setDisScroll(false)
  }, [scrollInfo])


  return <div ref={navRef} style={{ height: `${height}px` }}>
    <div style={navStyle}>{children}</div>
  </div>
}


export default forwardRef(NavPage)
