import React, { useState, useRef, useEffect } from "react";

export const useCountDown = (leftSecond: number): number => {
  const [leftTime, setLeftTime] = useState<number>(leftSecond - 1)
  const leftSecondRef = useRef<number>(leftSecond - 1)
  useEffect(() => {
    if (leftSecondRef.current > 0) {
      let leftSecondCurrent = leftSecondRef.current
      let timerId = null;
      const run = () => {
        if (leftSecondCurrent <= 0) {
          return () => {
            timerId && clearTimeout(timerId);
          };
        }
        leftSecondCurrent = leftSecondCurrent - 1
        setLeftTime(leftSecondCurrent);
        timerId = setTimeout(run, 1000);
      };
      timerId = setTimeout(run, 1000);
      return () => {
        timerId && clearTimeout(timerId);
      };
    }
  }, [leftSecondRef]);
  return leftTime
}

export type precision = "days" | "hours" | "minutes" | "seconds"

export type TConvertTime = {
  [propsName in precision]: string
}

export const fixTime = (num) => {
  return (num < 10 ? "0" : "") + num;
}

export const convertTime = (leftTime: number): TConvertTime => {
  let result: TConvertTime = {
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  }

  let seconds = leftTime;
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  result = {
    days: fixTime(days),
    hours: fixTime(hours % 24),
    minutes: fixTime(minutes % 60),
    seconds: fixTime(seconds % 60),

  }
  return result
}


export interface CountDownProps {
  template: string
  leftTime?: number
  precision?: precision
  onFinish?(): void
}



const CountDown = (props: CountDownProps) => {
  const { template, leftTime = 0, precision = "hours", onFinish = () => { } } = props
  const leftNum = useCountDown(leftTime)
  let time: TConvertTime = {
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  }
  if (leftNum <= 0) {
    onFinish()
  } else {
    if (precision !== "seconds") {
      time = convertTime(leftNum)
    }
    switch (precision) {
      case "hours":
        const hours = parseInt(time.hours) + parseInt(time.days) * 24
        time.hours = fixTime(hours)
        break;
      case "minutes":
        const hours2 = parseInt(time.hours) + parseInt(time.days) * 24
        time.minutes = fixTime(parseInt(time.minutes) + hours2 * 60)
        break;
      case "seconds":
        time.seconds = fixTime(leftNum)
        break;
      default:
        break
    }
  }

  const replaceTemplate = template.replace(/%H/, time.hours).replace(/%M/, time.minutes).replace(/%S/, time.seconds)
  return <div dangerouslySetInnerHTML={{ __html: replaceTemplate }} />
}

export default CountDown
