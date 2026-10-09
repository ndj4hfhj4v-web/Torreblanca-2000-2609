// Enemies entering from the left vault the barrier instead of getting trapped.
const enemyFenceVaults=new Map();
function fenceCenterAt(y){const top=laneTop(),bottom=laneBottom()+8,t=Math.max(0,Math.min(1,(y-top)/(bottom-top)));return streetPropWorldX(streetLayout().fenceX)-42+84*t}
const fenceVaultUpdateBase=update;
update=function(dt){
 const frozen=[];
 for(const [actor,vault] of enemyFenceVaults){
  if(actor.dead||actor.hidden||!actor.active){enemyFenceVaults.delete(actor);continue}
  frozen.push({actor,knocked:actor.knocked,timer:actor.knockTimer,x:actor.x,y:actor.y});
  actor.knocked=true;actor.knockTimer=100000;
 }
 fenceVaultUpdateBase(dt);
 for(const saved of frozen){
  const actor=saved.actor,vault=enemyFenceVaults.get(actor);actor.knocked=saved.knocked;actor.knockTimer=saved.timer;
  if(!vault)continue;
  vault.elapsed+=dt/60;const p=Math.min(1,vault.elapsed/.85),center=fenceCenterAt(vault.y);
  actor.x=center+vault.offset+(58-vault.offset)*p;actor.y=vault.y;actor.state='fenceJump';actor.facing=1;
  actor.attackTimer=0;vault.lift=Math.sin(Math.PI*p)*105;
  if(p===1){actor.state='idle';actor.attackCooldown=Math.max(actor.attackCooldown||0,15);enemyFenceVaults.delete(actor)}
 }
 if(introPhase!=='done'||playerDead||timeExpired||stageClear.active||continueCue.active)return;
 for(const actor of normalActors){
  if(!actor.active||actor.hidden||actor.dead||actor.knocked||actor.hitTimer>0||actor.entryDelay>0||actor.specialLiftOffset<0||enemyFenceVaults.has(actor))continue;
  const center=fenceCenterAt(actor.y),offset=actor.x-center;
  if(offset<0&&offset>-90&&player.x>center+25){
   enemyFenceVaults.set(actor,{elapsed:0,offset,y:actor.y,lift:0});actor.attackTimer=0;actor.state='fenceJump';actor.facing=1;
  }
 }
};
const fenceVaultDrawBase=drawActorImage;
drawActorImage=function(actor,img,scale){
 const vault=enemyFenceVaults.get(actor);if(!vault)return fenceVaultDrawBase(actor,img,scale);
 const set=enemySet(actor),pose=set.jump||set.hit||set.idle||img;
 const draw=()=>{
  ctx.save();ctx.fillStyle='rgba(0,0,0,.23)';ctx.beginPath();ctx.ellipse(actor.x-cam,actor.y+2,20,5,0,0,Math.PI*2);ctx.fill();
  ctx.translate(0,-vault.lift);fenceVaultDrawBase(actor,pose,scale);ctx.restore();
 };
 if(policeSceneQueue)policeSceneQueue.push({depth:actor.y,draw});else draw();
};
const fenceVaultIntroBase=startIntro;
startIntro=function(...args){enemyFenceVaults.clear();return fenceVaultIntroBase(...args)};
const fenceVaultResetBase=resetWaveActor;
resetWaveActor=function(actor,...args){enemyFenceVaults.delete(actor);return fenceVaultResetBase(actor,...args)};
