// Short arms-open body attack, separate from the opening barrel throw.
const punkShortHopImage=imgFromData('assets/enemies/jefe-cresta/short-hop-v1.png');
let punkShortHopSheet=null,punkShortHop=null,punkShortHopCooldown=600,punkShortHopNormalAttacks=0;
function preparePunkShortHop(){
 if(!punkShortHopImage.complete||!punkShortHopImage.naturalWidth)return;
 try{punkShortHopSheet=PunkBossPreview.prepare(punkShortHopImage,(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c},4,2)}
 catch(error){console.error('Boss short hop sprites',error)}
}
punkShortHopImage.onload=preparePunkShortHop;preparePunkShortHop();
const shortHopJefeBase=updateJefe;
updateJefe=function(dt){
 const combat=introPhase==='done'&&jefe.active&&!jefe.hidden&&!jefe.waitingForPlayer&&(!punkEntrance||punkEntrance.phase==='combat');
 if(!combat||jefe.dead||jefe.knocked||punkKneel||jefe.specialLiftOffset<0||jefe.hitTimer>0){
  if(punkShortHop){punkShortHop=null;punkShortHopCooldown=900;punkShortHopNormalAttacks=0;jefe.attackTimer=0;}
  return shortHopJefeBase(dt);
 }
 if(playerDead||timeExpired||bossFaceoff)return;
 punkShortHopCooldown=Math.max(0,punkShortHopCooldown-dt);
 const dx=player.x-jefe.x;
 if(!punkShortHop&&punkShortHopSheet&&!punkThrow&&jefe.engaged&&jefe.attackTimer<=0&&jefe.guardTimer<=0&&punkShortHopCooldown===0&&!(jefe.bossCooldown>0)&&punkShortHopNormalAttacks>=2&&Math.abs(dx)>=60&&Math.abs(dx)<=210&&Math.abs(player.y-jefe.y)<meleeLaneTolerance){
  punkShortHop={elapsed:0,startX:jefe.x,direction:dx<0?-1:1,hit:false,lift:0};
  jefe.facing=punkShortHop.direction;jefe.attackTimer=0;
  punkShortHopNormalAttacks=0;
 }
 if(!punkShortHop){
  const previousTimer=jefe.attackTimer,result=shortHopJefeBase(dt);
  if(previousTimer<=0&&jefe.attackTimer>0&&jefe.state==='punch')punkShortHopNormalAttacks++;
  return result;
 }
 const move=punkShortHop;move.elapsed+=dt*16.67;jefe.state='shortHop';jefe.facing=move.direction;
 const p=Math.max(0,Math.min(1,(move.elapsed-220)/350)),oldX=jefe.x;
 jefe.x=Math.max(35,Math.min(worldW-35,move.startX+move.direction*60*p));
 move.lift=Math.sin(p*Math.PI)*18;
 if(move.elapsed>=220&&move.elapsed<=570&&!move.hit&&Math.abs(player.y-jefe.y)<meleeLaneTolerance&&!(jumpActive&&jumpY<-40)){
  const low=Math.min(oldX,jefe.x)-52,high=Math.max(oldX,jefe.x)+52;
  if(player.x>=low&&player.x<=high&&(player.x-jefe.x)*move.direction>=-18){move.hit=true;damagePlayer(14,{facing:move.direction});}
 }
 if(move.elapsed>=850){punkShortHop=null;punkShortHopCooldown=900;jefe.state='idle';jefe.attackTimer=0;}
};
const shortHopDrawBase=drawJefe;
drawJefe=function(){
 if(!punkShortHop||!punkShortHopSheet||jefe.dead||punkKneel)return shortHopDrawBase();
 const move=punkShortHop,index=move.elapsed<220?0:move.elapsed<330?1:move.elapsed<570?2:3;
 const frame=punkShortHopSheet.frames[index],x=jefe.x-cam,y=jefe.y-move.lift,direction=move.direction;
 const draw=()=>withActorNightLight(jefe,()=>PunkBossPreview.paint(ctx,frame,x,y,punkBossHeight()/punkShortHopSheet.height,direction<0));
 if(policeSceneQueue)policeSceneQueue.push({depth:jefe.y,draw});else draw();
};
const shortHopSelectBase=selectCharacter;
selectCharacter=function(name){punkShortHop=null;punkShortHopCooldown=600;punkShortHopNormalAttacks=0;return shortHopSelectBase(name)};
const shortHopActivateBase=activateBoss;
activateBoss=function(){punkShortHop=null;punkShortHopCooldown=600;punkShortHopNormalAttacks=0;return shortHopActivateBase()};
