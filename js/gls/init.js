var GLS = GLS || {};


var dataRepository, clockCalender;
var fullMillisDay=24*60*60*1000;

var twTime=500;


var toolTip;
var language="en";

var en_US={
          "decimal": ".",
          "thousands": ",",
          "grouping": [3],
          "currency": ["$", ""],
          "dateTime": "%a %b %e %X %Y",
          "date": "%m/%d/%Y",
          "time": "%H:%M:%S",
          "periods": ["am", "pm"],
          "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          
        }

        var nl_NL={
          "decimal": ".",
          "thousands": ",",
          "grouping": [3],
          "currency": ["€", ""],
          "dateTime": "%a %b %e %X %Y",
          "date": "%d/%m/%Y",
          "time": "%H:%M:%S",
          "periods": ["am", "pm"],
          "days": ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"],
          "shortDays": ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
          "months": ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
          "shortMonths": ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
        }

        var ru_RU = {
            "decimal": ",",
            "thousands": "\xa0",
            "grouping": [3],
            "currency": ["", " руб."],
            "dateTime": "%A, %e %B %Y г. %X",
            "date": "%d.%m.%Y",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
            "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
            "months": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        }

        // Culture related definitions
        var locale, shortTimeFormat, longDateFormat, shortDateFormat;

        if(language=="en"){
            locale=d3.locale(en_US);
            shortTimeFormat=locale.timeFormat("%I:%M %p")
            longDateFormat=locale.timeFormat("%B %e %Y")
            shortDateFormat=locale.timeFormat("%b %e %Y")
        }else if(language=="nl"){
            locale=d3.locale(nl_NL);
            shortTimeFormat=locale.timeFormat("%H:%M");
            longDateFormat=locale.timeFormat("%e %B %Y")
            shortDateFormat=locale.timeFormat("%e %b %Y")
        }else{
            locale=d3.locale(ru_RU);
            shortTimeFormat=locale.timeFormat("%H:%M");
            longDateFormat=locale.timeFormat("%A %e %B %Y")
            shortDateFormat=locale.timeFormat("%a %e %b %Y")
        }


        var multiTimeFormatter=[
            ["%H:%M", function(d) { return d.getMinutes(); }],
            ["%H:%M", function(d) { return d.getHours(); }],
            ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
            ["%b %d", function(d) { return d.getDate() != 1; }],
            ["%B", function(d) { return d.getMonth(); }],
            ["%Y", function() { return true; }]
        ]

        var tickTimeFormat = locale.timeFormat.multi(multiTimeFormatter);



function init(){

  dataRepository=new GLS.DataRepository();

  var svgContainer=d3.select("#svg-container");
  clockCalender=new GLS.ClockCalender(svgContainer);


}



function createVisualisation(_userData){

  console.log("kick off visualisation :"+_userData.data);


}
