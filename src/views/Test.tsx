import React, { useRef, useEffect, useState, FC } from "react";


/**
 * @description 加载图片链接
 * @param src 
 */
const loadImg = (src: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = src;
    image.onload = function () {
      resolve(image);
    }
    image.onerror = function () {
      reject();
    }
  })
}

/**
 * @description 加载所有图片
 * @param arrSrc 
 */
const ArrLoadImg = (arrSrc: string[]): Promise<any> => {
  let arrLoadImgPromise = [];
  arrSrc.forEach(item => {
    arrLoadImgPromise.push(loadImg(item));
  });
  return Promise.all(arrLoadImgPromise);
}

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
const textEllipsis = (context:any, text:string, x:number, y:number, maxWidth:number, lineHeight:any, row:number) => {
    if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
        return;
    }
    let canvas = context.canvas;

    if (typeof maxWidth == 'undefined') {
        maxWidth = canvas && canvas.width || 300;
    }

    if (typeof lineHeight == 'undefined') {
        // 有些情况取值结果是字符串，比如 normal。所以要判断一下
        let getLineHeight = window.getComputedStyle(canvas).lineHeight;
        let reg = /^[0-9]+.?[0-9]*$/;
        lineHeight = reg.test(getLineHeight) ? getLineHeight : 20;
    }

    // 字符分隔为数组
    let arrText = text.split('');
    // 文字最终占据的高度，放置在文字下面的内容排版，可能会根据这个来确定位置
    let textHeight = 0;
    // 每行显示的文字
    let showText = '';
    // 控制行数
    let limitRow = row;
    let rowCount = 0;

    for (let n = 0; n < arrText.length; n++) {
        let singleText = arrText[n];
        let connectShowText = showText + singleText;
        // 没有传控制的行数，那就一直换行
        let isLimitRow = limitRow ? rowCount === (limitRow - 1) : false;
        let measureText = isLimitRow ? (connectShowText + '……') : connectShowText;
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

    let textHeightValue = rowCount < limitRow ? (textHeight + lineHeight) : textHeight;
    return textHeightValue;
}

/**
 * @description 获取屏幕像素设备比例
 * @param context 
 */
const getPixelRatio = (context) => {
  let backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
  return (window.devicePixelRatio || 1) / backingStore;
}


/**
 * @description 绘制圆形图片
 * @param ctx  canvas ctx
 * @param img  img 对象
 * @param x   x坐标
 * @param y   y坐标
 * @param width  图片宽度 
 */
const circleImg = (ctx:any, img:HTMLImageElement, x:number, y:number, width:number) => {
  ctx.save();
  const r = width/2;
  const d =2 * r;
  const cx = x + r;
  const cy = y + r;
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.clip();
  ctx.drawImage(img, x, y, d, d);
  ctx.restore();
}

/**
 * @description 绘制圆形边框样式
 * @param ctx  canvas ctx
 * @param x  x坐标
 * @param y  y坐标
 * @param width width 宽度
 * @param borderStyle  边框样式
 */
const drawCircleBorder = (ctx:any, x:number, y:number, width:number,borderStyle:object) => {
  ctx.save();
  const r = width/2;
  const cx = x + r;
  const cy = y + r;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  for(const attr in borderStyle){
    const value = borderStyle[attr];
    ctx[attr] = value;
  }
  ctx.stroke();
  ctx.restore();
}

type DataType = "text" | "images" | undefined;

interface IDataItem {
  type?: DataType;
  src?: string;
  text?: string;
  position?: number[];
  circle?:boolean;
  circleBorder?:{
    lineWidth:number,
    strokeStyle:string
  };
  style?:{
    fillStyle?:string,
    fontSize?:number,
    ellipsis?:boolean,
    lineHeight?:number,
    maxWidth?:number,
    row?:number,
    [index: string]: any;
  };
  size?: number[];
  width?: number;
  height?: number;
  [index: string]: any;
}


interface IDataToCanvasProps {
  id: string;
  data?: Array<IDataItem>;
  width: number;
  height: number;
  style?: React.CSSProperties;
  onFinish?: (any) => void;
}

