// Intro replacement; world coordinates stay fixed as the camera scrolls.
const policeIntroImage=imgFromData('assets/vehicles/police-2000-v1.png');
let streetIntroLayout=null;
function streetLayout(){
 if(!streetIntroLayout)streetIntroLayout={fenceX:Math.min(300,W*.30),carX:Math.min(720,W*.77),carWidth:280};
 return streetIntroLayout;
}
// The enlarged mobile backdrop has its own scroll distance. Street props must
// use the same displacement, including their collisions, to stay on the asphalt.
function streetPropWorldX(initialX){
 if(!mobileLayout())return initialX;
 const scale=2.35,start=W*.5*(1-scale),end=W/.8192-worldW*scale;
 const progress=Math.max(0,Math.min(1,cam/Math.max(1,worldW-W)));
 return initialX+cam+(end-start)*progress;
}
function policeCarRect(){
 const s=streetLayout(),base=laneTop()+Math.min(75,(laneBottom()-laneTop())*.48);
 return {x:streetPropWorldX(s.carX),y:base,width:s.carWidth,height:s.carWidth*1024/1536};
}
function policeFootprint(){
 const r=policeCarRect();
 return {left:r.x+8,right:r.x+r.width-8,top:r.y-39,bottom:r.y+3};
}
introRunning=function(){return ['arrival','doors','exit'].includes(introPhase)};
function clearStreetIntroInput(){
 for(const key of Object.keys(keys))keys[key]=false;
 zPressed=false;xPressed=false;comboPressed=false;comboHeld=false;specialPressed=false;
}
startIntro=function(){
 streetIntroLayout=null;const s=streetLayout();
 introPhase='arrival';introClock=0;cam=0;cameraLastPlayerX=null;
 introDoorOpen=0;introCarX=-2000;introWheelAngle=0;
 player.x=40;player.y=laneTop()+(laneBottom()-laneTop())*.76;
 facing=1;state='walk';jumpY=0;jumpActive=false;jumpKick=false;
 walkFrame=0;walkDistance=0;clearStreetIntroInput();
 activateWave(0);
 activeWaveActors.forEach((actor,i)=>{
  actor.entryDelay=0;actor.active=true;actor.hidden=false;actor.entrySide=1;
  actor.x=s.fenceX+210+i*90;actor.y=laneBottom()-14-i*18;
  actor.state='idle';actor.attackTimer=0;actor.attackCooldown=30+i*12;
 });
};
updateIntro=function(dt){
 const s=streetLayout(),previous=player.x;introClock+=dt/60;
 clearStreetIntroInput();
 if(introPhase==='arrival'){
  const p=Math.min(1,introClock/1.45);
  player.x=40+(s.fenceX-80-40)*p;state='walk';
  walkDistance+=Math.abs(player.x-previous);walkFrame=Math.floor(walkDistance/9)%currentSet().walk.length;
  if(p===1){introPhase='doors';introClock=0;state='crouch'}
 }else if(introPhase==='doors'){
  state='crouch';
  if(introClock>=.22){introPhase='exit';introClock=0;state='jump'}
 }else if(introPhase==='exit'){
  const p=Math.min(1,introClock/.95);
  player.x=s.fenceX-80+220*p;state='jump';jumpY=-Math.sin(p*Math.PI)*125;
  if(p===1){introPhase='done';introClock=0;state='idle';jumpY=0;walkFrame=0;walkDistance=0;clearStreetIntroInput();cameraLastPlayerX=player.x}
 }
 cam=0;
};
// A continuous barrier across the road's depth, not three front-facing panels.
function streetFenceSegments(){
 const s=streetLayout(),fenceX=streetPropWorldX(s.fenceX),top=laneTop(),bottom=laneBottom()+8;
 return Array.from({length:3},(_,i)=>{
  const a=i/3,b=(i+1)/3;
  return {x1:fenceX-42+84*a,y1:top+(bottom-top)*a,x2:fenceX-42+84*b,y2:top+(bottom-top)*b};
 });
}
function drawStreetFences(){
 const s=streetLayout();if(streetPropWorldX(s.fenceX)-cam<-160)return;
 ctx.save();ctx.lineCap='round';
 for(const panel of streetFenceSegments()){
  const dx=panel.x2-panel.x1,dy=panel.y2-panel.y1;
  ctx.save();
  // Keep posts vertical; project the panel's horizontal axis across the asphalt.
  ctx.transform(dx/100,dy/100,0,1,panel.x1-cam,panel.y1);
  ctx.strokeStyle='#232a2c';ctx.lineWidth=7;ctx.strokeRect(0,-65,100,59);
  ctx.strokeStyle='#a6afb0';ctx.lineWidth=3;ctx.strokeRect(0,-65,100,59);
  for(let j=1;j<8;j++){ctx.beginPath();ctx.moveTo(j*12.5,-63);ctx.lineTo(j*12.5,-8);ctx.stroke()}
  ctx.fillStyle='#d8aa2c';ctx.fillRect(22,-48,56,19);
  ctx.fillStyle='#242424';ctx.font='bold 8px sans-serif';ctx.textAlign='center';ctx.fillText('CALLE CORTADA',50,-35);
  ctx.restore();
  // Feet lie on the asphalt on either side of the transverse fence.
  ctx.strokeStyle='#747f83';ctx.lineWidth=4;
  ctx.beginPath();ctx.moveTo(panel.x1-cam-12,panel.y1+3);ctx.lineTo(panel.x1-cam+12,panel.y1-3);ctx.stroke();
 }
 const end=streetFenceSegments()[2];
 ctx.beginPath();ctx.moveTo(end.x2-cam-12,end.y2+3);ctx.lineTo(end.x2-cam+12,end.y2-3);ctx.stroke();
 ctx.restore();
}
function drawPoliceCar(){
 if(!policeIntroImage.complete||!policeIntroImage.naturalWidth)return;
 const r=policeCarRect(),x=r.x-cam,y=r.y-r.height*.90;
 if(x+r.width<0||x>W/.8192+100)return;
 ctx.drawImage(policeIntroImage,x,y,r.width,r.height);
 // Alternate blue strobes, anchored to the generated roof lightbar.
 const beat=performance.now()%800,side=beat<400?0:1,on=beat%400<100||(beat%400>160&&beat%400<260);
 if(on){
  ctx.save();ctx.globalCompositeOperation='lighter';
  const lx=x+r.width*(side?.64:.46),ly=y+r.height*.19;
  const glow=ctx.createRadialGradient(lx,ly,1,lx,ly,25);glow.addColorStop(0,'rgba(170,225,255,.95)');glow.addColorStop(.25,'rgba(35,120,255,.7)');glow.addColorStop(1,'rgba(20,70,255,0)');
  ctx.fillStyle=glow;ctx.fillRect(lx-25,ly-25,50,50);ctx.fillStyle='#cff5ff';ctx.fillRect(lx-5,ly-2,10,4);ctx.restore();
 }
}
drawIntroCar=function(){
 if(introPhase==='none')return;
 drawStreetFences();drawPoliceCar();drawHeavyStreetCar();
 // The waiting wave is visible before control is handed to the player.
 if(introRunning())for(const actor of activeWaveActors)drawActorImage(actor,enemySet(actor).idle,mobileGameplayScale(actorScale(actor)));
};
const streetPlayerDrawBase=drawPlayer;
drawPlayer=function(){
 if(!introRunning()){streetPlayerDrawBase();return}
 const set=currentSet(),img=state==='walk'?set.walk[walkFrame%set.walk.length]:state==='crouch'?set.crouch:set.jump;
 if(!img?.complete||!img.width)return;
 const scale=mobileGameplayScale(selectedCharacter==='casta'?.58:.71);
 ctx.save();ctx.translate(player.x-cam,player.y+jumpY);ctx.drawImage(img,-img.width*scale/2,-img.height*scale,img.width*scale,img.height*scale);ctx.restore();
};
carBlocksAt=function(x,y){
 if(introPhase!=='done')return false;
 const r=policeFootprint(),padding=13;
 return x>r.left-padding&&x<r.right+padding&&y>r.top-8&&y<r.bottom+8;
};
const streetUpdateBase=update;
update=function(dt){
 const positions=normalActors.map(actor=>[actor,actor.x,actor.y]);
 streetUpdateBase(dt);
 if(introPhase!=='done')return;
 const r=policeFootprint();
 for(const [actor,x,y] of positions){
  if(!actor.active||actor.dead||actor.knocked||actor.specialLiftOffset<0||!carBlocksAt(actor.x,actor.y))continue;
  actor.x=x;actor.y=y;
  // Route gradually around the footprint; never teleport to the other side.
  if(y<=r.top-8||y>=r.bottom+8){
   actor.x=x+(x<(r.left+r.right)/2?-1:1)*1.4*dt;
  }else actor.y=Math.min(laneBottom(),y+1.4*dt);
 }
};
