import React, { Component } from "react";
import DataToCanvas, { IDataItem, loadImg } from "./dataToCanvas";
import "./style.less";
/**
 * 定义接口类型
 */
export interface IPosterProps {
  id: string;
  userName?: string;
  posterSrc: string;
  avatarSrc?: string;
  qrcodeSrc?: string;
  visible?: boolean; // 是否限制分享海报弹框
  style?: React.CSSProperties;
  onCancel?: (canvas?: any) => void; // 海报显示隐藏海报弹框
  onShow?: (canvas?: any) => void; // 海报显示隐藏海报弹框
  onDrawFinish?: (canvas?: any) => void; // canvas 绘图完成
}

// 头像和二维码直径长度
const qrcode_diameter = 148;
const avatar_diameter = 148;

// 二维码图片距离海报图底部像素
const qrcode_distance_bottom = 40;
// 二维码图片距离海报图右边像素
const qrcode_distance_right = 40;

// 头像距离海报图底部像素
const avatar_distance_bottom = 40;
// 头像距离海报图左边像素
const avatar_distance_left = 40;

const scanFontSize = 22;
// 扫一扫文案距离海报图左边像素
const scan_distance_left = avatar_distance_left + avatar_diameter + 20;

// 昵称距离海报图左边像素
const userNameFontSize = 30;
const username_distance_left = avatar_distance_left + avatar_diameter + 20;
/**
 * @description 获取绘制 canvas 数据 图片部分
 * @param imgNode  img HTML
 * @param types 元素类型 [海报，二维码，头像]
 * @param posterW  posterW，海报图片的尺寸宽度
 * @param posterW  posterH，海报图片的尺寸高度
 */
function getImgCanvasData(
  imgNode: HTMLImageElement,
  types: string,
  posterW: number,
  posterH: number
): IDataItem | null {
  const { src } = imgNode;
  switch (types) {
    case "poster": // 海报图添加到第一个位置
      return {
        type: "images",
        position: [0, 0],
        src: src,
        size: [imgNode.width, imgNode.height],
      };
    case "qrcode": // 二维吗
      return {
        type: "images",
        position: [
          posterW - avatar_diameter - avatar_distance_left,
          posterH - qrcode_diameter - qrcode_distance_bottom,
        ],
        src: src,
        size: [qrcode_diameter, qrcode_diameter],
        circle: true,
        circleBorder: {
          lineWidth: 8,
          strokeStyle: "#FFF",
        },
      };
    case "avatar": // 头像
      return {
        type: "images",
        position: [
          qrcode_distance_right,
          posterH - avatar_diameter - avatar_distance_bottom,
        ],
        src: src,
        size: [avatar_diameter, avatar_diameter],
        circle: true,
        circleBorder: {
          lineWidth: 4,
          strokeStyle: "#FFF",
        },
      };
    default:
      return null;
  }
}

/**
 * @description 获取绘制 canvas 数据文本部分
 * @param types 元素类型 [海报，二维码，头像]
 * @param posterW  posterW，海报图片的尺寸宽度
 * @param posterH  posterH，海报图片的尺寸高度
 */
function getTextCanvasData(
  types: string,
  text: string,
  posterW: number,
  posterH: number
): IDataItem | null {
  switch (types) {
    case "scan": // 扫一扫提示
      // 文案距离头像顶部的距离
      const scan_distance_avatar_top = 88
      return {
        type: "text",
        position: [
          scan_distance_left,
          posterH -
            avatar_diameter -
            avatar_distance_bottom +
            scanFontSize +
            scan_distance_avatar_top,
        ],
        text: text,
        style: {
          fillStyle: "#FFF",
          fontSize: scanFontSize,
        },
      };
    case "userName": //用户昵称
      // 文案距离头像顶部的距离
      const username_distance_avatar_top = 28
      return {
        type: "text",
        position: [
          username_distance_left,
          posterH -
            avatar_diameter -
            avatar_distance_bottom +
            userNameFontSize +
            username_distance_avatar_top,
        ],
        text: text,
        style: {
          fillStyle: "#FFF",
          fontSize: userNameFontSize,
          ellipsis: true,
          lineHeight: 30,
          maxWidth: posterW - username_distance_left - qrcode_distance_right - qrcode_diameter - 60,
          row: 1,
        },
      };
    default:
      return null;
  }
}


/**
 * @description 获取绘制 canvas 数据文本部分
 * @param types 元素类型 [海报，二维码，头像]
 * @param posterW  posterW，海报图片的尺寸宽度
 * @param posterH  posterH，海报图片的尺寸高度
 */
function getLinearGradientCanvasData(
  posterW: number,
  posterH: number
): IDataItem | null {
  // 渐变高度
  const linearGradient_height = 340
  return {
    type:"linearGradient",
    linearGradienAxis:[0, posterH - linearGradient_height, 0, posterH],
    colorStops:[[0.0, 'rgba(0,0,0,0)'],[1.0, 'rgba(0,0,0,0.8)']],
    fillRect:[0, posterH - linearGradient_height, posterW, linearGradient_height]
  }
}

