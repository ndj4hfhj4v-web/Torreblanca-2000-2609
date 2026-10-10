// Full-body approved boss sprites. A single opening barrel throw, no cutout rig.
const punkBossAssets={};
let punkHorizontalWindup=null;
function installPunkHorizontalWindup(){
 if(!punkHorizontalWindup||!punkBossAssets.overhead)return;
 const f=punkHorizontalWindup,reference=punkBossAssets.overhead.frames[4];
 // Match the barrel's unchanged physical width, not the crouched pose height.
 const barrelWidth=frame=>{const w=frame.image.width,d=frame.image.getContext('2d').getImageData(0,Math.floor(frame.height*.04),w,1).data;let left=w,right=0;for(let x=0;x<w;x++)if(d[x*4+3]>40){left=Math.min(left,x);right=Math.max(right,x)}return Math.max(1,right-left)};
 f.relativeScale=barrelWidth(reference)/barrelWidth(f);
 const w=f.image.width,h=f.image.height,d=f.image.getContext('2d').getImageData(0,Math.floor(h*.88),w,Math.ceil(h*.12)).data;
 let left=w,right=0;for(let i=0;i<d.length/4;i++)if(d[i*4+3]>40){left=Math.min(left,i%w);right=Math.max(right,i%w)}f.anchorX=(left+right)/2;
 punkBossAssets.overhead.frames[5]=f;
}
const punkHorizontalWindupImage=imgFromData('assets/enemies/jefe-cresta/throw-windup-back.png');
function preparePunkHorizontalWindup(){
 if(!punkHorizontalWindupImage.complete||!punkHorizontalWindupImage.naturalWidth)return;
 try{punkHorizontalWindup=PunkBossPreview.prepare(punkHorizontalWindupImage,(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c},1,1).frames[0];installPunkHorizontalWindup()}catch(e){console.error('Horizontal barrel windup',e)}
}
punkHorizontalWindupImage.onload=preparePunkHorizontalWindup;preparePunkHorizontalWindup();
for(const [name,path,count,cols] of [['combat','combat.png',12,4],['walk','walk.png',6,3],['throw','throw-hit-down.png',6,3],['overhead','overhead-throw-v3.png',9,3],['kneel','kneel-hit.png',3,3]]){
 const image=imgFromData('assets/enemies/jefe-cresta/'+path);
 const prepare=()=>{if(!image.complete||!image.naturalWidth)return;try{punkBossAssets[name]=PunkBossPreview.prepare(image,(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c},count,cols);if(name==='overhead')for(const f of punkBossAssets[name].frames){const c=f.image.getContext('2d'),d=c.getImageData(0,Math.floor(f.image.height*.88),f.image.width,Math.ceil(f.image.height*.12)).data;let left=f.image.width,right=0;for(let i=0;i<d.length/4;i++)if(d[i*4+3]>40){left=Math.min(left,i%f.image.width);right=Math.max(right,i%f.image.width)}f.anchorX=(left+right)/2;}}catch(e){console.error('Punk boss sprite load',name,e)}};
 image.onload=()=>{prepare();installPunkHorizontalWindup()};prepare();installPunkHorizontalWindup();
}
let punkBarrel=null,punkThrow=null,punkAsh=[];
const punkBossPortrait=imgFromData('assets/enemies/jefe-cresta/faceoff.png');
function punkBossHeight(){const set=currentSet();return (set.idle.naturalHeight||set.idle.height)*mobileGameplayScale(selectedCharacter==='casta'?.58:.71)*1.22;}
function punkReady(){return punkBossAssets.combat&&punkBossAssets.walk&&punkBossAssets.throw&&punkBossAssets.overhead;}
function spawnPunkAsh(x,y){for(let i=0;i<32;i++)punkAsh.push({x,y:y-5,vx:(Math.random()-.5)*3.5,vy:-1-Math.random()*3,age:0});}
function advancePunkBarrel(dt){
 const b=punkBarrel;if(!b)return;
 if(b.phase==='air'){
  const duration=b.flightDuration||480,progress=Math.min(1,(b.elapsed+dt*16.67)/duration);
  b.elapsed+=dt*16.67;b.x-=4.8*dt;b.lift=(b.launchHeight||70)*(1-progress)+Math.sin(progress*Math.PI)*32;b.angle-=.08*dt;
  if(b.elapsed>=duration){b.phase='roll';b.lift=0;spawnPunkAsh(b.x,b.y);}
 }else if(b.phase==='roll'){
  const oldX=b.x;b.x-=5.2*dt;b.angle-=5.2*dt/29;
  if(!b.hit&&Math.abs(player.y-b.y)<30&&player.x>=Math.min(oldX,b.x)-45&&player.x<=Math.max(oldX,b.x)+45&&!(jumpActive&&jumpY<-48)){
   b.hit=true;damagePlayer(22,{facing:-1});
  }
  if(b.x<cam-160)b.phase='gone';
 }
}
const punkActivateBase=activateBoss;
activateBoss=function(){
 const result=punkActivateBase();
 const center=Math.max(0,worldW-W)+W/(2*.8192);
 punkBarrel={phase:'waiting',x:center,y:Math.max(laneTop()+70,Math.min(laneBottom()-20,jefe.y)),lift:0,angle:0,elapsed:0,hit:false};
 jefe.x=center+135;jefe.y=punkBarrel.y;jefe.drinkTimer=0;jefe.drinkCooldown=Infinity;
 punkThrow={phase:'approach',elapsed:0};punkAsh=[];bossLeap=null;bossLeapCooldown=Infinity;
 return result;
};
// Keep the existing faceoff timing/music but replace its old boss portrait.
const punkFaceoffBase=startBossFaceoff;
startBossFaceoff=function(){
 punkFaceoffBase();if(!bossFaceoff||!punkBossAssets.combat)return;
 const source=bossFaceoff.image,f=punkBossAssets.combat.frames[0],c=document.createElement('canvas');c.width=source.naturalWidth;c.height=source.naturalHeight;
 const p=c.getContext('2d'),half=c.width/2;p.fillStyle='#111b24';p.fillRect(0,0,c.width,c.height);
 // Existing portraits contain the player on the RIGHT. Mirror only that half.
 p.save();p.translate(half,0);p.scale(-1,1);p.drawImage(source,half,0,half,c.height,0,0,half,c.height);p.restore();
 if(punkBossPortrait.complete&&punkBossPortrait.naturalWidth){const w=punkBossPortrait.naturalWidth,h=punkBossPortrait.naturalHeight;p.drawImage(punkBossPortrait,w*.35,h*.1,w*.65,h*.9,half,0,half,c.height);}
 else p.drawImage(f.image,f.image.width*.40,0,f.image.width*.57,f.height*.34,half,0,half,c.height);
 c.naturalWidth=c.width;c.naturalHeight=c.height;bossFaceoff.image=c;
};
const punkJefeUpdateBase=updateJefe;
updateJefe=function(dt){
 bossLeap=null;bossLeapCooldown=Infinity;jefe.drinkCooldown=Infinity;jefe.drinkTimer=0;
 if(!punkReady()||!punkThrow||jefe.waitingForPlayer)return punkJefeUpdateBase(dt);
 if(jefe.dead||jefe.knocked||jefe.hitTimer>0||jefe.specialLiftOffset<0){punkThrow=null;if(punkBarrel?.phase==='held'){punkBarrel.phase='air';punkBarrel.elapsed=0;}return punkJefeUpdateBase(dt);}
 if(playerDead||timeExpired||bossFaceoff)return;
 const b=punkBarrel;
 if(punkThrow.phase==='approach'){
  const target=b.x+65,dx=target-jefe.x;jefe.facing=-1;
  if(Math.abs(dx)>2){const move=Math.sign(dx)*Math.min(Math.abs(dx),1.25*dt);jefe.x+=move;jefe.walkDistance+=Math.abs(move);jefe.state='walk';return;}
  punkThrow.phase='throw';punkThrow.elapsed=0;jefe.attackTimer=0;
 }
 punkThrow.elapsed+=dt*16.67;jefe.state='barrelThrow';jefe.facing=-1;
 const t=punkThrow.elapsed;
 if(b.phase==='waiting')b.phase='held';
 if(b.phase==='held'){b.x=jefe.x-48;b.y=jefe.y;b.lift=Math.min(1,t/1100)*punkBossHeight();}
 if(t>=1850&&b.phase==='held'){b.phase='air';b.elapsed=0;b.launchHeight=punkBossHeight();b.flightDuration=650;b.lift=b.launchHeight;b.angle=Math.PI/2;}
 if(t>=2800){punkThrow=null;jefe.state='idle';jefe.bossCooldown=24;}
};
const punkUpdateBase=update;
update=function(dt){
 const paused=window.gameAudioSettings?.isOpen||bossFaceoff||comparisonMode||playerDead||timeExpired||stageClear.active||continueCue.active;
 const result=punkUpdateBase(dt);
 if(!paused){advancePunkBarrel(dt);for(const a of punkAsh){a.age+=dt;a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=.055*dt;}punkAsh=punkAsh.filter(a=>a.age<95);}
 return result;
};
function paintPunkBarrel(){
 const b=punkBarrel;if(!b||b.phase==='gone'||b.phase==='held')return;
 const image=smokingBarrelImage;if(!image.complete||!image.naturalWidth)return;
 ctx.save();ctx.translate(b.x-cam,b.y-b.lift-30);
 ctx.rotate(b.phase==='waiting'?Math.PI/2:b.angle);
 const h=punkBossHeight()*.62,w=h*image.naturalWidth/image.naturalHeight;ctx.drawImage(image,-w/2,-h/2,w,h);ctx.restore();
}
const punkSceneBase=drawIntroCar;
drawIntroCar=function(){
 punkSceneBase();if(punkBarrel&&jefe.active){const draw=()=>paintPunkBarrel();if(policeSceneQueue)policeSceneQueue.push({depth:punkBarrel.y+1,draw});else draw();}
 for(const a of punkAsh){ctx.save();ctx.globalAlpha=Math.max(0,1-a.age/95)*.7;ctx.fillStyle='#aaa69e';ctx.fillRect(a.x-cam,a.y,2.5,2.5);ctx.restore();}
};
const punkDrawBase=drawJefe;
drawJefe=function(){
 if(!punkReady())return punkDrawBase();
 if(introPhase!=='done'||comparisonMode||!jefe.active||jefe.hidden)return;
 if(jefe.dead&&jefe.deadTimer<18&&Math.floor(jefe.deadTimer/3)%2===0)return;
 let set=punkBossAssets.combat,index=[0,1,2,3,2,1][Math.floor(performance.now()/180)%6],height=set.height;
 if(!jefe.dead&&punkKneel&&punkBossAssets.kneel){set=punkBossAssets.kneel;index=punkKneel.recoil>0?1:0;height=set.frames[2].height;}
 else if(jefe.dead||jefe.knocked){set=punkBossAssets.throw;index=5;height=punkBossAssets.combat.height*(set.frames[3].height/punkBossAssets.combat.frames[0].height);}
 else if(jefe.hitTimer>0){set=punkBossAssets.throw;index=4;height=set.frames[3].height;}
 else if(punkThrow?.phase==='throw'&&punkBossAssets.overhead){set=punkBossAssets.overhead;const t=punkThrow.elapsed;index=t<250?0:t<550?1:t<850?2:t<1100?3:t<1550?4:t<1850?(punkHorizontalWindup?5:4):t<2050?6:t<2450?7:8;height=set.frames[8].height;}
 else if(jefe.state==='walk'){set=punkBossAssets.walk;index=Math.floor(jefe.walkDistance/8)%6;height=set.height;}
 else if(jefe.state==='punch'){index=jefe.attackTimer>22?8:jefe.attackTimer>15?9:jefe.attackTimer>5?10:11;}
 const frame=set.frames[index],draw=()=>withActorNightLight(jefe,()=>{
  if(!punkKneel||punkKneel.recoil>0)return PunkBossPreview.paint(ctx,frame,jefe.x-cam,jefe.y+(jefe.specialLiftOffset||0),punkBossHeight()/height,jefe.facing<0);
  // A small nod at the neck; feet, arms and torso remain planted.
  const scale=punkBossHeight()/height,w=frame.image.width,h=frame.image.height,hx=w*.65,hy=h*.39;
  ctx.save();ctx.translate(jefe.x-cam,jefe.y);ctx.scale(jefe.facing<0?-scale:scale,scale);ctx.translate(-frame.anchorX,-frame.anchorY);
  ctx.save();ctx.beginPath();ctx.rect(0,0,w,h);ctx.rect(hx,0,w-hx,hy);ctx.clip('evenodd');ctx.drawImage(frame.image,0,0);ctx.restore();
  ctx.save();ctx.translate(w*.77,hy);ctx.rotate(Math.sin(performance.now()/360)*.025);ctx.translate(-w*.77,-hy);ctx.drawImage(frame.image,hx,0,w-hx,hy,hx,0,w-hx,hy);ctx.restore();ctx.restore();
 });
 if(policeSceneQueue)policeSceneQueue.push({depth:jefe.y,draw});else draw();
};
const punkSelectBase=selectCharacter;
selectCharacter=function(name){punkBarrel=null;punkThrow=null;punkAsh=[];bossLeap=null;bossLeapCooldown=Infinity;return punkSelectBase(name);};

