// Phase data lives here; shared combat and controls remain in the game modules.
(function(root){
 const phases={
  'pisos-rojos':{
   id:'pisos-rojos',title:'Los Pisos Rojos',worldWidth:5198,timeLimit:400,
   assets:{background:'assets/backgrounds/fase1-los-pisos-rojos-extended.png',map:'assets/ui/mapa-torreblanca-fase1-sin-trazo.png'},
   audio:{phase:'assets/audio/los-pisos-rojos-theme.wav?v=3',boss:'assets/audio/pelea-jefe-1.wav',victory:'assets/audio/fin-fase.wav?v=1'},
   boss:{name:'Boss',maxHp:300},
   waves:[
    {trigger:350,barrier:980,enemies:['yonki','yonkiTres','yonkiRojo']},
    {trigger:1050,barrier:1680,enemies:['yonkiTresNike','yonkiTresRubio','enemy']},
    {trigger:1750,barrier:2380,enemies:['kani2Enemy','yonkiTres']},
    {trigger:2450,barrier:3080,enemies:['yonkiRojo','heavyEnemy','yonkiTres','yonki']},
    {trigger:3150,barrier:3780,enemies:['yonkiTresNike','yonkiTresRubio']},
    {trigger:3850,barrier:4480,enemies:['kani2Enemy','yonkiTresNike','yonkiTresRubio','yonkiRojo']}
   ],
   scenery:{
    intro:{fenceMaxX:300,fenceScreenRatio:.30,carOffset:115,carWidth:336,barrelGap:130},
    lamps:[600,1500,1800,2400,3000,3600,4200,4800],
    heavyCar:{sourceX:2450,width:320,maxHp:140},
    wreck:{endOffset:200,sidewalkOffset:.075},
    barrelWall:{rightFraction:.94,backOffset:.12,buildingDrop:.075,rearOffset:.45,extraRearRows:[2,5],buildingOffsets:[3,1]}
   }
  }
 };
 function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value)}return value}
 function validate(phase){
  if(!(phase.worldWidth>0&&phase.timeLimit>0))throw Error('Invalid phase dimensions/time');
  let previous=-Infinity;
  for(const wave of phase.waves){if(wave.trigger<=previous||wave.barrier<wave.trigger||!wave.enemies.length)throw Error('Invalid phase wave');previous=wave.trigger}
 }
 Object.values(phases).forEach(validate);freeze(phases);
 const api={get(id){if(!phases[id])throw Error('Unknown phase: '+id);return phases[id]},resolveWaveActors(phase,actors){return phase.waves.map(wave=>wave.enemies.map(id=>{if(!actors[id])throw Error('Unknown enemy in phase: '+id);return actors[id]}))},ids:()=>Object.keys(phases)};
 root.TorreblancaPhases=Object.freeze(api);if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
