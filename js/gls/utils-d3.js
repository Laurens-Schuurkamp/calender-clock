function showToolTip(label) {
    // console.log(label);
    if (label == undefined || label == null) label = noDataLabel;

    toolTip.html(label);
    toolTip.transition()
        .duration(100)
        .style("opacity", 0.9);

    updateToolTipPosition(d3.event.pageX, d3.event.pageY);
}

function hideToolTip() {
    toolTip.transition()
        .duration(250)
        .style("opacity", 0);
}

function updateToolTipPosition(x, y) {
    var w=document.getElementById('toolTip').offsetWidth;
    var h=document.getElementById('toolTip').offsetHeight;
    var clientWidth = document.body.clientWidth;

    if (!document.getElementById("toolTipChild")) {
    d3.select("#toolTip").append("div")
        .attr("class", "tooltip-append")
        .attr("id", "toolTipChild")
        .style("opacity", 90);
    }
    
    var xPos = x - (w/2);
    var yPos = y - h - 16;
    
    if( xPos<0) {
        xPos=0;
        pointerX = Math.max(15, x)
        console.log( " pointerX:"+pointerX)
        d3.select("#toolTipChild").style("left", pointerX + "px");
    }
    
    if( xPos>clientWidth-w) {
        xPos=clientWidth-w;
        pointerX = Math.min(w-15, x-xPos)
        console.log( " pointerX:"+pointerX)
        d3.select("#toolTipChild").style("left", pointerX + "px");
    }    

    toolTip.style("left", xPos+"px")
    toolTip.style("top",  yPos+"px")
}

function convertUtcLong2Date(utcLong) {
    var startTimeStamp=new Date();
    startTimeStamp.setTime(utcLong+systemSettings.time_zone_offset-systemSettings.local_utc_offset);
    return startTimeStamp
}

function getEventTime(start, end){
    var time=( (end.getTime()-start.getTime())/1000 );
    return time;
}

function formatDuration(time, inMinutes){

    var duration=time; // in sec

    var milliseconds = Math.floor(duration%1000)/100;
    var seconds = Math.floor(duration/1000)%60;
    var minutes = Math.floor(duration/(1000*60))%60;
    var hours = Math.floor(duration/(1000*60*60));

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if(inMinutes){
        return hours + "h " + minutes+"m";
    }else{
        return hours + ":" + minutes + ":" + seconds;
    }
}

function formatDate(_date, _timeTicks){

    var dateLabel;

    if(_timeTicks=="weeks" ){
        // small date + date
        var formatDater=locale.timeFormat("%a %e")
        dateLabel=formatDater(_date)
    }else if(_timeTicks=="days"){
        // day small + data + month small + yaar
        var dayFormatter = locale.timeFormat("%A")
        dateLabel=dayFormatter(_date)+ " "+ shortDateFormat(_date)
    }else{
        // day long + date + month long + year
        var dayFormatter = locale.timeFormat("%A")
        dateLabel=dayFormatter(_date)+ " "+ longDateFormat(_date)
    }

    return dateLabel
}

function formatTime(_date){

    return shortTimeFormat(_date)
}

function checkDigits(value){

    return value < 10 ? '0' + value : value;
}

function sortArrayUp(array, param){

    if(param==null){
        array.sort(function(a, b) {
            return a - b;
        })

    }else{
        array.sort(function(a, b) {
            return a[param] - b[param];
        })
    }

    return true;
}

function sortArrayDown(array, param){

    if(param==null){
        array.sort(function(a, b) {
            return b - a;
        })

    }else{
        array.sort(function(a, b) {
            return a[param] - b[param];
        })
    }

    return true;
}

function filterArray(array, param){

    var filterdArray=[];

    array.filter( function(k){
        if (k.tag==param) {
            filterdArray.push(k);

            return true;
        }
    });

    return filterdArray;
}

function setNewDate(date, hours, minutes, seconds, milliseconds){
    if(date==null) date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
    date.setMilliseconds(milliseconds);

    return date;
}

function convertDateTime2Param(paramDate)
{
    return convertInt2String(paramDate.getFullYear(),4)+
            convertInt2String(paramDate.getMonth()+1,2)+
            convertInt2String(paramDate.getDate(),2)+
            convertInt2String(paramDate.getHours(),2)+
            convertInt2String(paramDate.getMinutes(),2);
}

function convertDate2Param(paramDate)
{
    return convertInt2String(paramDate.getFullYear(),4)+
            convertInt2String(paramDate.getMonth()+1,2)+
            convertInt2String(paramDate.getDate(),2);
}

function convertInt2String(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function setLabelValue(x, y, mouse, data) {

    var x0 = x.invert(mouse),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.startClientDayUTC > d1.startClientDayUTC - x0 ? d1 : d0;

    var entries = d3.entries(d.value);
    if (entries.length > 0) {

        entries.sort(function(b, a) {
            return d3.ascending(a["value"], b["value"])
        });
        entries.forEach(function(d) {
            label += d.key + ": " + d.value + "<br>"
        });
    }
}

function generateToolTipLabelWithDate(d)
{
    var label=formatDate(d.startTime);
    label += "<br>";
    label+=generateToolTipLabelBody(d);
    return label;
}

function generateToolTipLabelBody(d)
{
    var label=""
    if( d.description!=undefined ) {
        label += d.description;
        label += "<br>";
    }
    if(d.duration>1){
        label += localStrings['careview.clientDashboard.timeline.start'] + " "+formatTime(d.startTime)+" "+localStrings['careview.clientDashboard.timeline.end'] + " "+formatTime(d.endTime);
        label += "<br>";
        label += localStrings['careview.clientDashboard.duration']+" : "+formatDuration(d.duration);
    }else{
        label += localStrings['careview.clientDashboard.timeline.timestamp']+" : "+formatTime(d.startTime)
    }

    return label;
}

function getApiDateString(_date){
    
    var yyyy=_date.getFullYear();
    var mm=_date.getMonth()+1;
    var dd=_date.getDate();

    var dateString=yyyy+"-"+mm+"-"+dd;
    return dateString;

}

function calcDivDimensions(_svgContainer){
    var pSvg={};

    pSvg.w = _svgContainer[0].parentNode.clientWidth;
    pSvg.h = _svgContainer[0].parentNode.clientHeight;

    return pSvg;
   



}



