// Victory: knees -> face-down collapse -> protagonist leaves behind the barricade.
const bossDefeatImage=imgFromData('assets/enemies/jefe-cresta/defeat-face-down-v1.png');
let bossDefeatFrames=null,bossEnding=null;
function prepareBossDefeat(){
 if(!bossDefeatImage.complete||!bossDefeatImage.naturalWidth)return;
 try{bossDefeatFrames=PunkBossPreview.prepare(bossDefeatImage,(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c},4,2)}catch(error){console.error('Boss defeat sprites',error)}
}
bossDefeatImage.onload=prepareBossDefeat;prepareBossDefeat();
function startBossEnding(){
 if(bossEnding)return;
 bossEnding={elapsed:0,phase:'collapse',x:jefe.x,y:jefe.y,direction:jefe.facing,camera:cam,playerGone:false};
 jefe.hidden=false;jefe.deadTimer=Infinity;jefe.attackTimer=0;jefe.guardTimer=0;jefe.hitTimer=0;
 punkKneel=null;punkThrow=null;punkShortHop=null;punkBarrel=null;
 rafaSpecialAttack=null;pulidoSpecialAttack=null;salviSpecialAttack=null;cajamanSpecialAttack=null;
 pulidoAttack=null;pakoBatAttack=null;attackTimer=0;jumpActive=false;jumpKick=false;jumpY=0;
 state='idle';clearStreetIntroInput();stopPhaseMusic();phaseCameraLock=cam;
}
const bossEndingDamageBase=damageEnemy;
damageEnemy=function(actor,...args){const wasDead=actor.dead,result=bossEndingDamageBase(actor,...args);if(actor===jefe&&!wasDead&&actor.dead)startBossEnding();return result};
const bossEndingUpdateBase=update;
update=function(dt){
 if(!bossEnding||bossEnding.phase==='finished')return bossEndingUpdateBase(dt);
 if(window.gameAudioSettings?.isOpen)return;
 const ending=bossEnding;ending.elapsed+=dt*16.67;
 cam=ending.camera;cameraLastPlayerX=player.x;cameraFollowVelocity=0;
 jefe.x=ending.x;jefe.y=ending.y;jefe.hidden=false;jefe.deadTimer=Infinity;
 clearStreetIntroInput();
 if(ending.elapsed<1850){state='idle';return}
 ending.phase='exit';facing=1;state='walk';
 const targetY=Math.max(laneTop()+12,Math.min(laneBottom()-12,ending.y));
 player.y+=Math.sign(targetY-player.y)*Math.min(Math.abs(targetY-player.y),.65*dt);
 const step=.972*dt;player.x+=step;walkDistance+=step;walkFrame=Math.floor(walkDistance/9)%currentSet().walk.length;
 // Only this post-victory walk may cross the right barricade; normal collision stays intact.
 const wall=bossBarrelWallPosition(),size=bossBarrelWallSize();
 if(player.x>wall.x+size.width*1.4){
  ending.playerGone=true;ending.phase='finished';state='idle';startStageClear();
 }
};
const bossEndingDrawBase=drawJefe;
drawJefe=function(){
 if(!bossEnding)return bossEndingDrawBase();
 const ending=bossEnding,t=ending.elapsed;
 let frame,scale;
 if(bossDefeatFrames){
  frame=bossDefeatFrames.frames[t<850?0:t<1100?1:t<1450?2:3];
  const reference=punkBossAssets.kneel;
  const height=reference?punkBossHeight()*reference.frames[0].height/reference.frames[2].height:punkBossHeight()*.73;
  scale=height/bossDefeatFrames.frames[0].height;
 }else if(punkBossAssets.kneel){frame=punkBossAssets.kneel.frames[0];scale=punkBossHeight()/punkBossAssets.kneel.frames[2].height}
 if(!frame)return;
 const advance=Math.min(1,Math.max(0,(t-850)/600))*20*ending.direction;
 const draw=()=>withActorNightLight(jefe,()=>PunkBossPreview.paint(ctx,frame,ending.x-cam+advance,ending.y,scale,ending.direction<0));
 if(policeSceneQueue)policeSceneQueue.push({depth:ending.y,draw});else draw();
};
const bossEndingPlayerDrawBase=drawPlayer;
drawPlayer=function(){
 if(!bossEnding)return bossEndingPlayerDrawBase();
 const draw=()=>{
  if(bossEnding.playerGone)return;
  if(bossEnding.phase!=='exit')return bossEndingPlayerDrawBase();
  const wall=bossBarrelWallPosition(),limit=wall.x-cam-bossBarrelWallSize().width*.34;
  ctx.save();ctx.beginPath();ctx.rect(-W*4,-H*4,Math.max(0,limit+W*4),H*8);ctx.clip();
  bossEndingPlayerDrawBase();ctx.restore();
 };
 if(!policeSceneQueue)return draw();
 policeSceneQueue.push({depth:player.y,draw});const queue=policeSceneQueue;policeSceneQueue=null;
 queue.sort((a,b)=>a.depth-b.depth);for(const item of queue)item.draw();
};
const bossEndingSelectBase=selectCharacter;
selectCharacter=function(name){bossEnding=null;return bossEndingSelectBase(name)};
const bossEndingActivateBase=activateBoss;
activateBoss=function(){bossEnding=null;return bossEndingActivateBase()};