// Recoverable kneeling stun: targetable, not a normal invulnerable floor knockdown.
let punkKneel=null,punkKneelCooldown=0,punkStaggerHits=0,punkStaggerTimer=0;
function startPunkKneel(){
 if(jefe.dead||jefe.specialLiftOffset<0)return;
 punkKneel={remaining:240,recoil:0};punkStaggerHits=0;punkStaggerTimer=0;punkThrow=null;bossLeap=null;
 if(punkBarrel?.phase==='held'){punkBarrel.phase='air';punkBarrel.elapsed=0;}
 jefe.knocked=false;jefe.knockTimer=0;jefe.comboHits=0;jefe.comboTimer=0;
 jefe.attackTimer=0;jefe.guardTimer=0;jefe.hitTimer=0;jefe.state='kneel';
 aerialFalls.delete(jefe);
}
const punkKneelDamageBase=damageEnemy;
damageEnemy=function(actor,amount,direction=facing,canBlock=false){
 if(actor!==jefe)return punkKneelDamageBase(actor,amount,direction,canBlock);
 const wasKneeling=!!punkKneel,airKick=jumpActive&&state==='jumpKick',oldX=actor.x,oldHp=actor.hp;
 if(wasKneeling){actor.knocked=false;actor.guardTimer=0;actor.comboHits=0;actor.comboTimer=0;}
 const result=punkKneelDamageBase(actor,amount,direction,wasKneeling?false:canBlock);
 if(actor.dead){punkKneel=null;return result;}
 if(wasKneeling&&actor.hp<oldHp){
  actor.x=oldX;actor.knocked=false;actor.knockTimer=0;actor.comboHits=0;actor.hitTimer=0;actor.attackTimer=0;
  punkKneel.recoil=14;actor.state='kneelHit';
  // No timer extension: repeated punches cannot stun-lock him indefinitely.
 }else if(actor.hp<oldHp&&!airKick&&!(actor.specialLiftOffset<0)){
  punkStaggerHits=punkStaggerTimer>0?punkStaggerHits+1:1;punkStaggerTimer=150;
  if(punkStaggerHits>=8&&punkKneelCooldown<=0)startPunkKneel();
 }
 if(actor.knocked&&!(actor.specialLiftOffset<0)){
  actor.knocked=false;actor.knockTimer=0;
  if(!airKick&&punkStaggerHits>=8&&punkKneelCooldown<=0)startPunkKneel();
  else{actor.comboHits=0;actor.comboTimer=0;actor.state='hit';}
 }
 return result;
};
const punkAirFallBase=knockDownFromAirKick;
knockDownFromAirKick=function(actor,direction){
 if(actor!==jefe)return punkAirFallBase(actor,direction);
 // Aerial kicks retain damage, but never launch or knock this boss onto the floor.
 aerialFalls.delete(actor);
 if(!actor.dead){actor.knocked=false;actor.knockTimer=0;}
};
const punkKneelTickBase=tickCombat;
tickCombat=function(dt){
 if(jefe.knocked&&!jefe.dead&&!(jefe.specialLiftOffset<0)&&!punkKneel){
  if(punkStaggerHits>=8&&punkKneelCooldown<=0)startPunkKneel();
  else{jefe.knocked=false;jefe.knockTimer=0;}
 }
 punkKneelTickBase(dt);punkKneelCooldown=Math.max(0,punkKneelCooldown-dt);punkStaggerTimer=Math.max(0,punkStaggerTimer-dt);
 if(!punkKneel)return;
 if(jefe.dead||jefe.specialLiftOffset<0){punkKneel=null;return;}
 punkKneel.remaining-=dt;punkKneel.recoil=Math.max(0,punkKneel.recoil-dt);
 jefe.knocked=false;jefe.state=punkKneel.recoil>0?'kneelHit':'kneel';
 if(punkKneel.remaining<=0){punkKneel=null;punkKneelCooldown=90;jefe.state='idle';jefe.comboHits=0;jefe.comboTimer=0;jefe.hitTimer=0;jefe.bossCooldown=18;}
};
const punkKneelJefeBase=updateJefe;
updateJefe=function(dt){if(punkKneel&&!jefe.dead){jefe.attackTimer=0;jefe.state=punkKneel.recoil>0?'kneelHit':'kneel';return;}return punkKneelJefeBase(dt);};
const punkKneelSelectBase=selectCharacter;
selectCharacter=function(name){punkKneel=null;punkKneelCooldown=0;punkStaggerHits=0;punkStaggerTimer=0;return punkKneelSelectBase(name);};
const punkKneelActivateBase=activateBoss;
activateBoss=function(){punkKneel=null;punkKneelCooldown=0;punkStaggerHits=0;punkStaggerTimer=0;return punkKneelActivateBase();};
