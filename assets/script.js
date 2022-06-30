const canvas = document.getElementById("canvas");
const button = document.getElementById("button");
    const c = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    // window.addEventListener("devicemotion", handleDeviceMotion);
    window.addEventListener('load', init);

    let ax=0;
    let ay=0;
    let az=9.8;

    let buf=[];
    const ofsY = [0.14, 0.42, 0.7, 0.95];
    const scaleY = [0.01, 0.01, 0.01, 0.01];
    const penColor =["red","green","blue","white"];
    const maxN = w;

    function init(){
        timerFunc();
        
        setInterval(timerFunc, 50);
    }

    function ClickRequestDeviceSensor(){
        
        if(window.DeviceOrientationEvent){
            // ★iOS13向け: ユーザーにアクセスの許可を求める関数があるか？
            if(DeviceOrientationEvent.requestPermission){
                // ★ジャイロセンサーのアクセス許可をリクエストする
                DeviceOrientationEvent.requestPermission().then(function(response){
                    // リクエストが許可されたら
                    if(response === "granted"){
                        // deviceorientationが有効化される
                        alert(response);
                    }
                    alert(response);
                }).catch(function(e){
                    alert(e);
                });
            // iOS13以外
            }else{
                // 何もしない
                alert("no");
            }
        }
    }

    function redraw() {
        c.fillStyle = "black";
        c.fillRect(0,0,w,h);

        if (buf.length>=2){
            for(let seq=0;seq<4;seq++){
                c.strokeStyle = penColor[seq];
                c.beginPath();
                let y0 = ofsY[seq]*h;
                let yA = scaleY[seq]*h;

                c.moveTo(0,y0-yA*buf[0][seq]);

                for(let i=0;i<buf.length;i++){
                    c.lineTo(i,y0-yA*buf[i][seq]);
                }
                c.stroke();
            }
        }
    }

    function handleDeviceMotion(event) {
        let t1 = event.accelerationIncludingGravity.x;
        let t2 = event.accelerationIncludingGravity.y;
        let t3 = event.accelerationIncludingGravity.z;
        if (t1!==null){ax=t1;}
        if (t2!==null){ay=t2;}
        if (t3!==null){az=t3;}
    }

    function timerFunc(){

        let a = Math.sqrt(ax*ax+ay*ay+az*az);
        buf.push([ax,ay,az,a]);
        if (buf.length > maxN){buf.shift();} // delete index 0
        redraw();
    }