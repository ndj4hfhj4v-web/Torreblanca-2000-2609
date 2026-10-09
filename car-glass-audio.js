// Play once at the visual transition from cracked windows to shattered glass.
const carGlassUrl='assets/audio/car-glass-break.wav';
let carGlassBuffer=null,carGlassLoading=null,carGlassClipIndex=0;
const carGlassClips=Array.from({length:3},()=>{const clip=new Audio(carGlassUrl);clip.preload='auto';clip.volume=.65;return clip});
function warmCarGlass(){
 if(carGlassLoading)return carGlassLoading;
 const audio=sfxContext();if(!audio)return Promise.resolve();
 carGlassLoading=fetch(carGlassUrl).then(response=>{if(!response.ok)throw new Error('Glass sample unavailable');return response.arrayBuffer()}).then(bytes=>audio.decodeAudioData(bytes)).then(buffer=>{carGlassBuffer=buffer}).catch(()=>{});
 return carGlassLoading;
}
const glassWarmBase=warmCombatImpactSfx;
warmCombatImpactSfx=function(){return Promise.all([glassWarmBase(),warmCarGlass()])};
function playCarGlassBreak(){
 const audio=sfxContext();
 if(audio&&carGlassBuffer){
  const source=audio.createBufferSource(),gain=audio.createGain();source.buffer=carGlassBuffer;gain.gain.value=.65;
  source.connect(gain);gain.connect(audioOutput(audio,'effects'));source.start();
 }else{const clip=carGlassClips[carGlassClipIndex++%carGlassClips.length];clip.currentTime=0;clip.play().catch(()=>{});warmCarGlass()}
}
const glassPoliceDamageBase=damagePoliceCar;
damagePoliceCar=function(...args){const before=policeDamageStage();const result=glassPoliceDamageBase(...args);if(before<2&&policeDamageStage()>=2)playCarGlassBreak();return result};
const glassHeavyDamageBase=damageHeavyStreetCar;
damageHeavyStreetCar=function(...args){const before=heavyStreetCarStage();const result=glassHeavyDamageBase(...args);if(before<2&&heavyStreetCarStage()>=2)playCarGlassBreak();return result};
const glassHeavyAttackBase=updateHeavyCarDestruction;
updateHeavyCarDestruction=function(...args){const before=heavyStreetCarStage();const result=glassHeavyAttackBase(...args);if(before<2&&heavyStreetCarStage()>=2)playCarGlassBreak();return result};
function bossGlassBroken(){return !!bossCar&&(bossCar.hp===0||(bossCar.zoneDamage||[]).some(damage=>damage>=100))}
const glassBossDamageBase=damageBossCar;
damageBossCar=function(...args){const before=bossGlassBroken();const result=glassBossDamageBase(...args);if(!before&&bossGlassBroken())playCarGlassBreak();return result};
