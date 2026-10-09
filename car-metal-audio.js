// Recorded metal impact only for bat strikes; bare-handed car hits keep their sound.
const batCarMetalUrl='assets/audio/bat-car-metal.wav';
let batCarMetalBuffer=null,batCarMetalLoading=null,batCarSoundScope=0,batCarClipIndex=0;
const batCarMetalClips=Array.from({length:4},()=>{const clip=new Audio(batCarMetalUrl);clip.preload='auto';clip.volume=.65;return clip});
function warmBatCarMetal(){
 if(batCarMetalLoading)return batCarMetalLoading;
 const audio=sfxContext();if(!audio)return Promise.resolve();
 batCarMetalLoading=fetch(batCarMetalUrl).then(response=>{if(!response.ok)throw new Error('Metal sample unavailable');return response.arrayBuffer()}).then(bytes=>audio.decodeAudioData(bytes)).then(buffer=>{batCarMetalBuffer=buffer}).catch(()=>{});
 return batCarMetalLoading;
}
const batCarWarmBase=warmCombatImpactSfx;
warmCombatImpactSfx=function(){return Promise.all([batCarWarmBase(),warmBatCarMetal()])};
function playRecordedBatMetal(){
 const audio=sfxContext();
 if(audio&&batCarMetalBuffer){
  const source=audio.createBufferSource(),gain=audio.createGain();source.buffer=batCarMetalBuffer;gain.gain.value=.65;
  source.connect(gain);gain.connect(audioOutput(audio,'effects'));source.start();
 }else{
  const clip=batCarMetalClips[batCarClipIndex++%batCarMetalClips.length];clip.currentTime=0;clip.play().catch(()=>{});warmBatCarMetal();
 }
}
const batCarMetalBase=playCarMetalImpact;
playCarMetalImpact=function(wreck=false){if(batCarSoundScope>0)return playRecordedBatMetal();return batCarMetalBase(wreck)};
const recordedBatStrikeBase=pakoBatStrike;
pakoBatStrike=function(...args){batCarSoundScope++;try{return recordedBatStrikeBase(...args)}finally{batCarSoundScope--}};
const recordedHeavyCarBase=updateHeavyCarDestruction;
updateHeavyCarDestruction=function(...args){batCarSoundScope++;try{return recordedHeavyCarBase(...args)}finally{batCarSoundScope--}};
