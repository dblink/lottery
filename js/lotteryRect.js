/**
 * Created by Administrator on 2016/7/13.
 */
(function (_win){
  function LotteryRect(varJson){
    this.id = varJson.id; //id
    //this.context = new _win.cv(this.id).verification(); 判断，默认无;
    this.context = document.getElementById(this.id).getContext("2d");
    this.imageSrc = varJson.imageSrc; //图片列表
    this.winner = varJson.winner; //胜利者
    this.imageList = [];
    this.finish = varJson.finish;
    if (varJson.canvasHeight || varJson.canvasWidth){
      if (!varJson.canvasRow){
        varJson.canvasRow = 4;
      }
      if (!varJson.canvasCol){
        varJson.canvasCol = 4;
      }
      this.canvas = {
        row: varJson.canvasRow,
        col: varJson.canvasCol,
        height: varJson.canvasHeight,
        width: varJson.canvasWidth
      }
    }else{
      console.log("no width/height");
    }
  }

  LotteryRect.prototype = {
    constructor: LotteryRect,
    loadImage: (function (imageSrc, event){
      var image = new Image();
      image.src = imageSrc;
      image.onload = function (){
        if (typeof event === "function"){
          event(image)
        }
      }
    }),
    drawLottery: function (){

      var that = this;
      this.imageSrc.forEach(function (imgSrc, su){
        that.loadImage(imgSrc, function (image){
          that.imageList[su] = image;
          that.draw(su, image)
        });
      });
    },
    draw: (function (su, type){
      var that,
        col,
        row,
        height,
        width,
        sub,
        spaceLR,
        spaceTB;
      that = this;
      col = this.canvas.col;
      row = this.canvas.row;
      height = this.canvas.height;
      width = this.canvas.width;
      spaceLR = width / Math.pow((col + 1), 2);
      spaceTB = height / Math.pow((row + 1), 2);

      if (su < col){
        sub = su;
        if (typeof type === "object"){
          that.context.drawImage(type, sub * width / (col + 1) + (sub + 1) * spaceLR, spaceTB, width / (col + 1), height / (row + 1));
        }else if (type === "clear"){
          that.context.clearRect(sub * width / (col + 1) + (sub + 1) * spaceLR, spaceTB, width / (col + 1), height / (row + 1));
        }else{
          that.drawRect(sub * width / (col + 1) + (sub + 1) * spaceLR, spaceTB, width / (col + 1), height / (row + 1));
        }
        //从左往右，0倍宽,1倍宽，2倍宽，x倍宽……直至x大于列，
      }else if (su + 1 - col < row){
        sub = su - col + 1;
        if (typeof type === "object"){
          that.context.drawImage(type, (col - 1) * width / (col + 1) + col * spaceLR, sub * height / (row + 1) + (sub + 1) * spaceTB, width / (col + 1), height / (row + 1));
        }else if (type === "clear"){
          that.context.clearRect((col - 1) * width / (col + 1) + col * spaceLR, sub * height / (row + 1) + (sub + 1) * spaceTB, width / (col + 1), height / (row + 1));
        }else{
          that.drawRect((col - 1) * width / (col + 1) + col * spaceLR, sub * height / (row + 1) + (sub + 1) * spaceTB, width / (col + 1), height / (row + 1));
        }

        //从右上到右下，（x-列）倍宽 …… 直至xd大于行，
      }else if (su + 2 - col - row < col){
        sub = su - col - row + 2;
        if (typeof type === "object"){
          that.context.drawImage(type, width - (sub + 1) * width / (col + 1) - (sub + 1) * spaceLR, (row - 1) * height / (row + 1) + row * spaceTB, width / (col + 1), height / (row + 1));
        }else if (type === "clear"){
          that.context.clearRect(width - (sub + 1) * width / (col + 1) - (sub + 1) * spaceLR, (row - 1) * height / (row + 1) + row * spaceTB, width / (col + 1), height / (row + 1));
        }else{
          that.drawRect(width - (sub + 1) * width / (col + 1) - (sub + 1) * spaceLR, (row - 1) * height / (row + 1) + row * spaceTB, width / (col + 1), height / (row + 1));
        }

        //从右下到左下；
      }else{
        sub = su + 3 - 2 * col - row;
        if (typeof type === "object"){
          that.context.drawImage(type, spaceLR, height - (sub + 1) * height / (row + 1) - (sub + 1) * spaceTB, width / (col + 1), height / (row + 1));
        }else if (type === "clear"){
          that.context.clearRect(spaceLR, height - (sub + 1) * height / (row + 1) - (sub + 1) * spaceTB, width / (col + 1), height / (row + 1));
        }else{
          that.drawRect(spaceLR, height - (sub + 1) * height / (row + 1) - (sub + 1) * spaceTB, width / (col + 1), height / (row + 1));
        }
      }
      //从左下到左上
      that = null;
      col = null;
      row = null;
      height = null;
      width = null;
      sub = null;
      spaceLR = null;
      spaceTB = null;
    }),
    drawRect: (function (x, y, width, height){
      this.context.fillStyle = "#fff";
      this.context.fillRect(x + 1, y + 1, width - 2, height - 2);
    }),
    animatedLottery: (function (n){
      var that,
        position,
        start,
        quan;
      quan = 0;
      position = n;
      start = "yes";
      return (function (click){
        var that = this;
        if (click || start === "yes"){
          start = "no";
          setTimeout(function (){
            if (quan != 3 || position != that.winner + 1){
              var n_1 = position - 1;
              var _pow;
              if (that.canvas.row > 3 && that.canvas.col > 3){
                _pow = Math.pow(2, that.canvas.row - 3) + Math.pow(2, that.canvas.col - 3);
              }
              if (that.canvas.row === 3 || that.canvas.col === 3){
                if (that.canvas.row === 3){
                  _pow = 3 * (that.canvas.col - 2) / 3;
                }else{
                  _pow = 3 * (that.canvas.row - 2) / 3;
                }
              }
              if (that.canvas.row < 3 || that.canvas.col < 3){
                _pow = 0;
              }
              var _length = that.canvas.row * that.canvas.col - _pow;
              console.log(that.canvas.row, that.canvas.col);
              console.log(_length, that.imageSrc.length, _pow);
              _length = that.imageSrc.length > _length ? _length : that.imageSrc.length;
              if (position === _length){
                position = 0;
                n_1 = _length - 1;
                ++quan;
              }
              that.context.globalCompositeOperation = "destination-over";
              that.draw(position);
              that.draw(n_1, "clear");
              that.draw(n_1, that.imageList[n_1]);
              n_1 = null;
              ++position;
              that.animatedLottery(1);
            }else{
              if (typeof that.finish === "function"){
                that.finish();
              }
              start = "yes";
              quan = 0;
            }
          }, 100);
        }else{

        }

      }).bind(this);
    })
  };
  _win.LotteryRect = LotteryRect;
})(window);