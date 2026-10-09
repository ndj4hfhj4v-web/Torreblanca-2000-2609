// Decorative street prop: bounded smoke particles, no new invisible collision.
const smokingBarrelImage=imgFromData('assets/props/smoking-barrel-v1.png');
function drawSmokingBarrel(){
 if(introPhase==='none'||!smokingBarrelImage.complete||!smokingBarrelImage.naturalWidth)return;
 const x=streetLayout().fenceX+165-cam,base=laneTop()+30,h=100;
 if(x<-120||x>W/.8192+120)return;
 const w=h*smokingBarrelImage.naturalWidth/smokingBarrelImage.naturalHeight;
 ctx.save();
 ctx.fillStyle='rgba(0,0,0,.20)';ctx.beginPath();ctx.ellipse(x,base-4,23,6,0,0,Math.PI*2);ctx.fill();
 ctx.drawImage(smokingBarrelImage,x-w/2,base-h,w,h);
 const seconds=performance.now()/1000;
 for(let i=0;i<14;i++){
  const p=((seconds*.28+i/14)%1),radius=5+p*17;
  const sx=x+Math.sin(p*5+i*.8)*(3+p*8)+p*14,sy=base-h+16-p*115;
  const opacity=Math.sin(p*Math.PI)*.22;
  const gradient=ctx.createRadialGradient(sx,sy,0,sx,sy,radius);
  gradient.addColorStop(0,'rgba(130,133,130,'+opacity+')');
  gradient.addColorStop(.5,'rgba(120,122,120,'+opacity*.7+')');
  gradient.addColorStop(1,'rgba(120,122,120,0)');
  ctx.fillStyle=gradient;ctx.fillRect(sx-radius,sy-radius,radius*2,radius*2);
 }
 ctx.restore();
}
const smokingBarrelSceneBase=drawIntroCar;
drawIntroCar=function(){smokingBarrelSceneBase();drawSmokingBarrel()};

