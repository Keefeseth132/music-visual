$(document).ready(function () {

// 4 variables below connect to the Web Audio API.
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  var currentlyPlaying = null;

  $('#songSelection').on('change', function(){
    if(currentlyPlaying === null){
      elementSources[$(this).val()].play()
      currentlyPlaying = elementSources[$(this).val()]
    }
    else{
      currentlyPlaying.pause()
      elementSources[$(this).val()].play()
      currentlyPlaying = elementSources[$(this).val()]
    }
  })

  $('#stop').on('click', function(){
    currentlyPlaying.pause()
    currentlyPlaying = null
  })

  var elementSources = {
     audioElement1 : document.getElementById('audioElement1'),
     audioElement2 : document.getElementById('audioElement2'),
     audioElement3 : document.getElementById('audioElement3'),
     audioElement4 : document.getElementById('audioElement4'),
     audioElement5 : document.getElementById('audioElement5')}

  var sources = { 
     audioSrc1 : audioCtx.createMediaElementSource(audioElement1),
     audioSrc2 : audioCtx.createMediaElementSource(audioElement2),
     audioSrc3 : audioCtx.createMediaElementSource(audioElement3),
     audioSrc4 : audioCtx.createMediaElementSource(audioElement4),
     audioSrc5 : audioCtx.createMediaElementSource(audioElement5)}
     analyser = audioCtx.createAnalyser();

    // Bind our analyser to the media element source.???
    sources.audioSrc1.connect(analyser);
    sources.audioSrc2.connect(analyser);
    sources.audioSrc3.connect(analyser);
    sources.audioSrc4.connect(analyser);
    sources.audioSrc5.connect(analyser);
    analyser.connect(audioCtx.destination);

  //var frequencyData = new Uint8Array(analyser.frequencyBinCount);
  var frequencyData = new Uint8Array(750); // Uint8Array is array of 8bit integers & param is number of bars. Has a threshold.

  var svgHeight = '350'; // there is a bug, quotes denote pixle count
  var svgWidth = '1930';
  var barPadding = '1';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  var svg = createSvg('body', svgHeight, svgWidth);

  // Create our initial D3 chart.
  svg.selectAll('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('width', svgWidth / frequencyData.length - barPadding);



// function below. takes freq data and updates chart making it look like its oscillating. 'd' could be location in frequency data. 


  // Continuously loop and update chart with frequency data.
  function renderChart() {
     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getByteFrequencyData(frequencyData);

     // Update d3 chart with new data.
     svg.selectAll('rect')
        .data(frequencyData)
        .attr('y', function(d) {
           return svgHeight - d;
        })
        .attr('height', function(d) {
           return d;
        })
        .attr('fill', function(d) {
           return 'rgb(' + d + ', 60 , 115)';
        });
  }

  // Run the loop
  renderChart();
});
