// Match the mobile scenery transform, not the actors' scrolling transform.
function syncPunkWreck(){
 if(!bossCar||bossCar.phase!=='wreck')return;
 if(bossCar.hitAt===undefined)bossCar.hitAt=-Infinity;
 if(bossCar.sceneryAnchorX===undefined){
  const finalCamera=Math.max(0,worldW-W);
  const finalOffset=mobileLayout()?finalCamera+(W/.8192-worldW*2.35)-W*.5*(1-2.35):0;
  // Register against the FINAL backdrop, not wherever the last wave ended.
  bossCar.sceneryAnchorX=worldW-phaseConfig.scenery.wreck.endOffset-finalOffset;
 }
 bossCar.endDamage??=[bossCar.maxHp,bossCar.maxHp];
 bossCar.x=streetPropWorldX(bossCar.sceneryAnchorX);
 bossCar.y=laneTop()-H*phaseConfig.scenery.wreck.sidewalkOffset;
}
const punkWreckActivateBase=activateBoss;
activateBoss=function(){const result=punkWreckActivateBase();syncPunkWreck();return result};
const punkWreckFootprintsBase=otherCarFootprints;
otherCarFootprints=function(){syncPunkWreck();return punkWreckFootprintsBase()};
const punkWreckDrawBase=drawBossCart;
drawBossCart=function(){
 if(!bossCar||bossCar.phase!=='wreck')return punkWreckDrawBase();
 syncPunkWreck();if(!policeFrames)return;
 const draw=()=>{const x=bossCar.x-cam,y=bossCar.y;
  paintPoliceCar({x:bossCar.x-bossCarWidth/2,y,width:bossCarWidth},bossCar,3);
  // Animated soot rises from the wreck's bonnet; fixed emitter follows scenery.
  const clock=performance.now()/1000;
  ctx.save();
  for(let i=0;i<14;i++){
   const age=(clock*.22+i/14)%1,radius=7+age*20;
   const sx=x-bossCarWidth*.29+Math.sin(i*2.7+age*4)*age*22,sy=y-48-age*155;
   ctx.globalAlpha=.28*(1-age);ctx.fillStyle=i%2?'#383638':'#151619';
   ctx.beginPath();ctx.ellipse(sx,sy,radius,radius*.85,0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();};
 if(policeSceneQueue)policeSceneQueue.push({depth:bossCar.y+4,draw});else draw();
};
function strikePunkWreck(reach){
 syncPunkWreck();if(!bossCar||bossCar.phase!=='wreck'||playerDead)return false;
 const edge=bossCar.x-facing*bossCarWidth/2,ahead=(edge-player.x)*facing;
 if(ahead<=0||ahead>reach||Math.abs(player.y-(bossCar.y-10))>=meleeLaneTolerance)return false;
 bossCar.hitAt=performance.now();bossCar.hitSide=facing>0?-1:1;
 triggerImpact(edge,bossCar.y-45,facing,1.25);playCarMetalImpact(false);gainRafaSpecial(6);return true;
}
const punkWreckHitBase=tryPlayerHit;
tryPlayerHit=function(forceKick=false){if(!playerAttackLanded&&!pakoBatAttack&&strikePunkWreck(forceKick||state==='kick'||state==='jumpKick'?120:98)){playerAttackLanded=true;return true}return punkWreckHitBase(forceKick)};
const punkWreckBatBase=pakoBatStrike;
pakoBatStrike=function(){const hit=strikePunkWreck(batHitReach);return punkWreckBatBase()||hit};
