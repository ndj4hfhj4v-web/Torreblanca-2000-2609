// The initial three enemies keep warming their hands until the player walks
// a few steps under their own control. Standing still does not release them.
let barrelEnemyWait=null;
function enemiesStillAtBarrel(){return !!barrelEnemyWait&&!barrelEnemyWait.released&&introPhase==='done'&&activeWave===0}
const barrelWaitStartBase=startIntro;
startIntro=function(...args){barrelEnemyWait={released:false,walked:0};return barrelWaitStartBase(...args)};
const barrelWaitEnemyBase=updateEnemy;
updateEnemy=function(...args){if(enemiesStillAtBarrel())return;return barrelWaitEnemyBase(...args)};
const barrelWaitUpdateBase=update;
update=function(...args){
 const wasDone=introPhase==='done',previousX=player.x;
 const waiting=enemiesStillAtBarrel(),positions=waiting?activeWaveActors.map(actor=>({actor,x:actor.x,y:actor.y})):[];
 const result=barrelWaitUpdateBase(...args);
 if(waiting){
  for(const {actor,x,y} of positions){actor.x=x;actor.y=y;actor.state='idle';actor.attackTimer=0;}
  if(!jumpActive&&state==='walk')barrelEnemyWait.walked+=Math.max(0,player.x-previousX);
  if(barrelEnemyWait.walked>=80)barrelEnemyWait.released=true;
 }
 if(barrelEnemyWait&&!wasDone&&introPhase==='done')barrelEnemyWait.walked=0;
 return result;
};
const barrelWaitYonkiDrawBase=drawYonki;
drawYonki=function(...args){if(enemiesStillAtBarrel())return drawBarrelWaitingEnemy(yonki);return barrelWaitYonkiDrawBase(...args)};
const barrelWaitTresDrawBase=drawYonkiTres;
drawYonkiTres=function(...args){if(enemiesStillAtBarrel())return drawBarrelWaitingEnemy(yonkiTres);return barrelWaitTresDrawBase(...args)};
const barrelWaitRedDrawBase=drawYonkiRojo;
drawYonkiRojo=function(...args){if(enemiesStillAtBarrel())return drawBarrelWaitingEnemy(yonkiRojo);return barrelWaitRedDrawBase(...args)};
