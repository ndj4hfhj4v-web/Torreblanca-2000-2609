// Outermost collision pass includes scripted barrel approach and new attacks.
function resolveBossCarMovement(oldX,oldY,dt){
 if(!jefe.active||jefe.dead||jefe.knocked||jefe.specialLiftOffset<0)return;
 const targetX=jefe.x,targetY=jefe.y,steps=Math.max(1,Math.ceil(Math.hypot(targetX-oldX,targetY-oldY)/6));
 let safeX=oldX,safeY=oldY,blocked=null;
 for(let i=1;i<=steps;i++){
  const x=oldX+(targetX-oldX)*i/steps,y=oldY+(targetY-oldY)*i/steps;
  const r=streetObstacleAt(x,y);if(r){blocked=r;break}safeX=x;safeY=y;
 }
 if(!blocked)return;
 jefe.x=safeX;jefe.y=safeY;
 // Recover cleanly if a hit or reset placed his feet inside the obstacle.
 if(streetObstacleAt(safeX,safeY)){
  const edges=[{x:blocked.left-14,y:safeY},{x:blocked.right+14,y:safeY},{x:safeX,y:blocked.top-9},{x:safeX,y:blocked.bottom+9}];
  const free=edges.filter(p=>p.y>=laneTop()&&p.y<=laneBottom()&&!streetObstacleAt(p.x,p.y)).sort((a,b)=>Math.hypot(a.x-safeX,a.y-safeY)-Math.hypot(b.x-safeX,b.y-safeY))[0];
  if(free){jefe.x=free.x;jefe.y=free.y}
 }
 const direction=blocked.bottom+10>=laneBottom()||player.y<blocked.top?-1:1;
 const y=Math.max(laneTop(),Math.min(laneBottom(),jefe.y+direction*1.1*dt));
 if(!streetObstacleAt(jefe.x,y)){const distance=Math.abs(y-jefe.y);jefe.y=y;jefe.walkDistance+=distance;if(!punkThrow&&!punkKneel&&jefe.attackTimer<=0)jefe.state='walk'}
}
const bossSolidCarUpdateBase=updateJefe;
updateJefe=function(dt){const x=jefe.x,y=jefe.y,result=bossSolidCarUpdateBase(dt);if(!punkEntrance||punkEntrance.phase==='combat')resolveBossCarMovement(x,y,dt);return result};