interface IPosterState {
  visible?: boolean;
  canvasDataURL?: string;
  canvasData: IDataItem[];
}

class PosterShare extends Component<IPosterProps, IPosterState> {
  constructor(props: any) {
    super(props);
    this.state = {
      visible: props.visible,
      canvasDataURL: "",
      canvasData: [],
    };
  }

  // shouldComponentUpdate(
  //   prevProps: IPosterProps,
  //   prevState: any,
  //   snapshot: any
  // ) {
  //   console.log("更新数据", prevProps)
  //   if (prevProps.visible && this.props.visible !== prevProps.visible) {
  //     this.updateCanvasData(prevProps);
  //   }
  //   if (
  //     prevProps.visible !== this.props.visible ||
  //     prevState.canvasData.length > 0
  //   ) {
  //     return true;
  //   }
  //   return false;
  // }

  componentDidMount() {
    this.updateCanvasData(this.props);
  }
  /**
   * @description 监听属性变化，更新canvasData
   * @param nextProps
   */
  updateCanvasData = (nextProps: any) => {
    console.log("nextProps", nextProps);
    const {
      posterSrc = "",
      avatarSrc = "",
      qrcodeSrc = "",
      userName = "",
    } = nextProps;
    const canvasData = [];
    if (posterSrc !== "") {
      // 更新state
      const updateStateForCanvasData = (posterInfo: any) => {
        const scanData = getTextCanvasData(
          "scan",
          "邀您扫一扫，参与活动",
          posterInfo.size[0],
          posterInfo.size[1]
        );
        const yunkeData = getTextCanvasData(
          "userName",
          userName,
          posterInfo.size[0],
          posterInfo.size[1]
        );

        const linearGradientData = getLinearGradientCanvasData(
          posterInfo.size[0],
          posterInfo.size[1]
        );
        if (scanData) {
          canvasData.push(scanData);
        }
        if (yunkeData) {
          canvasData.push(yunkeData);
        }
        if(linearGradientData){
          canvasData.splice(1,0,linearGradientData)
        }
        this.setState({
          canvasData: canvasData,
        });
      };

      // 加载二维码图片
      const qrcodeLoad = (posterInfo: any) => {
        // 判断是否存在二维码路径
        if (qrcodeSrc !== "") {
          loadImg(qrcodeSrc).then((imgNodes) => {
            const data = getImgCanvasData(
              imgNodes,
              "qrcode",
              posterInfo.size[0],
              posterInfo.size[1]
            );
            if (data) {
              canvasData.push(data);
              // 最后更新 canvasData state 状态
              updateStateForCanvasData(posterInfo);
            }
          });
        } else {
          // 最后更新 canvasData state 状态
          updateStateForCanvasData(posterInfo);
        }
      };

      /**
       * @description 加载海报图片，如果加载失败，则不执行后面的逻辑
       * @param posterSrc 海报图url
       */
      loadImg(posterSrc)
        .then((imgNodes) => {
          const data = getImgCanvasData(imgNodes, "poster", 0, 0);
          if (data) {
            // wraing 海报图必须在第一个位置
            canvasData.unshift(data);
            return Promise.resolve(data);
          }
        })
        .then((posterInfo: any) => {
          // 判断是否存在头像
          if (avatarSrc !== "") {
            // 加载头像
            loadImg(avatarSrc)
              .then((imgNodes) => {
                const data = getImgCanvasData(
                  imgNodes,
                  "avatar",
                  posterInfo.size[0],
                  posterInfo.size[1]
                );
                if (data) {
                  canvasData.push(data);
                  return Promise.resolve(posterInfo);
                }
              })
              .then(qrcodeLoad); // 头像加载成功加载二维码图片
          } else {
            // 不存在加载二维码图片
            qrcodeLoad(posterInfo);
          }
        });
    }
  };

  onClose = () => {
    this.setState(
      {
        visible: false,
        canvasDataURL: "",
        canvasData: [],
      },
      () => {
        this.props.onCancel && this.props.onCancel();
      }
    );
  };

  onFinish = (canvas: any) => {
    // const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
    // this.setState(
    //   {
    //     canvasDataURL: dataUrl,
    //   },
    //   () => {
    //     this.props.onDrawFinish &&
    //       this.props.onDrawFinish(this.state.canvasDataURL);
    //   }
    // );
  };

  render() {
    const { canvasDataURL, canvasData = [] } = this.state;
    const { id, visible } = this.props;
    console.log("canvasData", canvasData);
    return (
      <>
        {canvasData.length > 0 && (
          <div className="canvas-wrap">
            <DataToCanvas
              id={id}
              width={canvasData[0].size && canvasData[0].size[0]}
              height={canvasData[0].size && canvasData[0].size[1]}
              data={canvasData}
              onFinish={this.onFinish}
            />
          </div>
        )}
      </>
    );
  }
}

export default PosterShare;
