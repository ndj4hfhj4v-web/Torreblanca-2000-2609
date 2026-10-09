// Smoldering tires continue the transverse barrier upward across the sidewalk.
const burningTiresImage=imgFromData('assets/props/smoking-tires-v1.png');
let burningTiresFrame=null;
function prepareBurningTires(){if(burningTiresImage.complete&&burningTiresImage.naturalWidth)burningTiresFrame=policeSpriteBounds(burningTiresImage)}
burningTiresImage.onload=prepareBurningTires;prepareBurningTires();
function drawBurningTires(){
 if(introPhase==='none'||!burningTiresFrame)return;
 const s=streetLayout(),slope=84/(laneBottom()+8-laneTop());
 // Continue the exact perspective line of the fence's upper end.
 for(const [i,distance] of [68,38,8].entries()){
  const x=streetPropWorldX(s.fenceX-42-slope*distance)-cam;
  drawSmokingTirePile(x,laneTop()-distance,50,i*.47);
 }
}
function drawSmokingTirePile(x,base,h,phase){
 const frame=burningTiresFrame,w=h*frame.sw/frame.sh;
 if(x+w<0||x-w>W/.8192+120)return;
 const t=performance.now()/1000+phase;
 ctx.save();
 ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.ellipse(x,base-3,w*.43,7,0,0,Math.PI*2);ctx.fill();
 ctx.drawImage(frame.image,frame.sx,frame.sy,frame.sw,frame.sh,x-w/2,base-h,w,h);
 for(let i=0;i<10;i++){
  const p=(t*.18+i/10)%1,r=6+p*22,sx=x+p*18+Math.sin(p*7+i*.6)*(3+p*9),sy=base-h*.85-p*145;
  const cloud=ctx.createRadialGradient(sx,sy,0,sx,sy,r),alpha=Math.sin(Math.PI*p)*.38;
  cloud.addColorStop(0,'rgba(12,12,13,'+alpha+')');cloud.addColorStop(.5,'rgba(18,18,19,'+alpha*.65+')');cloud.addColorStop(1,'rgba(18,18,19,0)');ctx.fillStyle=cloud;ctx.fillRect(sx-r,sy-r,r*2,r*2);
 }
 ctx.restore();
}
const burningTiresSceneBase=drawIntroCar;
drawIntroCar=function(){burningTiresSceneBase();drawBurningTires()};
