import React, { useRef, useEffect, FC } from "react";

// dataToCanvas.tsx
/**
 * @description 加载图片链接
 * @param src
 */
export const loadImg = (src: string): Promise<any> => {
  if (src === "") {
    return Promise.reject("img src empty");
  }
  return new Promise((resolve, reject) => {
    let image = new Image();

    // 加载图片的时候记得设置允许跨域
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function () {
      resolve(image);
    };

    image.onerror = function (e) {
      console.error("load img err", e);
      reject();
    };
    image.src = src;
  });
};

/**
 * @description 加载所有图片
 * @param arrSrc
 */
export const ArrLoadImg = (arrSrc: string[]): Promise<any> => {
  let arrLoadImgPromise: any = [];
  arrSrc.forEach((item) => {
    arrLoadImgPromise.push(loadImg(item));
  });
  return Promise.all(arrLoadImgPromise);
};

/**
 * @description 文本换行处理，并返回实际文字所占据的高度
 * @param context  canvas ctx
 * @param text  文本数据
 * @param x x坐标位置
 * @param y y坐标位置
 * @param maxWidth  最大宽度
 * @param lineHeight  行高
 * @param row  显示的行数
 */
const textEllipsis = (
  context: any,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: any,
  row: number
) => {
  if (
    typeof text !== "string" ||
    typeof x !== "number" ||
    typeof y !== "number"
  ) {
    return;
  }
  let canvas = context.canvas;

  if (typeof maxWidth === "undefined") {
    maxWidth = (canvas && canvas.width) || 300;
  }

  if (typeof lineHeight === "undefined") {
    // 有些情况取值结果是字符串，比如 normal。所以要判断一下
    let getLineHeight = window.getComputedStyle(canvas).lineHeight;
    let reg = /^[0-9]+.?[0-9]*$/;
    lineHeight = reg.test(getLineHeight) ? getLineHeight : 20;
  }

  // 字符分隔为数组
  let arrText = text.split("");
  // 文字最终占据的高度，放置在文字下面的内容排版，可能会根据这个来确定位置
  let textHeight = 0;
  // 每行显示的文字
  let showText = "";
  // 控制行数
  let limitRow = row;
  let rowCount = 0;

  for (let n = 0; n < arrText.length; n++) {
    let singleText = arrText[n];
    let connectShowText = showText + singleText;
    // 没有传控制的行数，那就一直换行
    let isLimitRow = limitRow ? rowCount === limitRow - 1 : false;
    let measureText = isLimitRow ? connectShowText + "..." : connectShowText;
    let metrics = context.measureText(measureText);
    let textWidth = metrics.width;

    if (textWidth > maxWidth && n > 0 && rowCount !== limitRow) {
      let canvasShowText = isLimitRow ? measureText : showText;
      context.fillText(canvasShowText, x, y);
      showText = singleText;
      y += lineHeight;
      textHeight += lineHeight;
      rowCount++;
      if (isLimitRow) {
        break;
      }
    } else {
      showText = connectShowText;
    }
  }
  if (rowCount !== limitRow) {
    context.fillText(showText, x, y);
  }

  let textHeightValue =
    rowCount < limitRow ? textHeight + lineHeight : textHeight;
  return textHeightValue;
};

/**
 * @description 获取屏幕像素设备比例
 * @param context
 */
const getPixelRatio = (context: any) => {
  let backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
};

/**
 * @description 绘制圆形图片
 * @param ctx  canvas ctx
 * @param img  img 对象
 * @param x   x坐标
 * @param y   y坐标
 * @param width  图片宽度
 */
const circleImg = (
  ctx: any,
  img: HTMLImageElement,
  x: number,
  y: number,
  width: number
) => {
  ctx.save();
  const r = width / 2;
  const d = 2 * r;
  const cx = x + r;
  const cy = y + r;
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.clip();
  ctx.drawImage(img, x, y, d, d);
  ctx.restore();
};

/**
 * @description 绘制圆形边框样式
 * @param ctx  canvas ctx
 * @param x  x坐标
 * @param y  y坐标
 * @param width width 宽度
 * @param borderStyle  边框样式
 */
const drawCircleBorder = (
  ctx: any,
  x: number,
  y: number,
  width: number,
  borderStyle: any
) => {
  ctx.save();
  const r = width / 2;
  const cx = x + r;
  const cy = y + r;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  for (const attr in borderStyle) {
    const value = borderStyle[attr];
    ctx[attr] = value;
  }
  ctx.stroke();
  ctx.restore();
};

type DataType = "text" | "images" | "linearGradient" | undefined;

export interface ILinearGradient {
  type?: DataType;
  linearGradienAxis?: [number, number, number, number];
  colorStops?: [[number, string], [number, string]];
  fillRect?: [number, number, number, number];
}

export interface IImages {
  type?: DataType;
  src?: string;
  size?: number[];
  position?: number[];
  circle?: boolean;
  circleBorder?: {
    lineWidth: number;
    strokeStyle: string;
  };
}

