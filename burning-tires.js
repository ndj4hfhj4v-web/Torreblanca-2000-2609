// Smoldering tires with animated black smoke; location awaits the user's choice.
const burningTiresImage=imgFromData('assets/props/smoking-tires-v1.png');
let burningTiresFrame=null;
function prepareBurningTires(){if(burningTiresImage.complete&&burningTiresImage.naturalWidth)burningTiresFrame=policeSpriteBounds(burningTiresImage)}
burningTiresImage.onload=prepareBurningTires;prepareBurningTires();
function drawBurningTires(){
 if(introPhase==='none'||!burningTiresFrame)return;
 const s=streetLayout(),x=streetPropWorldX(s.carX+s.carWidth+280)-cam,base=laneTop()+24,h=75;
 const frame=burningTiresFrame,w=h*frame.sw/frame.sh;
 if(x+w<0||x-w>W/.8192+120)return;
 const t=performance.now()/1000;
 ctx.save();
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,base-3,w*.43,7,0,0,Math.PI*2);ctx.fill();
 ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x-w/2,base-h,w,h);
 for(let i=0;i<16;i++){
  const p=(t*.18+i/16)%1,r=8+p*28,sx=x+p*23+Math.sin(p*7+i*.6)*(3+p*12),sy=base-h*.85-p*180;
  const cloud=ctx.createRadialGradient(sx,sy,0,sx,sy,r),alpha=Math.sin(Math.PI*p)*.46;
  cloud.addColorStop(0,'rgba(12,12,13,'+alpha+')');cloud.addColorStop(.5,'rgba(18,18,19,'+alpha*.65+')');cloud.addColorStop(1,'rgba(18,18,19,0)');ctx.fillStyle=cloud;ctx.fillRect(sx-r,sy-r,r*2,r*2);
 }
 ctx.restore();
}
const burningTiresSceneBase=drawIntroCar;
drawIntroCar=function(){burningTiresSceneBase();drawBurningTires()};