const DataToCanvas: FC<IDataToCanvasProps> = (props) => {

  const fontFamily = "'-apple-system-font, Helvetica Neue, Helvetica, sans-serif'";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { id, width, height, style, onFinish, data } = props;

  const startDraw = async (dataSource:any[],ctx:any,ratio:number) => {
    const typeForImgData:IDataItem[] = dataSource.filter(item => item.type === 'images');
    const typeForTextData :IDataItem[]= dataSource.filter(item => item.type === 'text');
    const filterSrc:string[] = typeForImgData.map(item => item.src);
    const arrImagesInfo = await ArrLoadImg(filterSrc);

    // 绘制图片
    for(const item of typeForImgData){
      arrImagesInfo.some(image => {
        if(image.src.includes(item.src)){
          item.imgNode = image;
          return true;
        }
      })
      // 判断是否画圆形
      if(item.circle){
        circleImg(ctx,item.imgNode,item.position[0] * ratio, item.position[1] * ratio, item.size[0] * ratio);
        // 绘制圆形边框
        if(item.circleBorder){
          if(item.circleBorder.lineWidth){
            item.circleBorder.lineWidth = item.circleBorder.lineWidth * ratio;
          }
          drawCircleBorder(ctx,item.position[0] * ratio, item.position[1] * ratio,item.size[0] * ratio,item.circleBorder);
        }
      } else{
        ctx.drawImage(item.imgNode, item.position[0] * ratio, item.position[1] * ratio, item.size[0] * ratio, item.size[1] * ratio);
      }
      
    }

    // 绘制文本
    typeForTextData.forEach(item => {
      ctx.textAlign = `left`;
      ctx.fillStyle = item.style.fillStyle;
      ctx.font = `${item.style.fontSize * ratio}px ${fontFamily}`;
      if(item.ellipsis){
        textEllipsis(ctx, item.text, item.position[0] * ratio, item.position[1] * ratio, item.style.maxWidth * ratio, item.style.lineHeight * ratio, item.style.row);
      } else {
        ctx.fillText(item.text, item.position[0] * ratio,item.position[1] * ratio);
      }
      ctx.save();
      ctx.restore();
    })

    onFinish(document.getElementById(id));

    
  }

  useEffect(() => {
    const canvas:any = canvasRef.current || null;
    if(!canvas) return;
    const context = canvas.getContext("2d");
    if (context) {
      const ratio = getPixelRatio(context);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width=`${width}px`;
      canvas.style.height=`${height}px`;
      // 绘制前先清空画布
      context.clearRect(0, 0, canvas.width, canvas.height);
      startDraw(data,context,ratio);
    }
  },[data,id,style,width,height])

  return (
    data ? <canvas id={id} ref={canvasRef} style={style} /> : null
  );
};

export default function App() {

  const initData:any = {};

  const [canvasData,setCanvasData] = useState(initData);
  const [canvasDataURL,setCanvasDataURL] = useState("")
  const canvasDataInit:IDataToCanvasProps = {
    id: "canvas",
    data: [
      {
        type: "images",
        position: [0, 0],
        src:require("../assets/images/adv.png"),
        size:[375,667]
      },
      {
        type: "images",
        position: [280, 567],
        src:require("../assets/images/qrcode.jpeg"),
        size:[74,74],
        circle:true,
        circleBorder:{
          lineWidth:4,
          strokeStyle:"#FFF"
        }
      },
      {
        type: "images",
        position: [20, 567],
        src:require("../assets/images/avatar.jpeg"),
        size:[74,74],
        circle:true,
        circleBorder:{
          lineWidth:2,
          strokeStyle:"#FFF"
        }
      },
      {
        type: "text",
        position: [110, 590],
        text:"明源云客",
        style:{
          fillStyle:"#FFF",
          fontSize:18
        }
      },
      {
        type: "text",
        position: [110, 613],
        text:"邀您扫一扫，参与活动",
        style:{
          fillStyle:"#FFF",
          fontSize:12,
        }
      }
    ],
    width: 375,
    height: 667,
    style: {
      background: 'gray',
    },
    onFinish(canvas) {
      const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
      setCanvasDataURL(dataUrl);
    }
  }
  
  const changeData = () => {
    setCanvasData(canvasDataInit)
  
  }
  return (
    <div className="App">
      {canvasDataURL && <img style={{width:"375px",display:'inline-block',verticalAlign:"top"}} src={canvasDataURL} alt="分享海报"/>}
      <button onClick={changeData}>改变data</button>
      <DataToCanvas {...canvasData} />
      <h1>Hello CodeSandbox</h1>
      {/* <DataToCanvas /> */}
    </div>
  );
}
