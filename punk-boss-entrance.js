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
 jefe.x=streetPropWorldX(punkEntrance.bossAnchor);
 jefe.y=punkEntrance.y;
 if(punkBarrel?.phase==='waiting'){punkBarrel.x=streetPropWorldX(punkEntrance.barrelAnchor);punkBarrel.y=punkEntrance.y;}
}
const punkEntranceActivateBase=activateBoss;
activateBoss=function(){
 const result=punkEntranceActivateBase(),finalCamera=Math.max(0,worldW-W),offset=punkBackdropOffsetAt(finalCamera);
 const visibleWidth=W/.8192,y=(laneTop()+laneBottom())/2;
 punkEntrance={phase:'waiting',bossAnchor:finalCamera+visibleWidth*.80-offset,barrelAnchor:finalCamera+visibleWidth*.50-offset,y,finalCamera,playerTargetX:finalCamera+visibleWidth*.16,cameraLock:null,previousLock:null};
 jefe.waitingForPlayer=true;jefe.engaged=false;jefe.state='idle';syncPunkEntrance();return result;
};
const punkEntranceFaceoffBase=startBossFaceoff;
startBossFaceoff=function(){
 syncPunkEntrance();punkEntranceFaceoffBase();
 if(!bossFaceoff||!punkEntrance)return;
 punkEntrance.phase='presentation';punkEntrance.cameraLock=cam;punkEntrance.previousLock=phaseCameraLock;phaseCameraLock=cam;
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
 if(positioned&&punkReady()&&bossFaceoffImages[selectedCharacter]?.complete&&bossFaceoffImages[selectedCharacter]?.naturalWidth){state='idle';startBossFaceoff();}
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
 syncPunkEntrance();const wasPresenting=punkEntrance?.phase==='presentation';
 if(wasPresenting){cam=punkEntrance.cameraLock;phaseCameraLock=punkEntrance.cameraLock;}
 const result=punkEntranceUpdateBase(dt);
 if(wasPresenting&&!bossFaceoff){
  cam=punkEntrance.cameraLock;phaseCameraLock=punkEntrance.previousLock;
  punkEntrance.phase='combat';jefe.engaged=true;jefe.waitingForPlayer=false;
  // Approach and throw begin on the next gameplay tick, not on this last shot.
 }else syncPunkEntrance();
 return result;
};
const punkEntranceSceneBase=drawIntroCar;
drawIntroCar=function(){syncPunkEntrance();return punkEntranceSceneBase()};
const punkEntranceDamageBase=damageEnemy;
damageEnemy=function(actor,...args){if(actor===jefe&&punkEntrance?.phase!=='combat'&&punkEntrance)return false;return punkEntranceDamageBase(actor,...args)};
const punkEntranceSelectBase=selectCharacter;
selectCharacter=function(name){punkEntrance=null;return punkEntranceSelectBase(name)};
