// Waiting props follow the backdrop. Combat coordinates take over only AFTER
// the faceoff; no automatic approach or barrel throw during the presentation.
let punkEntrance=null;
function punkBackdropOffsetAt(camera){
 if(!mobileLayout())return 0;
 const scale=2.35,start=W*.5*(1-scale),end=W/.8192-worldW*scale;
 return camera+(end-start)*Math.max(0,Math.min(1,camera/Math.max(1,worldW-W)));
}
function syncPunkEntrance(){
 if(!punkEntrance||punkEntrance.phase==='combat')return;
 jefe.x=punkEntrance.phase==='reveal'?punkEntrance.revealX:streetPropWorldX(punkEntrance.bossAnchor);
 jefe.y=punkEntrance.y;
 if(punkBarrel?.phase==='waiting'){punkBarrel.x=streetPropWorldX(punkEntrance.barrelAnchor);punkBarrel.y=punkEntrance.y;}
}
const punkEntranceActivateBase=activateBoss;
activateBoss=function(){
 const result=punkEntranceActivateBase(),finalCamera=Math.max(0,worldW-W),offset=punkBackdropOffsetAt(finalCamera);
 const visibleWidth=W/.8192,y=(laneTop()+laneBottom())/2;
 punkEntrance={phase:'waiting',bossAnchor:finalCamera+visibleWidth*.80-offset,barrelAnchor:finalCamera+visibleWidth*.50-offset,y,finalCamera,playerTargetX:finalCamera+visibleWidth*.16,cameraLock:null,previousLock:null};
 jefe.hidden=true;jefe.waitingForPlayer=true;jefe.engaged=false;jefe.state='idle';syncPunkEntrance();return result;
};
const punkEntranceFaceoffBase=startBossFaceoff;
startBossFaceoff=function(){
 jefe.hidden=false;syncPunkEntrance();punkEntranceFaceoffBase();
 if(!bossFaceoff||!punkEntrance)return;
 const previousLock=['barrels','reveal'].includes(punkEntrance.phase)?punkEntrance.previousLock:phaseCameraLock;
 punkEntrance.phase='presentation';punkEntrance.cameraLock=cam;punkEntrance.previousLock=previousLock;phaseCameraLock=cam;
 jefe.waitingForPlayer=false;jefe.engaged=false;jefe.attackTimer=0;jefe.state='idle';
};
const punkEntranceJefeBase=updateJefe;
function beginPunkApproach(){
 if(!punkEntrance||punkEntrance.phase!=='waiting'||playerDead||timeExpired||jumpActive||playerKnocked)return;
 punkEntrance.phase='approach';advancePrompt=false;
 attackTimer=0;pulidoAttack=null;pakoBatAttack=null;rafaSpecialAttack=null;pulidoSpecialAttack=null;salviSpecialAttack=null;cajamanSpecialAttack=null;
 zPressed=false;xPressed=false;specialPressed=false;comboPressed=false;playerAttackLanded=false;
 state='walk';facing=1;
}
function advancePunkApproach(dt){
 if(window.gameAudioSettings?.isOpen)return;
 const entrance=punkEntrance,oldX=player.x,oldY=player.y;
 const dx=entrance.playerTargetX-player.x,dy=entrance.y-player.y;
 player.x+=Math.sign(dx)*Math.min(Math.abs(dx),.972*dt);
 player.y+=Math.sign(dy)*Math.min(Math.abs(dy),.792*dt);
 resolveWorldCollision(oldX,oldY);
 // During this short scripted walk only, move the camera towards the final
 // framing. The boss/barrel remain attached to the backdrop throughout.
 cam+=Math.sign(entrance.finalCamera-cam)*Math.min(Math.abs(entrance.finalCamera-cam),2*dt);
 cameraLastPlayerX=player.x;cameraFollowVelocity=0;syncPunkEntrance();
 const distance=Math.hypot(player.x-oldX,player.y-oldY);
 state=distance>.01?'walk':'idle';facing=1;
 if(distance>.01){walkDistance+=distance;const walk=currentSet().walk;walkFrame=Math.floor(walkDistance/9)%walk.length;}
 jefe.state='idle';jefe.facing=-1;jefe.attackTimer=0;
 const positioned=Math.abs(player.x-entrance.playerTargetX)<1&&Math.abs(player.y-entrance.y)<1&&Math.abs(cam-entrance.finalCamera)<.01;
 if(positioned&&punkReady()&&bossFaceoffImages[selectedCharacter]?.complete&&bossFaceoffImages[selectedCharacter]?.naturalWidth){state='idle';beginPunkBarrelEntrance();}
}
function beginPunkBarrelEntrance(){
 if(!punkEntrance)return;
 punkEntrance.phase='barrels';punkEntrance.volleyElapsed=0;punkEntrance.volleyShots=0;punkEntrance.volley=[];
 punkEntrance.cameraLock=cam;punkEntrance.previousLock=phaseCameraLock;phaseCameraLock=cam;
 jefe.hidden=true;jefe.waitingForPlayer=true;clearStreetIntroInput();
}
function advancePunkBarrelEntrance(dt){
 if(window.gameAudioSettings?.isOpen||playerDead||timeExpired)return;
 const entrance=punkEntrance,oldTime=phaseTime;entrance.volleyElapsed+=dt*16.67;
 // Let the player dodge and jump, but exclude the hidden boss from contact/targets.
 const active=jefe.active;jefe.active=false;
 try{punkEntranceUpdateBase(dt)}finally{jefe.active=active;phaseTime=oldTime;cam=entrance.cameraLock;phaseCameraLock=entrance.cameraLock}
 syncPunkEntrance();
 if(entrance.phase==='barrels'){
  if(entrance.volleyShots<3&&entrance.volleyElapsed>=350+entrance.volleyShots*2400){
   const source=nextBossWallBarrel(),wall=bossBarrelWallPosition();
   if(source)takeBossWallBarrel(source.row);
   const x=source?.x??wall.x,y=source?.y??entrance.y;
   const dx=player.x-x,dy=player.y-y,distance=Math.max(1,Math.hypot(dx,dy));
   entrance.volley.push({x,y,vx:dx/distance*4.8,vy:dy/distance*4.8,targetX:player.x,targetY:player.y,angle:0,hit:false,launchedAt:entrance.volleyElapsed});entrance.volleyShots++;
  }
  for(const barrel of entrance.volley){
   const oldX=barrel.x;barrel.x+=barrel.vx*dt;barrel.y+=barrel.vy*dt;
   if(barrel.x<=barrel.targetX){barrel.y=barrel.targetY;barrel.vy=0;}
   barrel.angle-=Math.abs(barrel.vx)*dt/Math.max(1,bossBarrelWallSize().width/2);
   if(!barrel.hit&&Math.abs(player.y-barrel.y)<30&&player.x>=Math.min(oldX,barrel.x)-45&&player.x<=Math.max(oldX,barrel.x)+45&&!(jumpActive&&jumpY<-48)){barrel.hit=true;damagePlayer(22,{facing:-1})}
  }
  if(entrance.volleyShots===3&&entrance.volley.every(b=>b.x<cam-120)){
   entrance.phase='reveal';entrance.revealElapsed=0;
   entrance.revealX=bossBarrelWallPosition().x+bossBarrelWallSize().width*1.6;
   jefe.x=entrance.revealX;jefe.walkDistance=0;jefe.hidden=false;jefe.state='walk';jefe.facing=-1;
  }
 }else if(entrance.phase==='reveal'){
  entrance.revealElapsed+=dt*16.67;
  const target=streetPropWorldX(entrance.bossAnchor),travel=Math.min(Math.max(0,entrance.revealX-target),1.7*dt);
  entrance.revealX-=travel;jefe.x=entrance.revealX;jefe.y=entrance.y;jefe.facing=-1;
  jefe.walkDistance=(jefe.walkDistance||0)+travel;jefe.state=travel>.01?'walk':'idle';
  if(entrance.revealX<=target+.01&&entrance.revealElapsed>=500&&!jumpActive&&!playerKnocked){clearStreetIntroInput();state='idle';startBossFaceoff()}
 }
}
function drawPunkEntranceBarrels(){
 if(!punkEntrance?.volley||!punkRollingBarrelImage.complete||!punkRollingBarrelImage.naturalWidth)return;
 const diameter=bossBarrelWallSize().width;
 for(const barrel of punkEntrance.volley){if(barrel.x<cam-120)continue;
  const draw=()=>paintProfilePunkBarrel(ctx,punkRollingBarrelImage,barrel.x-cam,barrel.y,0,diameter,barrel.angle);
  if(policeSceneQueue)policeSceneQueue.push({depth:barrel.y+1,draw});else draw();
 }
}
updateJefe=function(dt){
 if(punkEntrance&&punkEntrance.phase!=='combat'){
  syncPunkEntrance();jefe.state='idle';jefe.facing=-1;jefe.attackTimer=0;
  if(punkEntrance.phase==='waiting'&&!playerDead&&!timeExpired&&introPhase==='done'){
   if(player.x>=punkEntrance.finalCamera-W/.8192*.25)beginPunkApproach();
  }
  return;
 }
 return punkEntranceJefeBase(dt);
};
const punkEntranceUpdateBase=update;
update=function(dt){
 if(punkEntrance?.phase==='waiting'&&introPhase==='done'&&player.x>=punkEntrance.finalCamera-W/.8192*.25)beginPunkApproach();
 if(punkEntrance?.phase==='approach'){advancePunkApproach(dt);return;}
 if(punkEntrance?.phase==='barrels'||punkEntrance?.phase==='reveal'){advancePunkBarrelEntrance(dt);return;}
 syncPunkEntrance();const wasPresenting=punkEntrance?.phase==='presentation';
 if(wasPresenting){cam=punkEntrance.cameraLock;phaseCameraLock=punkEntrance.cameraLock;}
 const result=punkEntranceUpdateBase(dt);
 if(wasPresenting&&!bossFaceoff){
  cam=punkEntrance.cameraLock;phaseCameraLock=punkEntrance.previousLock;
  punkEntrance.phase='combat';jefe.hidden=false;jefe.engaged=true;jefe.waitingForPlayer=false;
  // Approach and throw begin on the next gameplay tick, not on this last shot.
 }else syncPunkEntrance();
 return result;
};
const punkEntranceSceneBase=drawIntroCar;
drawIntroCar=function(){syncPunkEntrance();const result=punkEntranceSceneBase();drawPunkEntranceBarrels();return result};
const punkEntranceDamageBase=damageEnemy;
damageEnemy=function(actor,...args){if(actor===jefe&&punkEntrance?.phase!=='combat'&&punkEntrance)return false;return punkEntranceDamageBase(actor,...args)};
const punkEntranceSelectBase=selectCharacter;
selectCharacter=function(name){punkEntrance=null;return punkEntranceSelectBase(name)};
