// Two distant emergency-car sounds per run, at randomized active-play times.
const emergencyAmbienceUrl='assets/audio/distant-emergency-car.wav';
const emergencyAmbienceClip=new Audio(emergencyAmbienceUrl);emergencyAmbienceClip.preload='auto';emergencyAmbienceClip.volume=.06;
let emergencyAmbienceBuffer=null,emergencyAmbienceLoading=null,emergencyAmbienceSource=null;
let emergencyAmbienceElapsed=0,emergencyAmbienceTimes=[],emergencyAmbienceIndex=0;
function warmEmergencyAmbience(){
 if(emergencyAmbienceLoading)return emergencyAmbienceLoading;
 const audio=sfxContext();if(!audio)return Promise.resolve();
 emergencyAmbienceLoading=fetch(emergencyAmbienceUrl).then(response=>{if(!response.ok)throw new Error('Emergency sample unavailable');return response.arrayBuffer()}).then(bytes=>audio.decodeAudioData(bytes)).then(buffer=>{emergencyAmbienceBuffer=buffer}).catch(()=>{});
 return emergencyAmbienceLoading;
}
const emergencyWarmBase=warmCombatImpactSfx;
warmCombatImpactSfx=function(){return Promise.all([emergencyWarmBase(),warmEmergencyAmbience()])};
function stopEmergencyAmbience(){
 if(emergencyAmbienceSource){try{emergencyAmbienceSource.stop()}catch{}emergencyAmbienceSource=null}
 emergencyAmbienceClip.pause();emergencyAmbienceClip.currentTime=0;
}
function playEmergencyAmbience(){
 stopEmergencyAmbience();const audio=sfxContext();
 if(audio&&emergencyAmbienceBuffer){
  const source=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();
  source.buffer=emergencyAmbienceBuffer;filter.type='lowpass';filter.frequency.value=950;filter.Q.value=.5;
  const now=audio.currentTime,duration=source.buffer.duration,fade=Math.min(.7,duration/3);
  gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.06,now+fade);
  gain.gain.setValueAtTime(.06,now+Math.max(fade,duration-fade));gain.gain.linearRampToValueAtTime(0,now+duration);
  source.connect(filter);filter.connect(gain);gain.connect(audioOutput(audio,'effects'));emergencyAmbienceSource=source;
  source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();if(emergencyAmbienceSource===source)emergencyAmbienceSource=null};source.start();
 }else{emergencyAmbienceClip.play().catch(()=>{});warmEmergencyAmbience()}
}
const emergencyIntroBase=startIntro;
startIntro=function(){
 stopEmergencyAmbience();emergencyAmbienceElapsed=0;emergencyAmbienceIndex=0;
 emergencyAmbienceTimes=[18+Math.random()*17,60+Math.random()*35];return emergencyIntroBase();
};
const emergencyUpdateBase=update;
update=function(dt){
 emergencyUpdateBase(dt);
 if(playerDead||timeExpired||stageClear.active||stageClear.finished||continueCue.active){if(emergencyAmbienceSource||!emergencyAmbienceClip.paused)stopEmergencyAmbience();return}
 if(introPhase!=='done'||comparisonMode||window.gameAudioSettings?.isOpen||document.hidden)return;
 emergencyAmbienceElapsed+=dt/60;
 if(emergencyAmbienceIndex<2&&emergencyAmbienceElapsed>=emergencyAmbienceTimes[emergencyAmbienceIndex]){emergencyAmbienceIndex++;playEmergencyAmbience()}
};
