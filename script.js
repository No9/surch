//var baseUrl = "http://localhost:8042";
var baseUrl = '';

$(document).ready(function() {
    if(baseUrl === false) window.alert("Couldn't find your locker, you might need to add a config.js (see https://me.singly.com/Me/devdocs/)");
});

$(function() {
    
    $("#search").focus();
    
    var q = window.location.hash.substr(1);
    
    if (q) {
        $(".result").toggle();
    } else {
        q = 'fukuoku9000';
    }
    
    $.getJSON(baseUrl + '/Me/search/query', {type:'link', q:q + '*', 'limit':10, 'sort':'true'}, function(data) {
        if(!data || !data.length) return $("#links").html("no links");
        var html = "<h2>Links:</h2>";
        for(var i in data)
        {
            
            var wing = 100;
            var rx = new RegExp("(.{0,"+wing+"})("+q+")(.{0,"+wing+"})","i");
            var match = data.hasOwnProperty('text') ? data[i].data.text.match(rx) : '';
            var summary = "";
            if (data.hasOwnProperty('text')) {
                if(!match || match.length <= 1)
                {
                    summary = data.hasOwnProperty('text') ? data.text.substr(0,(wing*2))+"…" : '';
                }else{
                    summary = match[1]+"<b>"+match[2]+"</b>"+match[3];
                    if(match[1].length == wing) summary = "…"+summary;
                    if(match[3].length == wing) summary += "…";
                }
            }
            
            html += "<div>" +
                    "    <a target='_blank' href='"+data[i].data.link+"'>"+data[i].data.title+"</a>" +
                    "    <div class='desc'>" + summary + "</div>" +
                    "</div>";
        }
        $("#links").html(html);
    });
    $.getJSON(baseUrl + '/Me/search/query', {type:'photo', q:q + '*', 'limit':10}, function(data) {
        if(!data || !data.length) return $("#photos").html("");
        var html = "<h2>Photos:</h2>";
        for(var i in data)
        {
            html += "<img title='" + data[i].data.title + "' src='"+data[i].data.url+"' width=80> ";
        }
        $("#photos").html(html);
    });
    $.getJSON(baseUrl + '/Me/search/query', {type:'contact', q:q + '*', 'limit':10}, function(data) {
        if(!data || !data.length) return $("#people").html("");
        var html = "<h2>People:</h2>";
        for(var i in data)
        {
            if(data[i].data.photos && data[i].data.photos.length > 0)
            html += "<img title='" + data[i].data.name + "' src='"+data[i].data.photos[0]+"' width=80> ";
        }
        $("#people").html(html);
    });
    $.getJSON(baseUrl + '/Me/search/query', {type:'place', q:q + '*', 'limit':10}, function(data) {
        if(!data || !data.length) return $("#places").html("");
        var html = "<h2>Places:</h2>";
        for(var i in data)
        {
            html += "<img title='" + data[i].data.title + "' src='http://cbk0.google.com/cbk?output=thumbnail&w=90&h=68&ll="+data[i].data.lat+','+data[i].data.lng+"'>";
        }
        $("#places").html(html);
    });
    
    $("#searchform").submit(function(e) {
        e.preventDefault();
        searchIt();
        return false;
    });
    
    $(".searchbutton").click(function(e) {
        e.preventDefault();
        searchIt();
        return false;
    });
    
    var searchIt = function() {
        window.location = window.location.origin + window.location.pathname + '#' + $("#search").val();
        window.location.reload(true);
    }
});
