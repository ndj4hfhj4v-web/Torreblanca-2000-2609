// Burning street scenery, anchored to the same backdrop as the barrel.
const burningTiresImage=imgFromData('assets/props/burning-tires-v1.png');
let burningTiresFrame=null;
function prepareBurningTires(){if(burningTiresImage.complete&&burningTiresImage.naturalWidth)burningTiresFrame=policeSpriteBounds(burningTiresImage)}
burningTiresImage.onload=prepareBurningTires;prepareBurningTires();
function drawBurningTires(){
 if(introPhase==='none'||!burningTiresFrame)return;
 const s=streetLayout(),x=streetPropWorldX(s.carX+s.carWidth+280)-cam,base=laneTop()+24,h=105;
 const frame=burningTiresFrame,w=h*frame.sw/frame.sh;
 if(x+w<0||x-w>W/.8192+120)return;
 const t=performance.now()/1000,flicker=.7+.3*Math.sin(t*13)*Math.sin(t*7);
 ctx.save();
 const glow=ctx.createRadialGradient(x,base-24,2,x,base-24,75);glow.addColorStop(0,'rgba(255,112,20,'+.22*flicker+')');glow.addColorStop(1,'rgba(255,70,0,0)');
 ctx.fillStyle=glow;ctx.fillRect(x-75,base-99,150,150);
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,base-3,w*.43,7,0,0,Math.PI*2);ctx.fill();
 ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x-w/2,base-h,w,h);
 // Small changing tongues and sparks add motion to the illustrated flames.
 for(let i=0;i<4;i++){
  const fx=x+(i-1.5)*8,fy=base-h*.5,flame=14+8*Math.sin(t*(6+i)+i);
  ctx.fillStyle=i%2?'rgba(255,216,63,.75)':'rgba(255,119,16,.65)';ctx.beginPath();ctx.moveTo(fx-4,fy);
  ctx.bezierCurveTo(fx-8,fy-8,fx+Math.sin(t*8+i)*6,fy-flame,fx+2,fy-flame-4);
  ctx.bezierCurveTo(fx+1,fy-flame*.5,fx+9,fy-5,fx+4,fy);ctx.fill();
  const p=(t*.6+i*.23)%1;ctx.fillStyle='rgba(255,164,36,'+(1-p)*.7+')';ctx.fillRect(fx+p*18,fy-p*75,2,2);
 }
 for(let i=0;i<10;i++){
  const p=(t*.23+i/10)%1,r=8+p*24,sx=x+p*27+Math.sin(p*5+i)*9,sy=base-h*.8-p*145;
  const cloud=ctx.createRadialGradient(sx,sy,0,sx,sy,r),alpha=Math.sin(Math.PI*p)*.22;
  cloud.addColorStop(0,'rgba(45,43,40,'+alpha+')');cloud.addColorStop(1,'rgba(45,43,40,0)');ctx.fillStyle=cloud;ctx.fillRect(sx-r,sy-r,r*2,r*2);
 }
 ctx.restore();
}
const burningTiresSceneBase=drawIntroCar;
drawIntroCar=function(){burningTiresSceneBase();drawBurningTires()};
