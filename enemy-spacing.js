// Soft separation prevents waiting enemies stacking on the attacker's body.
const spacedEnemyUpdateBase=updateEnemy;
updateEnemy=function(dt){
 spacedEnemyUpdateBase(dt);
 if(introPhase!=='done'||comparisonMode)return;
 const actors=normalActors.filter(a=>a.active&&!a.hidden&&!a.dead&&!a.knocked&&!(a.entryDelay>0)&&!(a.specialLiftOffset<0));
 for(let i=0;i<actors.length;i++)for(let j=i+1;j<actors.length;j++){
  const a=actors[i],b=actors[j],dx=b.x-a.x,dy=b.y-a.y;
  const distance=Math.hypot(dx,dy*1.3);if(distance>=52)continue;
  const amount=Math.min((52-distance)*.18,1.3*dt),nx=distance>.1?dx/distance:1,ny=distance>.1?dy/distance:0;
  const stationary=a.attackTimer>0?a:b.attackTimer>0?b:null;
  for(const [actor,sign] of [[a,-1],[b,1]]){
   if(actor===stationary||actor.hitTimer>0||actor===heavyEnemy&&actor.breakingStreetCar)continue;
   const x=actor.x+sign*nx*amount,y=Math.max(laneTop(),Math.min(laneBottom(),actor.y+sign*ny*amount));
   if(!streetObstacleAt(x,y)){actor.x=x;actor.y=y}
  }
 }
};
