// Especial de Pulido: elevación y caída de los enemigos situados delante.
const pulidoLiftImg=imgFromData('assets/characters/pulido/special-lift.png');
let pulidoSpecialAttack=null;
const specialUpdateBase=update;
update=function(dt){
  if(selectedCharacter==='pulido'&&specialPressed&&!pulidoSpecialAttack){
    specialPressed=false;
    if(rafaSpecialMeter>=100&&!playerDead&&!playerKnocked&&!jumpActive&&introPhase==='done'&&!timeExpired&&!stageClear.active&&!continueCue.active){
      rafaSpecialMeter=0;attackTimer=0;pulidoAttack=null;crouchTimer=0;zPressed=false;xPressed=false;
      const targets=combatActors().filter(a=>!a.dead&&!a.knocked&&(a.x-player.x)*facing>0&&Math.abs(a.x-player.x)<210&&Math.abs(a.y-player.y)<28);
      targets.forEach(a=>{a.attackTimer=0;a.guardTimer=0;a.state='hit';a.knocked=true;a.knockTimer=999});
      pulidoSpecialAttack={elapsed:0,targets,slammed:false};
    }
  }
  if(!pulidoSpecialAttack){specialUpdateBase(dt);return}
  const move=pulidoSpecialAttack;move.elapsed+=dt*16.67;phaseTime=Math.max(0,phaseTime-dt/60);state='specialLift';
  const t=move.elapsed,height=80;
  move.targets.forEach(a=>{a.specialLiftOffset=t<420?-height*Math.min(1,t/420):t<760?-height:-height*Math.max(0,1-(t-760)/150)});
  if(t>=910&&!move.slammed){
    move.slammed=true;
    move.targets.forEach(a=>{a.specialLiftOffset=0;a.knocked=false;damageEnemy(a,42,facing,false);if(!a.dead){a.knocked=true;a.knockTimer=110;a.state='down';a.comboHits=0;a.comboTimer=0;playKnockoutSfx()}});
    pulidoHitStopMs=Math.max(pulidoHitStopMs,70);
  }
  if(t>=1160){move.targets.forEach(a=>{delete a.specialLiftOffset});pulidoSpecialAttack=null;state='idle'}
  if(phaseTime<=0){timeExpired=true;stopPhaseMusic();playDistantShout();move.targets.forEach(a=>{a.specialLiftOffset=0;if(!move.slammed){a.knocked=false;a.knockTimer=0;a.state='idle'}});pulidoSpecialAttack=null}
  updateCamera();
};
const specialActorDrawBase=drawActorImage;
drawActorImage=function(actor,img,scale){
  if(actor.specialLiftOffset<0){const oldY=actor.y;actor.y+=actor.specialLiftOffset;try{specialActorDrawBase(actor,enemySetForLift(actor),scale)}finally{actor.y=oldY}return}
  specialActorDrawBase(actor,img,scale);
};
function enemySetForLift(actor){return actor===jefe?jefePisosRojos.hit:enemySet(actor).hit||enemySet(actor).idle}
const specialPlayerDrawBase=drawPlayer;
drawPlayer=function(){if(selectedCharacter!=='pulido'||!pulidoSpecialAttack){specialPlayerDrawBase();return}const scale=.71,w=pulidoLiftImg.width*scale,h=pulidoLiftImg.height*scale;ctx.save();ctx.translate(player.x-cam,player.y);if(facing<0)ctx.scale(-1,1);ctx.drawImage(pulidoLiftImg,-w/2,-h,w,h);ctx.restore()};
const specialUiBase=ui;
ui=function(){specialUiBase();if(selectedCharacter==='pulido'&&introPhase==='done'&&!comparisonMode&&!continueCue.active&&!stageClear.active&&!stageClear.finished)drawSpecialMeter(18,-7,Math.min(150,W*.27),rafaSpecialMeter/100)};
const specialResetBase=selectCharacter;
selectCharacter=function(name){if(pulidoSpecialAttack)pulidoSpecialAttack.targets.forEach(a=>{delete a.specialLiftOffset});pulidoSpecialAttack=null;return specialResetBase(name)};
