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
        $("#search").val(q);
    } else {
        q = 'fukuoku9000';
    }

    $.getJSON(baseUrl + '/Me/search/query', {type:'link', q:q + '*', 'limit':10, 'sort':'true'}, function(data) {
        $("#loading-links").fadeOut('fast');
        if(!data || !data.length) return $("#links").append("No results");
        var html = "";
        for(var i in data)
        {

            var wing = 100;
            var rx = new RegExp("(.{0,"+wing+"})("+q+")(.{0,"+wing+"})","i");
            var match = data[i].data.hasOwnProperty('text') ? data[i].data.text.match(rx) : '';
            var summary = "";

            if (data[i].data.hasOwnProperty('text')) {
                if(!match || match.length <= 1)
                {
                    summary = data[i].data.hasOwnProperty('text') ? data[i].data.text.substr(0,(wing*2))+"…" : '';
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
        $("#links").append(html);
    });
    $.getJSON(baseUrl + '/Me/search/query', {type:'photo', q:q + '*', 'limit':10}, function(data) {
        $("#loading-photos").fadeOut('fast');
        if(!data || !data.length) return $("#photos").append("No results");
        var html = "";
        for(var i in data)
        {
            html += "<img class='photo' title='" + data[i].data.title + "' src='"+data[i].data.url+"' width=80> ";
        }
        $("#photos").append(html);
    });
    $.getJSON(baseUrl + '/Me/search/query', {type:'contact', q:q + '*', 'limit':10}, function(data) {
        $("#loading-people").fadeOut('fast');
        if(!data || !data.length) return $("#people").append("No results");
        var html = "";
        for(var i in data)
        {
            if(data[i].data.photos && data[i].data.photos.length > 0)
            html += "<img class='photo' title='" + data[i].data.name + "' src='"+data[i].data.photos[0]+"' width=80> ";
        }
        $("#people").append(html);
    });
    $.getJSON(baseUrl + '/Me/search/query', {type:'place', q:q + '*', 'limit':10}, function(data) {
        $("#loading-places").fadeOut('fast');
        if(!data || !data.length) return $("#places").append("No results");
        var html = "";
        for(var i in data)
        {
            html += "<img class='photo' title='" + data[i].data.title + "' src='http://cbk0.google.com/cbk?output=thumbnail&w=90&h=68&ll="+data[i].data.lat+','+data[i].data.lng+"'>";
        }
        $("#places").append(html);
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
