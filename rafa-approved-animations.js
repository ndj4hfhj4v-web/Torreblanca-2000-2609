// Approved Rafa poses only. No changes to damage, input, recovery timers or other actors.
(()=>{
 const sets=window.rafaApprovedFrames;if(!sets)return;
 for(const a of Object.values(sets))a.frames.forEach(f=>{f.image=new Image();f.image.src=f.src;});
 let age=0,wasDown=false,clock=0,landAt=-Infinity;
 const baseUpdate=update;
 update=function(dt){
  const paused=gamePaused||document.hidden||window.gameAudioSettings?.isOpen,air=jumpActive;
  const result=baseUpdate(dt);if(paused)return result;
  clock+=dt*16.67;if(air&&!jumpActive)landAt=clock;
  const down=selectedCharacter==='rafa'&&(playerKnocked||playerDead);
  age=down?(wasDown?age+dt*16.67:0):0;wasDown=down;return result;
 };
 const baseSelect=selectCharacter;
 selectCharacter=function(...args){age=0;wasDown=false;landAt=-Infinity;return baseSelect(...args)};
 const baseDraw=drawPlayer;
 drawPlayer=function(){
  if(selectedCharacter!=='rafa'||introPhase!=='done'||comparisonMode||pulidoHookAttack||batSpecialActive())return baseDraw();
  const down=playerKnocked||playerDead,bat=pakoHasBat&&!down,a=sets[bat?'bat':'combat'];let i=4,lift=0;
  if(down)i=age<110?20:age<290?21:!playerDead&&playerKnockTimer<8?19:!playerDead&&playerKnockTimer<15?23:22;
  else if(playerHitTimer>0)i=bat?19:20;
  else if(pakoBatAttack){const t=pakoBatAttack.elapsed;i=t<130?6:t<330?7:t<405?8:9;}
  else if(jumpActive){const recover=state==='jumpRecover';i=bat?(jumpKick?(recover?16:15):14):(jumpKick?(recover?18:17):16);lift=-jumpY+Math.max(0,a.bodyHeight-a.frames[i].height)*a.referenceHeight/a.bodyHeight*mobileGameplayScale(.71);}
  else if(pulidoAttack){const t=pulidoAttack.elapsed;if(pulidoAttack.kind==='kick'){const start=bat?10:12;i=t<50?start:t<100?start+1:t<240?start+2:start+3;}else{const arm=pulidoAttack.arm;i=t<80?(arm?9:6):t<195?(arm?10:7):(arm?11:8);}}
  else if(state==='kick'){const start=bat?10:12;i=attackTimer>7?start:attackTimer>5?start+1:attackTimer>2?start+2:start+3;}
  else if(state==='walk')i=a.walk[Math.floor(walkDistance/(60/a.walk.length))%a.walk.length];
  else if(state==='crouch')i=bat?20:19;
  else if(clock-landAt<100)i=bat?17:4;
  else if(state==='idle')i=4+Math.floor(clock/380)%2;
  else return baseDraw();
  const f=a.frames[i];if(!f.image.complete||!f.image.naturalWidth)return baseDraw();
  const scale=mobileGameplayScale(.71)*a.referenceHeight/a.bodyHeight*f.scale;
  const draw=()=>withActorNightLight(player,()=>{ctx.save();ctx.translate(player.x-cam,player.y-lift);ctx.scale(facing*scale,scale);ctx.drawImage(f.image,-f.x,-f.y);ctx.restore();});
  if(!policeSceneQueue)return draw();policeSceneQueue.push({depth:player.y,draw});const queue=policeSceneQueue;policeSceneQueue=null;queue.sort((a,b)=>a.depth-b.depth);for(const item of queue)item.draw();
 };
})();
