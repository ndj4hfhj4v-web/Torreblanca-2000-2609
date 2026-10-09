// All stationary cars use the same narrow ground footprint as the first car.
function otherCarFootprints(){
 const result=[];
 if(introPhase!=='done')return result;
 const p=heavyStreetCarPosition(),half=heavyStreetCar.width/2;
 result.push({left:p.x-half+9,right:p.x+half-9,top:p.y-24,bottom:p.y+4});
 if(bossCar&&bossCar.phase!=='entry'){
  result.push({left:bossCar.x-bossCarWidth/2+9,right:bossCar.x+bossCarWidth/2-9,top:bossCar.y-24,bottom:bossCar.y+4});
 }
 return result;
}
const allCarsObstacleBase=streetObstacleAt;
streetObstacleAt=function(x,y){
 return allCarsObstacleBase(x,y)||otherCarFootprints().find(r=>x>r.left-13&&x<r.right+13&&y>r.top-8&&y<r.bottom+8)||null;
};
// The boss also goes around parked cars; its scripted exit remains untouched.
const allCarsBossUpdateBase=updateJefe;
updateJefe=function(dt){
 const x=jefe.x,y=jefe.y;allCarsBossUpdateBase(dt);
 if(!jefe.active||jefe.dead||jefe.knocked||bossCar?.phase==='exit')return;
 const r=streetObstacleAt(jefe.x,jefe.y);if(!r)return;
 jefe.x=x;jefe.y=y;
 const direction=r.bottom+10>=laneBottom()||player.y<r.top?-1:1;
 jefe.y=Math.max(laneTop(),Math.min(laneBottom(),y+direction*1.4*dt));
};
