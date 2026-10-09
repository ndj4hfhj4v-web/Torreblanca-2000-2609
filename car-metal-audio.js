// Separate recordings for bare-handed car hits and player/Heavy bat strikes.
let batCarSoundScope=0;
const carMetalSamples={};
for(const [kind,url] of Object.entries({unarmed:'assets/audio/bat-car-metal.wav',bat:'assets/audio/bat-hits-car.wav'})){
 carMetalSamples[kind]={url,buffer:null,loading:null,index:0,clips:Array.from({length:4},()=>{const clip=new Audio(url);clip.preload='auto';clip.volume=.65;return clip})};
}
function warmCarMetalSample(sample){
 if(sample.loading)return sample.loading;
 const audio=sfxContext();if(!audio)return Promise.resolve();
 sample.loading=fetch(sample.url).then(response=>{if(!response.ok)throw new Error('Metal sample unavailable');return response.arrayBuffer()}).then(bytes=>audio.decodeAudioData(bytes)).then(buffer=>{sample.buffer=buffer}).catch(()=>{});
 return sample.loading;
}
const batCarWarmBase=warmCombatImpactSfx;
warmCombatImpactSfx=function(){return Promise.all([batCarWarmBase(),...Object.values(carMetalSamples).map(warmCarMetalSample)])};
function playRecordedCarMetal(sample){
 const audio=sfxContext();
 if(audio&&sample.buffer){
  const source=audio.createBufferSource(),gain=audio.createGain();source.buffer=sample.buffer;gain.gain.value=.65;
  source.connect(gain);gain.connect(audioOutput(audio,'effects'));source.start();
 }else{
  const clip=sample.clips[sample.index++%sample.clips.length];clip.currentTime=0;clip.play().catch(()=>{});warmCarMetalSample(sample);
 }
}
playCarMetalImpact=function(){return playRecordedCarMetal(carMetalSamples[batCarSoundScope>0?'bat':'unarmed'])};
const recordedBatStrikeBase=pakoBatStrike;
pakoBatStrike=function(...args){batCarSoundScope++;try{return recordedBatStrikeBase(...args)}finally{batCarSoundScope--}};
const recordedHeavyCarBase=updateHeavyCarDestruction;
updateHeavyCarDestruction=function(...args){batCarSoundScope++;try{return recordedHeavyCarBase(...args)}finally{batCarSoundScope--}};
