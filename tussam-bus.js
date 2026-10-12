// A crashed route 29 bus replaces the transverse fences. No bus-vaulting.
const streetBusActive=true;
const streetBusImage=imgFromData('assets/vehicles/tussam-crashed-rear-no-logo-v2.png');
let streetBusSprite=null;
function prepareStreetBus(){
 if(!streetBusImage.complete||!streetBusImage.naturalWidth)return;
 const c=document.createElement('canvas');c.width=streetBusImage.naturalWidth;c.height=streetBusImage.naturalHeight;
 const p=c.getContext('2d');p.drawImage(streetBusImage,0,0);
 const pixels=p.getImageData(0,0,c.width,c.height);
 for(let i=3;i<pixels.data.length;i+=4)if(pixels.data[i]<=200)pixels.data[i]=0;
 p.putImageData(pixels,0,0);streetBusSprite=c;
}
streetBusImage.onload=prepareStreetBus;prepareStreetBus();
function streetBusRect(){
 const width=432,height=width*2/3;
 const bottom=laneBottom()-24;
 return {x:streetPropWorldX(streetLayout().fenceX+70)-width,y:bottom-height*.93,width,height,bottom};
}
function streetBusFootprint(){
 const r=streetBusRect();
 return {left:r.x+r.width*.09,right:r.x+r.width*.97,top:laneTop()-12,bottom:r.bottom-4};
}
function streetBusRouteOn(ms){const t=ms%6000;return (t>5300&&t<5450)||(t>5620&&t<5710)}
function drawStreetBus(){
 if(introPhase==='none'||!streetBusSprite)return;
 const r=streetBusRect(),x=r.x-cam;if(x+r.width<0||x>W/.8192+100)return;
 const draw=()=>{
  ctx.save();ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(x+r.width*.6,r.bottom-2,r.width*.37,6,0,0,Math.PI*2);ctx.fill();
  ctx.translate(x,r.y);ctx.scale(r.width/streetBusSprite.width,r.height/streetBusSprite.height);
  ctx.filter='brightness(.86) saturate(.88)';ctx.drawImage(streetBusSprite,0,0);ctx.filter='none';
  const digits={'2':['11111','00001','00001','11111','10000','10000','11111'],'9':['11111','10001','10001','11111','00001','00001','11111']};
  const unit=streetBusSprite.width*.007,step=unit*1.3,on=streetBusRouteOn(performance.now());
  ctx.translate(streetBusSprite.width*.704,streetBusSprite.height*.177);ctx.rotate(.03);ctx.translate(-step*5.5,-step*3.5);
  ctx.shadowColor='#ffb342';ctx.shadowBlur=on?10:0;
  ['2','9'].forEach((digit,k)=>digits[digit].forEach((row,y)=>[...row].forEach((v,col)=>{
   if(v==='1'){ctx.fillStyle=on?'#ffc15d':'#241c14';ctx.beginPath();ctx.arc((k*6+col)*step,y*step,unit*.43,0,Math.PI*2);ctx.fill();}
  })));
  ctx.restore();
 };
 if(policeSceneQueue)policeSceneQueue.push({depth:streetBusFootprint().bottom+4,draw});else draw();
}
// The original hooks remain available to old modules but no fences are drawn
// or tested for collisions once the bus is present.
drawStreetFences=function(){};
fenceObstacleAt=function(){return null};
const busObstacleBase=streetObstacleAt;
streetObstacleAt=function(x,y){
 const previous=busObstacleBase(x,y);if(previous)return previous;
 if(introPhase!=='done')return null;
 const r=streetBusFootprint();
 return x>r.left-13&&x<r.right+13&&y>r.top-8&&y<r.bottom+8?r:null;
};
const busSceneBase=drawIntroCar;
drawIntroCar=function(){busSceneBase();drawStreetBus()};
const busIntroStartBase=startIntro;
startIntro=function(...args){
 const result=busIntroStartBase(...args);
 player.y=laneBottom()-3;state='walk';jumpY=0;jumpActive=false;jumpKick=false;return result;
};
// Walk past the rear on the clear foreground strip instead of jumping over
// a full-sized bus. The waiting wave remains by the smoking barrel.
updateIntro=function(dt){
 const previous=player.x;introClock+=dt/60;clearStreetIntroInput();
 const p=Math.min(1,introClock/2.6);
 player.x=40+(streetLayout().fenceX+140-40)*p;player.y=laneBottom()-3;
 state='walk';facing=1;jumpY=0;cam=0;
 walkDistance+=Math.abs(player.x-previous);walkFrame=Math.floor(walkDistance/9)%currentSet().walk.length;
 if(p===1){introPhase='done';introClock=0;state='idle';walkFrame=0;walkDistance=0;cameraLastPlayerX=player.x;clearStreetIntroInput();}
};
