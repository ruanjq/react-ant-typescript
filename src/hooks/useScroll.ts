import { useEffect, useState, RefObject, useRef } from 'react';
import useThrottleFn from  "./useThrottleFn"
type TDirection = "up" | "down" | "left" | "right" | "static"

interface IScrollInfo{
  scrollHeight: number;
  scrollWidth: number;
  scrollTop: number;
  scrollLeft: number;
  clientHeight:number;
  direction: TDirection;
  distance: number;
}


const useScroll = (ref:RefObject<HTMLElement>) : IScrollInfo => {
  const [scrollInfo, setScrollInfo] = useState<IScrollInfo>({
    scrollHeight:0,
    scrollTop:0,
    scrollLeft:0,
    clientHeight:0,
    scrollWidth:0,
    distance:0,
    direction:"static",
  })
  const beforeScrollTopRef = useRef<number>(0)
  const beforeScrollLeftRef = useRef<number>(0)
  useEffect(() => {
    const scrollElement = ref.current
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
          clientHeight:scrollElement.scrollHeight,
          direction:direction,
          distance:Math.abs(distance),
        })
        beforeScrollTopRef.current = scrollElement.scrollTop
        beforeScrollLeftRef.current = scrollElement.scrollLeft
      }
    }
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, {
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