export interface IText {
  type?: DataType;
  text?: string;
  position?: number[];
  style?: {
    fillStyle?: string;
    fontSize?: number;
    ellipsis?: boolean;
    lineHeight?: number;
    maxWidth?: number;
    row?: number;
  };
}

export interface IDataItem extends IImages, ILinearGradient, IText {
  [index: string]: any;
}

export interface IDataToCanvasProps {
  id: string;
  data: Array<IDataItem>;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onFinish?: (canvas?: any) => void;
}

const DataToCanvas: FC<IDataToCanvasProps> = (props) => {
  const fontFamily =
    "'-apple-system-font, Helvetica Neue, Helvetica, sans-serif'";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    id = "canvas",
    width = 375,
    height = 667,
    style,
    onFinish = (v: any) => {},
    data,
  } = props;
  const startDraw = async (
    dataSource: IDataItem[],
    ctx: CanvasRenderingContext2D,
    ratio: number
  ) => {
    /**
     * @description 绘制文本类型
     * @param item
     */
    const drawText = async (item: IDataItem) => {
      ctx.textAlign = `left`;
      ctx.fillStyle = item.style.fillStyle;
      ctx.font = `${item.style.fontSize * ratio}px ${fontFamily}`;
      if (item.style.ellipsis) {
        textEllipsis(
          ctx,
          item.text,
          item.position[0] * ratio,
          item.position[1] * ratio,
          item.style.maxWidth * ratio,
          item.style.lineHeight * ratio,
          item.style.row
        );
      } else {
        ctx.fillText(
          item.text,
          item.position[0] * ratio,
          item.position[1] * ratio
        );
      }
      ctx.save();
      ctx.restore();
      return Promise.resolve();
    };

    /**
     * @description 绘制图片类型
     * @param item
     */
    const drawImages = async (item: IDataItem) => {
      try {
        const imgNode = await loadImg(item.src);
        item.imgNode = imgNode;
        // 判断是否画圆形
        if (item.circle) {
          circleImg(
            ctx,
            item.imgNode,
            item.position[0] * ratio,
            item.position[1] * ratio,
            item.size[0] * ratio
          );
          // 绘制圆形边框
          if (item.circleBorder) {
            if (item.circleBorder.lineWidth) {
              item.circleBorder.lineWidth = item.circleBorder.lineWidth * ratio;
            }
            drawCircleBorder(
              ctx,
              item.position[0] * ratio,
              item.position[1] * ratio,
              item.size[0] * ratio,
              item.circleBorder
            );
          }
        } else {
          ctx.drawImage(
            item.imgNode,
            item.position[0] * ratio,
            item.position[1] * ratio,
            item.size[0] * ratio,
            item.size[1] * ratio
          );
        }
        return Promise.resolve();
      } catch (error) {
        // 图片加载失败不阻塞后面的绘制过程
        return Promise.resolve();
      }
    };

    /**
     * @description 绘制渐变样式
     * @param item
     */
    const drawLinearGradient = async (item: IDataItem) => {
      if (item.linearGradienAxis.length === 4) {
        const linearGradienAxis: any = item.linearGradienAxis.map(
          (arrItem: number) => arrItem * ratio
        );
        const fillRect: any = item.fillRect.map(
          (arrItem: number) => arrItem * ratio
        );
        const linearGrad = ctx.createLinearGradient.apply(
          ctx,
          linearGradienAxis
        );
        linearGrad.addColorStop.apply(linearGrad, item.colorStops[0]); //第一个参数表示关键颜色的位置0表示起始位置,1表示终点位置,第二个参数表示关键颜色的颜色。
        linearGrad.addColorStop.apply(linearGrad, item.colorStops[1]);
        ctx.fillStyle = linearGrad;
        ctx.fillRect.apply(ctx, fillRect);
        ctx.save();
        ctx.restore();
      }
      return Promise.resolve();
    };

    if (dataSource.length > 0) {
      const copyData: any = dataSource.slice(0);
      (async function drawQueue(copyDataSource) {
        const item = copyDataSource.shift();
        if (item) {
          switch (item.type) {
            case "images":
              try {
                await drawImages(item);
              } catch (error) {}
              break;
            case "linearGradient":
              try {
                await drawLinearGradient(item);
              } catch (error) {}
              break;
            case "text":
              try {
                await drawText(item);
              } catch (error) {}
              break;
            default:
              break;
          }
          drawQueue(copyDataSource);
        } else {
          onFinish(document.getElementById(id));
        }
      })(copyData);
    } else {
      onFinish(document.getElementById(id));
    }
  };

  useEffect(() => {
    const canvas: any = canvasRef.current || null;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (context) {
      let ratio = getPixelRatio(context);
      ratio = ratio > 2 ? 2 : ratio; // 最大用2倍
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // 绘制前先清空画布
      context.clearRect(0, 0, canvas.width, canvas.height);
      startDraw(data, context, ratio);
    }
  });

  return data ? <canvas id={id} ref={canvasRef} style={style} /> : null;
};

export default DataToCanvas;
