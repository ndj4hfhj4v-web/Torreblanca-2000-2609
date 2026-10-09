// A successful aerial kick knocks down, without changing damage or bypassing guards.
const aerialFalls=new Map();
function knockDownFromAirKick(actor,direction){
 const alreadyDown=actor.knocked;
 actor.attackTimer=0;actor.attackLanded=false;actor.guardTimer=0;actor.hitTimer=0;
 actor.comboHits=0;actor.comboTimer=0;actor.drinkTimer=0;
 if(!actor.dead){actor.knocked=true;actor.knockTimer=96;actor.state='down';if(!alreadyDown)playKnockoutSfx()}
 if(actor===jefe){bossLeap=null;jefe.drinkTimer=0}
 if(actor===heavyEnemy)dropHeavyBat();
 aerialFalls.set(actor,{elapsed:0,startX:actor.x,direction,distance:actor===jefe?32:55});
}
const aerialFallTickBase=tickCombat;
tickCombat=function(dt){
 aerialFallTickBase(dt);
 for(const [actor,fall] of aerialFalls){
  if(actor.hidden||(!actor.knocked&&!actor.dead)||actor.specialLiftOffset<0){aerialFalls.delete(actor);continue}
  fall.elapsed+=dt*16.67;
  const p=Math.min(1,fall.elapsed/330);
  actor.x=Math.max(35,Math.min(worldW-35,fall.startX+fall.direction*fall.distance*(1-(1-p)*(1-p))));
  if(fall.elapsed>=460)aerialFalls.delete(actor);
 }
};
const aerialFallDrawBase=drawActorImage;
drawActorImage=function(actor,img,scale){
 const fall=aerialFalls.get(actor);
 if(!fall||actor.hidden||actor.specialLiftOffset<0)return aerialFallDrawBase(actor,img,scale);
 const t=fall.elapsed,p=Math.min(1,t/330);
 const lift=t<330?Math.sin(p*Math.PI)*18:t<460?Math.sin((t-330)/130*Math.PI)*4:0;
 const set=actor===jefe?jefePisosRojos:enemySet(actor);
 const pose=t<100?(set.hit||img):(set.down||img);
 if(!pose.complete||!pose.width)return aerialFallDrawBase(actor,img,scale);
 ctx.save();
 ctx.translate(actor.x-cam,actor.y-lift);
 if(t<100)ctx.rotate(fall.direction*p*.32);
 ctx.scale(actor.facing<0?-1:1,1);
 ctx.drawImage(pose,-pose.width*scale/2,-pose.height*scale,pose.width*scale,pose.height*scale);
 ctx.restore();
};
const aerialFallSelectBase=selectCharacter;
selectCharacter=function(name){aerialFalls.clear();return aerialFallSelectBase(name)};
const aerialFallResetBase=resetWaveActor;
resetWaveActor=function(actor,...args){aerialFalls.delete(actor);return aerialFallResetBase(actor,...args)};

