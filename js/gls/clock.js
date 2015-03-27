GLS.ClockCalender = function ClockCalender(_svgContainer, _width, _height) {

  console.log("constructor Clock Calender");
  var svgContainer=_svgContainer;
  var svg, gClockCalender, arcClock;
  
  var pSvg;

  var donutType=true;
  var radius, arcWidth;
  var scale;
  var rOffset=0;


  var offsetRad=( (7*24*60*60*1000)/fullMillisDay)*(2*Math.PI);
  offsetRad=0;

  var innited=false;

  var colorScheme="Oranges";



  var timeData=[
    {type:"month", value:2, startAngle:0, endAngle:0, radius:0, max:12},
    {type:"day", value:25, startAngle:0, endAngle:0, radius:0, max:31},
    {type:"hours", value:12, startAngle:0, endAngle:0, radius:0, max:24},
    {type:"minutes", value:30, startAngle:0, endAngle:0, radius:0, max:60},
    {type:"seconds", value:30, startAngle:0, endAngle:0, radius:0, max:60}
  ];

  var dateNow=new Date();



  var arc = d3.svg.arc()
      .outerRadius( function(d){
        return d.radius + (arcWidth/2) - 2;
      })
      .innerRadius( function(d){
        return d.radius - (arcWidth/2) + 2 ;
      })
      .startAngle(function(d, i){return d.startAngle;})
      .endAngle(function(d, i){return d.endAngle;})


  initClockCalender();

  function initClockCalender(){


    console.log("init vis")

    pSvg = calcDivDimensions(_svgContainer);
    pSvg.middleX=pSvg.w/2;
    pSvg.middleY=pSvg.h/2;

    radius=(pSvg.h/2)-64;

    scale=1;
    arcWidth=32*scale;
    

    svg = d3.select("#svg-container").append("svg")
        // .attr("width", width)
        // .attr("height", height)
    
    gLegenda=svg.append("g")
        .attr("id", "glegenda")
        .attr("width", pSvg.w)
        .attr("height", 100)
        
    
    gClockCalender=svg.append("g")
        .attr("id", "gClockCalender")
        .attr("width", pSvg.h)
        .attr("height", pSvg.h)
        .attr("transform", "translate(" + (pSvg.middleX) + "," + pSvg.middleY + ")");

    // gClockCalender.append("circle")
    //     .attr("r", 32)
    //     .style("fill", "#ff0000")


    
    
    setDataSet();

    
  }

  function setDataSet(){

    timeData.forEach(function(d,i){

      d.value=updateValues(d);
      d.radius=arcWidth+(i*arcWidth);
      d.endAngle=0;

    });

    
    setDomainsAssets();
    setClock();
    

  }

  function updateValues(d){
    dateNow=new Date();

    var value=0;
    if(d.type=="am_pm"){
        value="am";
        if(dateNow.getHours()>12){
          value="pm";
        }

    }else if(d.type=="month"){
      value=dateNow.getMonth();
    }else if(d.type=="day"){
      value=dateNow.getDate();
    }else if(d.type=="hours"){
      value=dateNow.getHours();
    }else if(d.type=="minutes"){
      value=dateNow.getMinutes();
    }else if(d.type=="seconds"){
      value=dateNow.getSeconds();
    }

    return value;

  }

  function getAngle(_value, _max){

    var angle;
    if(_max==false){
      angle=2*Math.PI;
    } else {
      angle =( _value  / _max )*(2*Math.PI)+offsetRad;
    }

    return angle;

  }

  function setDomainsAssets(){


    var arcAssets = gClockCalender.selectAll(".arc-domains-circles").data(timeData);

    arcAssets.enter().append("circle")
        .attr("class", "arc-domains-circles")
        .attr("r", function(d, i){
          return arcWidth+(i*arcWidth);
        })
        .style("fill", "none")
        .style("stroke", function(d,i){
          d.color=colorbrewer[colorScheme][9][i];
          return d.color;
        })
        .style("stroke-width", 0.25)
        .each(function(d){
            
            var _data=[];
            for(var i=0; i<d.max; i++){
              _data.push( (i/d.max)*(Math.PI*2) );
            }


            var dots=gClockCalender.selectAll(".dots-color-"+d.type).data(_data);

            dots.enter().append("circle")
              .attr("class", "dots-color-"+d.type )
              .attr("r", function(k){
                return 0.75;
              })
              .attr("cx", function(k){
                return ( d.radius) * Math.cos(k);

              })
              .attr("cy", function(k){
                return ( d.radius) * Math.sin(k);

              })
              .style("fill", d.color)

        })

    arcAssets.exit().remove();


  }


  function setClock(){


    arcClock = gClockCalender.selectAll(".arc-clock").data(timeData);

    arcClock.enter().append("path")
        .attr("class", "arc-clock")
        .attr("id", function(d){
          return "arc-clock_"+d.type;
        })
        .attr("d", arc)
        .each(function(d){
            
            var _data=[];
            for(var i=0; i<d.max; i++){
              _data.push( (i/d.max)*(Math.PI*2) );
            }


            var dots=gClockCalender.selectAll(".dots-black-"+d.type).data(_data);

            dots.enter().append("circle")
              .attr("class", "dots-black-"+d.type )
              .attr("r", function(k){
                return 0.5;
              })
              .attr("cx", function(k){
                return ( d.radius) * Math.cos(k);

              })
              .attr("cy", function(k){
                return ( d.radius) * Math.sin(k);

              })
              .style("fill", "#000")

        })
        .style("fill", function(d,i){
          return colorbrewer[colorScheme][9][i];

        })

    arcClock.transition()
            .duration(1000)
            .call(arcTween);

    if(innited==false){
      setInterval(function() {
        arcClock.transition()
            .duration(1000)
            .call(arcTween);
        }, 1000);
      innited=true;

    }



  }

function arcTween(transition) {

  console.log("update timer")

  transition.attrTween("d", function(d) {
    
    d.value=updateValues(d);
    var newAngle=getAngle(d.value, d.max);
    var interpolateStart,interpolateEnd;
    // if(newAngle==0){
    //   interpolateStart = d3.interpolate(d.startAngle, Math.PI*2);
    //   interpolateEnd = d3.interpolate(d.endAngle, Math.PI*2);
    // }else{
    //   interpolateStart = d3.interpolate(d.startAngle, 0);
    //   interpolateEnd = d3.interpolate(d.endAngle, newAngle);
    // }

    if(newAngle==0){
      interpolateEnd = d3.interpolate(d.endAngle, (Math.PI*2) );

    }else{
      interpolateEnd = d3.interpolate(d.endAngle, newAngle);

    }
    //interpolateStart = d3.interpolate(d.startAngle, 0);
    //interpolateEnd = d3.interpolate(d.endAngle, newAngle);

    return function(t) {
      //d.startAngle = interpolateStart(t);
      d.endAngle = interpolateEnd(t);
      return arc(d);
    };
  });
}



}