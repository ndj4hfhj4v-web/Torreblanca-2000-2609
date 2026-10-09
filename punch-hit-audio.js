// This recording belongs to landed unarmed punches, not the shared damage effect.
const facePunchUrl='assets/audio/punch-face-hit.wav';
let facePunchBuffer=null,facePunchLoading=null,facePunchIndex=0,punchSoundContext=null;
const facePunchClips=Array.from({length:6},()=>{const clip=new Audio(facePunchUrl);clip.preload='auto';clip.volume=.20;return clip});
function warmFacePunch(){
 if(facePunchLoading)return facePunchLoading;
 const audio=sfxContext();if(!audio)return Promise.resolve();
 facePunchLoading=fetch(facePunchUrl).then(response=>{if(!response.ok)throw new Error('Punch sample unavailable');return response.arrayBuffer()}).then(bytes=>audio.decodeAudioData(bytes)).then(buffer=>{facePunchBuffer=buffer}).catch(()=>{});
 return facePunchLoading;
}
const facePunchWarmBase=warmCombatImpactSfx;
warmCombatImpactSfx=function(){return Promise.all([facePunchWarmBase(),warmFacePunch()])};
const facePunchImpactBase=playPunchImpactSfx;
playPunchImpactSfx=function(){
 if(punchSoundContext!==true)return facePunchImpactBase();
 const audio=sfxContext();
 if(audio&&facePunchBuffer){
  const source=audio.createBufferSource(),gain=audio.createGain();source.buffer=facePunchBuffer;gain.gain.value=.20;
  source.connect(gain);gain.connect(audioOutput(audio,'effects'));source.start();
 }else{const clip=facePunchClips[facePunchIndex++%facePunchClips.length];clip.currentTime=0;clip.play().catch(()=>{});warmFacePunch()}
};
function withPunchSound(isPunch,callback){const previous=punchSoundContext;punchSoundContext=isPunch;try{return callback()}finally{punchSoundContext=previous}}
const facePunchPlayerHitBase=tryPlayerHit;
tryPlayerHit=function(forceKick=false){
 const punch=!forceKick&&!pakoBatAttack&&/^punch/.test(state);
 return withPunchSound(punch,()=>facePunchPlayerHitBase(forceKick));
};
const facePunchEnemyStrikeBase=enemyStrike;
enemyStrike=function(actor,...args){return withPunchSound(!(actor===heavyEnemy&&heavyHasBat),()=>facePunchEnemyStrikeBase(actor,...args))};
const facePunchDamageBase=damageEnemy;
damageEnemy=function(...args){
 // The alternating-arm special is also a punch. Enemy strikes override this
 // context while they run, so a bat hit during the barrage keeps its old sound.
 if(punchSoundContext===null&&cajamanSpecialAttack&&state==='cajamanBarrage'&&args[1]===10)return withPunchSound(true,()=>facePunchDamageBase(...args));
 return facePunchDamageBase(...args);
};
