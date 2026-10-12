// Readable contact results. No damage, reach, timing or recorded audio changes.
const readableMetalSoundBase=playCarMetalImpact;
playCarMetalImpact=function(...args){
 const fx=combatFeedback[combatFeedback.length-1];
 if(fx&&!fx.blocked&&performance.now()-fx.started<60)fx.kind='metal';
 return readableMetalSoundBase(...args);
};
const readablePunchUpdateBase=updatePulidoAttack;
updatePulidoAttack=function(dt){
 const attack=pulidoAttack;const result=readablePunchUpdateBase(dt);
 if(attack&&attack===pulidoAttack&&attack.kind==='punch'&&!attack.missShown&&!attack.landed&&!playerAttackLanded&&['punchHold','punchRecover'].includes(state)){
  attack.missShown=true;const image=currentSet().idle;
  addCombatFeedback(player.x+facing*55,player.y-(image.naturalHeight||image.height)*mobileGameplayScale(selectedCharacter==='casta'?.58:.71)*.50,facing,.55);
  combatFeedback[combatFeedback.length-1].kind='miss';
 }
 return result;
};
drawImpactFlash=function(){
 const now=performance.now();
 for(let i=combatFeedback.length-1;i>=0;i--){
  const fx=combatFeedback[i],kind=fx.blocked?'block':fx.kind||'hit',duration=kind==='block'?260:kind==='metal'?220:kind==='miss'?110:150,p=(now-fx.started)/duration;
  if(p>=1){combatFeedback.splice(i,1);continue}
  const size=(8+p*22)*fx.strength;
  ctx.save();ctx.translate(fx.x-cam,fx.y);ctx.scale(fx.direction,1);ctx.globalAlpha=(1-p)*.85;ctx.lineWidth=2;
  if(kind==='block'){
   ctx.strokeStyle='#a5dfff';ctx.beginPath();ctx.arc(0,0,size,-1.25,1.25);ctx.stroke();
   for(let j=0;j<3;j++){const angle=-.7+j*.7;ctx.beginPath();ctx.moveTo(Math.cos(angle)*size,Math.sin(angle)*size);ctx.lineTo(Math.cos(angle)*(size+6),Math.sin(angle)*(size+6));ctx.stroke()}
   // Undo mirroring for readable text when the player attacks towards the left.
   ctx.scale(fx.direction,1);ctx.font='bold 10px Arial';ctx.textAlign='center';ctx.fillStyle='#c7ebff';ctx.fillText('BLOQUEO',0,-17-p*8);
  }else if(kind==='metal'){
   ctx.strokeStyle='#d7e3ee';ctx.lineWidth=1.7;
   for(let j=0;j<6;j++){const angle=-1.5+j*.53,distance=5+p*(25+j*2),drop=p*p*16;ctx.beginPath();ctx.moveTo(Math.cos(angle)*distance,Math.sin(angle)*distance+drop);ctx.lineTo(Math.cos(angle)*(distance+5),Math.sin(angle)*(distance+5)+drop);ctx.stroke()}
  }else if(kind==='miss'){
   ctx.strokeStyle='#aab2be';ctx.globalAlpha=(1-p)*.32;ctx.lineWidth=1.2;
   ctx.beginPath();ctx.arc(-7,0,5+p*8,-.7,.7);ctx.stroke();
  }else{
   ctx.fillStyle='#fff5ca';ctx.beginPath();ctx.arc(0,0,Math.max(0,5*(1-p))*fx.strength,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffd578';ctx.lineWidth=2.5*fx.strength;
   for(let j=0;j<7;j++){const angle=-1.3+j*.43;ctx.beginPath();ctx.moveTo(Math.cos(angle)*size*.3,Math.sin(angle)*size*.3);ctx.lineTo(Math.cos(angle)*size,Math.sin(angle)*size);ctx.stroke()}
  }
  ctx.restore();
 }
};
