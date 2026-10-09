// Landed kicks have their own sample; car metal and blocked hits are separate.
const kickImpactUrl='assets/audio/kick-hit.mp3';
let kickImpactBuffer=null,kickImpactLoading=null,kickImpactIndex=0,kickSoundContext=false;
const kickImpactClips=Array.from({length:6},()=>{const clip=new Audio(kickImpactUrl);clip.preload='auto';clip.volume=.20;return clip});
function warmKickImpact(){
 if(kickImpactLoading)return kickImpactLoading;
 const audio=sfxContext();if(!audio)return Promise.resolve();
 kickImpactLoading=fetch(kickImpactUrl).then(response=>{if(!response.ok)throw new Error('Kick sample unavailable');return response.arrayBuffer()}).then(bytes=>audio.decodeAudioData(bytes)).then(buffer=>{kickImpactBuffer=buffer}).catch(()=>{});
 return kickImpactLoading;
}
const kickImpactWarmBase=warmCombatImpactSfx;
warmCombatImpactSfx=function(){return Promise.all([kickImpactWarmBase(),warmKickImpact()])};
const kickImpactSoundBase=playPunchImpactSfx;
playPunchImpactSfx=function(){
 if(!kickSoundContext)return kickImpactSoundBase();
 const audio=sfxContext();
 if(audio&&kickImpactBuffer){
  const source=audio.createBufferSource(),gain=audio.createGain();source.buffer=kickImpactBuffer;gain.gain.value=.20;
  source.connect(gain);gain.connect(audioOutput(audio,'effects'));source.start();
 }else{const clip=kickImpactClips[kickImpactIndex++%kickImpactClips.length];clip.currentTime=0;clip.play().catch(()=>{});warmKickImpact()}
};
function withKickSound(isKick,callback){const previous=kickSoundContext;kickSoundContext=isKick;try{return callback()}finally{kickSoundContext=previous}}
const kickPlayerHitBase=tryPlayerHit;
tryPlayerHit=function(forceKick=false){return withKickSound(!pakoBatAttack&&(forceKick||/^kick/.test(state)||state==='jumpKick'),()=>kickPlayerHitBase(forceKick))};
const kickRafaHitBase=tryRafaSpecialHit;
tryRafaSpecialHit=function(...args){return withKickSound(true,()=>kickRafaHitBase(...args))};
const kickEnemyStrikeBase=enemyStrike;
enemyStrike=function(...args){return withKickSound(false,()=>kickEnemyStrikeBase(...args))};
