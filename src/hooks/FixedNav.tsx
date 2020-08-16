import useScroll from "../hooks/useScroll"
import React, { RefObject, useState, useRef, ReactNode, FunctionComponentElement, useEffect, useMemo } from "react"


interface fixedNavProps {
  scrollContainer: RefObject<HTMLElement> | string;
  zIndex?: number
  children?: any
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

const FixedNav = (props: fixedNavProps) => {
  const { children, scrollContainer, zIndex = 999 } = props
  const [cloneChildren, setCloneChildre] = useState(null)
  const [navStyle, setNavTyle] = useState<React.CSSProperties>({})
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

  useEffect(() => {
    const navNode: HTMLElement = navRef.current
    // console.log("navNode", navNode)

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
    const cloneData = React.cloneElement(props.children, { ref: childrenRef })
    setCloneChildre(cloneData)
    const cloneChildrenRef = cloneData.ref
  }, [children])

  useEffect(() => {
    if (cloneChildren && cloneChildren.ref) {
      const cloneChildrenRef = cloneChildren.ref
      const cloneChildrenNode: HTMLElement = cloneChildrenRef.current
      const height = getChildrenHeight(cloneChildrenNode)
      setNavHeight(height)
    }
  }, [cloneChildren])

  return <div ref={navRef} style={{ height: `${navHeight}px` }}>
    <div style={navStyle}>{cloneChildren}</div>
  </div>
}

export default FixedNav