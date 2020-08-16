import { useEffect, useState, RefObject, useRef } from 'react';


type TDirection = "up" | "down" | "left" | "right" | "static"

interface IScrollInfo{
  scrollHeight: number;
  scrollWidth: number;
  scrollTop: number;
  scrollLeft: number;
  clientHeight:number;
  direction: TDirection;
  distance: number;
  scrollElement?: null | HTMLElement
}


const useScroll = (ref:RefObject<HTMLElement> | string,throttleNum: number = 300) : IScrollInfo => {
  const [scrollInfo, setScrollInfo] = useState<IScrollInfo>({
    scrollHeight:0,
    scrollTop:0,
    scrollLeft:0,
    clientHeight:0,
    scrollWidth:0,
    distance:0,
    direction:"static",
    scrollElement: null
  })
  const beforeScrollTopRef = useRef<number>(0)
  const beforeScrollLeftRef = useRef<number>(0)
  useEffect(() => {
    let scrollElement: HTMLElement | null = null
    if(typeof ref === "string"){
      scrollElement = document.querySelector(ref)
    } else {
      scrollElement = ref.current
    }
    setScrollInfo({
      ...scrollInfo,
      scrollElement: scrollElement
    })
    const handleScroll = () => {
      if(scrollElement){
        let beforeScrollTop = beforeScrollTopRef.current
        let beforeScrollLeft = beforeScrollLeftRef.current
        const distanceVertical = scrollElement.scrollTop - beforeScrollTop
        const distanceHorizontal = scrollElement.scrollLeft - beforeScrollLeft
        let direction: TDirection = "static";
        if(distanceVertical > 0){
          direction = "down"
        } else if(distanceVertical < 0){
          direction = "up"
        } else {
          if(distanceHorizontal > 0){
            direction = "left"
          }else if(distanceHorizontal < 0){
            direction = "right"
          }
        }
        let distance = 0;
        if(direction === "down" || direction === "up"){
          distance = distanceVertical
        } else if(direction === "left" || direction === "right"){
          distance = distanceHorizontal
        }
        setScrollInfo({
          scrollHeight:scrollElement.scrollHeight,
          scrollWidth: scrollElement.scrollWidth,
          scrollTop:scrollElement.scrollTop,
          scrollLeft:scrollElement.scrollLeft,
          clientHeight:scrollElement.clientHeight,
          direction:direction,
          distance:Math.abs(distance),
          scrollElement: scrollElement
        })
        beforeScrollTopRef.current = scrollElement.scrollTop
        beforeScrollLeftRef.current = scrollElement.scrollLeft
      }
    }
    if (scrollElement) {
      scrollElement.addEventListener('scroll', throttle(handleScroll, throttleNum), {
        capture: false,
        passive: true,
      });
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    }
  },[ref])
  return scrollInfo
}

export default useScroll


export const throttle = (fn:(...args: any) => any,delay: number = 200) => {
  let canRun: boolean = true;
  return (...nextArgs:any) => {
      if(!canRun) return;
      canRun = false;
      setTimeout(() => {
          fn(...nextArgs);
          canRun = true;
      },delay);
  }
}