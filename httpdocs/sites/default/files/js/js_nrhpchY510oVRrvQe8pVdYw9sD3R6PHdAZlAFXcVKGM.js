
(function ($) {
  Drupal.Panels = Drupal.Panels || {};

  Drupal.Panels.autoAttach = function() {
    if ($.browser.msie) {
      // If IE, attach a hover event so we can see our admin links.
      $("div.panel-pane").hover(
        function() {
          $('div.panel-hide', this).addClass("panel-hide-hover"); return true;
        },
        function() {
          $('div.panel-hide', this).removeClass("panel-hide-hover"); return true;
        }
      );
      $("div.admin-links").hover(
        function() {
          $(this).addClass("admin-links-hover"); return true;
        },
        function(){
          $(this).removeClass("admin-links-hover"); return true;
        }
      );
    }
  };

  $(Drupal.Panels.autoAttach);
})(jQuery);
;
/**
 * @file
 * Adds some show/hide to the admin form to make the UXP easier.
 */
(function($){
  Drupal.behaviors.video = {
    attach: function (context, settings) {
      //lets see if we have any jmedia movies
      if($.fn.media) {
        $('.jmedia').media();
      }
	
      if(settings.video) {
        $.fn.media.defaults.flvPlayer = settings.video.flvplayer;
      }
	
      //lets setup our colorbox videos
      $('.video-box').each(function() {
        var url = $(this).attr('href');
        var data = $(this).metadata();
        var width = data.width;
        var height= data.height;
        var player = settings.video.player; //player can be either jwplayer or flowplayer.
        $(this).colorbox({
          html: '<a id="video-overlay" href="'+url+'" style="height:'+height+'; width:'+width+'; display: block;"></a>',
          onComplete:function() {
            if(player == 'flowplayer') {
              flowplayer("video-overlay", settings.video.flvplayer, {
                clip: {
                  autoPlay: settings.video.autoplay,
                  autoBuffering: settings.video.autobuffer
                }
              });
            } else {
              $('#video-overlay').media({
                flashvars: {
                  autostart: settings.video.autoplay
                },
                width:width,
                height:height
              });
            }
          }
        });
      });
    }
  };
  
  Drupal.behaviors.videoEdit = function(context){
    // on change of the thumbnails when edit
    $(".video-thumbnails input").each(function() {
      var path = $(this).val();
      if($(this).is(':checked')) {
        var holder = $(this).attr('rel');
        var id = $(this).attr('id');
        var src = $('label[for="'+id+'"]').find('img').attr('src');
        $('.'+holder+' img').attr('src', src);
      }
    });
  }
})(jQuery);
;
// $Id: extlink.js,v 1.8 2010/05/26 01:25:56 quicksketch Exp $
(function ($) {

function extlinkAttach(context) {
  // Strip the host name down, removing ports, subdomains, or www.
  var pattern = /^(([^\/:]+?\.)*)([^\.:]{4,})((\.[a-z]{1,4})*)(:[0-9]{1,5})?$/;
  var host = window.location.host.replace(pattern, '$3$4');
  var subdomain = window.location.host.replace(pattern, '$1');

  // Determine what subdomains are considered internal.
  if (Drupal.settings.extlink.extSubdomains) {
    var subdomains = "([^/]*\\.)?";
  }
  else if (subdomain == 'www.' || subdomain == '') {
    var subdomains = "(www\\.)?";
  }
  else {
    var subdomains = subdomain.replace(".", "\\.");
  }

  // Build regular expressions that define an internal link.
  var internal_link = new RegExp("^https?://" + subdomains + host, "i");

  // Extra internal link matching.
  var extInclude = false;
  if (Drupal.settings.extlink.extInclude) {
    extInclude = new RegExp(Drupal.settings.extlink.extInclude.replace(/\\/, '\\'));
  }

  // Extra external link matching.
  var extExclude = false;
  if (Drupal.settings.extlink.extExclude) {
    extExclude = new RegExp(Drupal.settings.extlink.extExclude.replace(/\\/, '\\'));
  }

  // Find all links which are NOT internal and begin with http (as opposed
  // to ftp://, javascript:, etc. other kinds of links.
  // When operating on the 'this' variable, the host has been appended to
  // all links by the browser, even local ones.
  // In jQuery 1.1 and higher, we'd use a filter method here, but it is not
  // available in jQuery 1.0 (Drupal 5 default).
  var external_links = new Array();
  var mailto_links = new Array();
  $("a:not(." + Drupal.settings.extlink.extClass + ", ." + Drupal.settings.extlink.mailtoClass + ")", context).each(function(el) {
    try {
      var url = this.href.toLowerCase();
      if (url.indexOf('http') == 0 && (!url.match(internal_link) || (extInclude && url.match(extInclude))) && !(extExclude && url.match(extExclude))) {
        external_links.push(this);
      }
      else if (url.indexOf('mailto:') == 0) {
        mailto_links.push(this);
      }
    }
    // IE7 throws errors often when dealing with irregular links, such as:
    // <a href="node/10"></a> Empty tags.
    // <a href="http://user:pass@example.com">example</a> User:pass syntax.
    catch(error) {
      return false;
    }
  });

  if (Drupal.settings.extlink.extClass) {
    // Apply the "ext" class to all links not containing images.
    if (parseFloat($().jquery) < 1.2) {
      $(external_links).not('[img]').addClass(Drupal.settings.extlink.extClass).each(function() { if ($(this).css('display') == 'inline') $(this).after('<span class=' + Drupal.settings.extlink.extClass + '></span>'); });
    }
    else {
      $(external_links).not($(external_links).find('img').parents('a')).addClass(Drupal.settings.extlink.extClass).each(function() { if ($(this).css('display') == 'inline') $(this).after('<span class=' + Drupal.settings.extlink.extClass + '></span>'); });
    }
  }

  if (Drupal.settings.extlink.mailtoClass) {
    // Apply the "mailto" class to all mailto links not containing images.
    if (parseFloat($().jquery) < 1.2) {
      $(mailto_links).not('[img]').addClass(Drupal.settings.extlink.mailtoClass).each(function() { if ($(this).css('display') == 'inline') $(this).after('<span class=' + Drupal.settings.extlink.mailtoClass + '></span>'); });
    }
    else {
      $(mailto_links).not($(mailto_links).find('img').parents('a')).addClass(Drupal.settings.extlink.mailtoClass).each(function() { if ($(this).css('display') == 'inline') $(this).after('<span class=' + Drupal.settings.extlink.mailtoClass + '></span>'); });
    }
  }

  if (Drupal.settings.extlink.extTarget) {
    // Apply the target attribute to all links.
    $(external_links).attr('target', Drupal.settings.extlink.extTarget);
  }

  if (Drupal.settings.extlink.extAlert) {
    // Add pop-up click-through dialog.
    $(external_links).click(function(e) {
     return confirm(Drupal.settings.extlink.extAlertText);
    });
  }

  // Work around for Internet Explorer box model problems.
  if (($.support && !($.support.boxModel === undefined) && !$.support.boxModel) || ($.browser.msie && parseInt($.browser.version) <= 7)) {
    $('span.ext, span.mailto').css('display', 'inline-block');
  }
}

Drupal.behaviors.extlink = {
  attach: function(context){
    extlinkAttach(context);
  }
}

})(jQuery);
;
(function ($) {

/**
 * Attaches double-click behavior to toggle full path of Krumo elements.
 */
Drupal.behaviors.devel = {
  attach: function (context, settings) {

    // Add hint to footnote
    $('.krumo-footnote .krumo-call').before('<img style="vertical-align: middle;" title="Click to expand. Double-click to show path." src="' + Drupal.settings.basePath + 'misc/help.png"/>');

    var krumo_name = [];
    var krumo_type = [];

    function krumo_traverse(el) {
      krumo_name.push($(el).html());
      krumo_type.push($(el).siblings('em').html().match(/\w*/)[0]);

      if ($(el).closest('.krumo-nest').length > 0) {
        krumo_traverse($(el).closest('.krumo-nest').prev().find('.krumo-name'));
      }
    }

    $('.krumo-child > div:first-child', context).dblclick(
      function(e) {
        if ($(this).find('> .krumo-php-path').length > 0) {
          // Remove path if shown.
          $(this).find('> .krumo-php-path').remove();
        }
        else {
          // Get elements.
          krumo_traverse($(this).find('> a.krumo-name'));

          // Create path.
          var krumo_path_string = '';
          for (var i = krumo_name.length - 1; i >= 0; --i) {
            // Start element.
            if ((krumo_name.length - 1) == i)
              krumo_path_string += '$' + krumo_name[i];

            if (typeof krumo_name[(i-1)] !== 'undefined') {
              if (krumo_type[i] == 'Array') {
                krumo_path_string += "[";
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += krumo_name[(i-1)];
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += "]";
              }
              if (krumo_type[i] == 'Object')
                krumo_path_string += '->' + krumo_name[(i-1)];
            }
          }
          $(this).append('<div class="krumo-php-path" style="font-family: Courier, monospace; font-weight: bold;">' + krumo_path_string + '</div>');

          // Reset arrays.
          krumo_name = [];
          krumo_type = [];
        }
      }
    );
  }
};

})(jQuery);
;
/* 
 * flowplayer.js 3.1.4. The Flowplayer API
 * 
 * Copyright 2009 Flowplayer Oy
 * 
 * This file is part of Flowplayer.
 * 
 * Flowplayer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Flowplayer is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Flowplayer.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * Date: 2009-02-25 21:24:29 +0000 (Wed, 25 Feb 2009)
 * Revision: 166 
 */
(function(){function g(o){console.log("$f.fireEvent",[].slice.call(o))}function k(q){if(!q||typeof q!="object"){return q}var o=new q.constructor();for(var p in q){if(q.hasOwnProperty(p)){o[p]=k(q[p])}}return o}function m(t,q){if(!t){return}var o,p=0,r=t.length;if(r===undefined){for(o in t){if(q.call(t[o],o,t[o])===false){break}}}else{for(var s=t[0];p<r&&q.call(s,p,s)!==false;s=t[++p]){}}return t}function c(o){return document.getElementById(o)}function i(q,p,o){if(typeof p!="object"){return q}if(q&&p){m(p,function(r,s){if(!o||typeof s!="function"){q[r]=s}})}return q}function n(s){var q=s.indexOf(".");if(q!=-1){var p=s.substring(0,q)||"*";var o=s.substring(q+1,s.length);var r=[];m(document.getElementsByTagName(p),function(){if(this.className&&this.className.indexOf(o)!=-1){r.push(this)}});return r}}function f(o){o=o||window.event;if(o.preventDefault){o.stopPropagation();o.preventDefault()}else{o.returnValue=false;o.cancelBubble=true}return false}function j(q,o,p){q[o]=q[o]||[];q[o].push(p)}function e(){return"_"+(""+Math.random()).substring(2,10)}var h=function(t,r,s){var q=this;var p={};var u={};q.index=r;if(typeof t=="string"){t={url:t}}i(this,t,true);m(("Begin*,Start,Pause*,Resume*,Seek*,Stop*,Finish*,LastSecond,Update,BufferFull,BufferEmpty,BufferStop").split(","),function(){var v="on"+this;if(v.indexOf("*")!=-1){v=v.substring(0,v.length-1);var w="onBefore"+v.substring(2);q[w]=function(x){j(u,w,x);return q}}q[v]=function(x){j(u,v,x);return q};if(r==-1){if(q[w]){s[w]=q[w]}if(q[v]){s[v]=q[v]}}});i(this,{onCuepoint:function(x,w){if(arguments.length==1){p.embedded=[null,x];return q}if(typeof x=="number"){x=[x]}var v=e();p[v]=[x,w];if(s.isLoaded()){s._api().fp_addCuepoints(x,r,v)}return q},update:function(w){i(q,w);if(s.isLoaded()){s._api().fp_updateClip(w,r)}var v=s.getConfig();var x=(r==-1)?v.clip:v.playlist[r];i(x,w,true)},_fireEvent:function(v,y,w,A){if(v=="onLoad"){m(p,function(B,C){if(C[0]){s._api().fp_addCuepoints(C[0],r,B)}});return false}A=A||q;if(v=="onCuepoint"){var z=p[y];if(z){return z[1].call(s,A,w)}}if(y&&"onBeforeBegin,onMetaData,onStart,onUpdate,onResume".indexOf(v)!=-1){i(A,y);if(y.metaData){if(!A.duration){A.duration=y.metaData.duration}else{A.fullDuration=y.metaData.duration}}}var x=true;m(u[v],function(){x=this.call(s,A,y,w)});return x}});if(t.onCuepoint){var o=t.onCuepoint;q.onCuepoint.apply(q,typeof o=="function"?[o]:o);delete t.onCuepoint}m(t,function(v,w){if(typeof w=="function"){j(u,v,w);delete t[v]}});if(r==-1){s.onCuepoint=this.onCuepoint}};var l=function(p,r,q,t){var s={};var o=this;var u=false;if(t){i(s,t)}m(r,function(v,w){if(typeof w=="function"){s[v]=w;delete r[v]}});i(this,{animate:function(y,z,x){if(!y){return o}if(typeof z=="function"){x=z;z=500}if(typeof y=="string"){var w=y;y={};y[w]=z;z=500}if(x){var v=e();s[v]=x}if(z===undefined){z=500}r=q._api().fp_animate(p,y,z,v);return o},css:function(w,x){if(x!==undefined){var v={};v[w]=x;w=v}r=q._api().fp_css(p,w);i(o,r);return o},show:function(){this.display="block";q._api().fp_showPlugin(p);return o},hide:function(){this.display="none";q._api().fp_hidePlugin(p);return o},toggle:function(){this.display=q._api().fp_togglePlugin(p);return o},fadeTo:function(y,x,w){if(typeof x=="function"){w=x;x=500}if(w){var v=e();s[v]=w}this.display=q._api().fp_fadeTo(p,y,x,v);this.opacity=y;return o},fadeIn:function(w,v){return o.fadeTo(1,w,v)},fadeOut:function(w,v){return o.fadeTo(0,w,v)},getName:function(){return p},getPlayer:function(){return q},_fireEvent:function(w,v,x){if(w=="onUpdate"){var y=q._api().fp_getPlugin(p);if(!y){return}i(o,y);delete o.methods;if(!u){m(y.methods,function(){var A=""+this;o[A]=function(){var B=[].slice.call(arguments);var C=q._api().fp_invoke(p,A,B);return C==="undefined"||C===undefined?o:C}});u=true}}var z=s[w];if(z){z.apply(o,v);if(w.substring(0,1)=="_"){delete s[w]}}}})};function b(o,t,z){var E=this,y=null,x,u,p=[],s={},B={},r,v,w,D,A,q;i(E,{id:function(){return r},isLoaded:function(){return(y!==null)},getParent:function(){return o},hide:function(F){if(F){o.style.height="0px"}if(y){y.style.height="0px"}return E},show:function(){o.style.height=q+"px";if(y){y.style.height=A+"px"}return E},isHidden:function(){return y&&parseInt(y.style.height,10)===0},load:function(F){if(!y&&E._fireEvent("onBeforeLoad")!==false){m(a,function(){this.unload()});x=o.innerHTML;if(x&&!flashembed.isSupported(t.version)){o.innerHTML=""}flashembed(o,t,{config:z});if(F){F.cached=true;j(B,"onLoad",F)}}return E},unload:function(){if(x.replace(/\s/g,"")!==""){if(E._fireEvent("onBeforeUnload")===false){return E}try{if(y){y.fp_close();E._fireEvent("onUnload")}}catch(F){}y=null;o.innerHTML=x}return E},getClip:function(F){if(F===undefined){F=D}return p[F]},getCommonClip:function(){return u},getPlaylist:function(){return p},getPlugin:function(F){var H=s[F];if(!H&&E.isLoaded()){var G=E._api().fp_getPlugin(F);if(G){H=new l(F,G,E);s[F]=H}}return H},getScreen:function(){return E.getPlugin("screen")},getControls:function(){return E.getPlugin("controls")},getConfig:function(F){return F?k(z):z},getFlashParams:function(){return t},loadPlugin:function(I,H,K,J){if(typeof K=="function"){J=K;K={}}var G=J?e():"_";E._api().fp_loadPlugin(I,H,K,G);var F={};F[G]=J;var L=new l(I,null,E,F);s[I]=L;return L},getState:function(){return y?y.fp_getState():-1},play:function(G,F){function H(){if(G!==undefined){E._api().fp_play(G,F)}else{E._api().fp_play()}}if(y){H()}else{E.load(function(){H()})}return E},getVersion:function(){var G="flowplayer.js 3.1.4";if(y){var F=y.fp_getVersion();F.push(G);return F}return G},_api:function(){if(!y){throw"Flowplayer "+E.id()+" not loaded when calling an API method"}return y},setClip:function(F){E.setPlaylist([F]);return E},getIndex:function(){return w}});m(("Click*,Load*,Unload*,Keypress*,Volume*,Mute*,Unmute*,PlaylistReplace,ClipAdd,Fullscreen*,FullscreenExit,Error,MouseOver,MouseOut").split(","),function(){var F="on"+this;if(F.indexOf("*")!=-1){F=F.substring(0,F.length-1);var G="onBefore"+F.substring(2);E[G]=function(H){j(B,G,H);return E}}E[F]=function(H){j(B,F,H);return E}});m(("pause,resume,mute,unmute,stop,toggle,seek,getStatus,getVolume,setVolume,getTime,isPaused,isPlaying,startBuffering,stopBuffering,isFullscreen,toggleFullscreen,reset,close,setPlaylist,addClip,playFeed").split(","),function(){var F=this;E[F]=function(H,G){if(!y){return E}var I=null;if(H!==undefined&&G!==undefined){I=y["fp_"+F](H,G)}else{I=(H===undefined)?y["fp_"+F]():y["fp_"+F](H)}return I==="undefined"||I===undefined?E:I}});E._fireEvent=function(O){if(typeof O=="string"){O=[O]}var P=O[0],M=O[1],K=O[2],J=O[3],I=0;if(z.debug){g(O)}if(!y&&P=="onLoad"&&M=="player"){y=y||c(v);A=y.clientHeight;m(p,function(){this._fireEvent("onLoad")});m(s,function(Q,R){R._fireEvent("onUpdate")});u._fireEvent("onLoad")}if(P=="onLoad"&&M!="player"){return}if(P=="onError"){if(typeof M=="string"||(typeof M=="number"&&typeof K=="number")){M=K;K=J}}if(P=="onContextMenu"){m(z.contextMenu[M],function(Q,R){R.call(E)});return}if(P=="onPluginEvent"){var F=M.name||M;var G=s[F];if(G){G._fireEvent("onUpdate",M);G._fireEvent(K,O.slice(3))}return}if(P=="onPlaylistReplace"){p=[];var L=0;m(M,function(){p.push(new h(this,L++,E))})}if(P=="onClipAdd"){if(M.isInStream){return}M=new h(M,K,E);p.splice(K,0,M);for(I=K+1;I<p.length;I++){p[I].index++}}var N=true;if(typeof M=="number"&&M<p.length){D=M;var H=p[M];if(H){N=H._fireEvent(P,K,J)}if(!H||N!==false){N=u._fireEvent(P,K,J,H)}}m(B[P],function(){N=this.call(E,M,K);if(this.cached){B[P].splice(I,1)}if(N===false){return false}I++});return N};function C(){if($f(o)){$f(o).getParent().innerHTML="";w=$f(o).getIndex();a[w]=E}else{a.push(E);w=a.length-1}q=parseInt(o.style.height,10)||o.clientHeight;if(typeof t=="string"){t={src:t}}r=o.id||"fp"+e();v=t.id||r+"_api";t.id=v;z.playerId=r;if(typeof z=="string"){z={clip:{url:z}}}if(typeof z.clip=="string"){z.clip={url:z.clip}}z.clip=z.clip||{};if(o.getAttribute("href",2)&&!z.clip.url){z.clip.url=o.getAttribute("href",2)}u=new h(z.clip,-1,E);z.playlist=z.playlist||[z.clip];var F=0;m(z.playlist,function(){var H=this;if(typeof H=="object"&&H.length){H={url:""+H}}m(z.clip,function(I,J){if(J!==undefined&&H[I]===undefined&&typeof J!="function"){H[I]=J}});z.playlist[F]=H;H=new h(H,F,E);p.push(H);F++});m(z,function(H,I){if(typeof I=="function"){if(u[H]){u[H](I)}else{j(B,H,I)}delete z[H]}});m(z.plugins,function(H,I){if(I){s[H]=new l(H,I,E)}});if(!z.plugins||z.plugins.controls===undefined){s.controls=new l("controls",null,E)}s.canvas=new l("canvas",null,E);t.bgcolor=t.bgcolor||"#000000";t.version=t.version||[9,0];t.expressInstall="http://www.flowplayer.org/swf/expressinstall.swf";function G(H){if(!E.isLoaded()&&E._fireEvent("onBeforeClick")!==false){E.load()}return f(H)}x=o.innerHTML;if(x.replace(/\s/g,"")!==""){if(o.addEventListener){o.addEventListener("click",G,false)}else{if(o.attachEvent){o.attachEvent("onclick",G)}}}else{if(o.addEventListener){o.addEventListener("click",f,false)}E.load()}}if(typeof o=="string"){flashembed.domReady(function(){var F=c(o);if(!F){throw"Flowplayer cannot access element: "+o}else{o=F;C()}})}else{C()}}var a=[];function d(o){this.length=o.length;this.each=function(p){m(o,p)};this.size=function(){return o.length}}window.flowplayer=window.$f=function(){var p=null;var o=arguments[0];if(!arguments.length){m(a,function(){if(this.isLoaded()){p=this;return false}});return p||a[0]}if(arguments.length==1){if(typeof o=="number"){return a[o]}else{if(o=="*"){return new d(a)}m(a,function(){if(this.id()==o.id||this.id()==o||this.getParent()==o){p=this;return false}});return p}}if(arguments.length>1){var r=arguments[1];var q=(arguments.length==3)?arguments[2]:{};if(typeof o=="string"){if(o.indexOf(".")!=-1){var t=[];m(n(o),function(){t.push(new b(this,k(r),k(q)))});return new d(t)}else{var s=c(o);return new b(s!==null?s:o,r,q)}}else{if(o){return new b(o,r,q)}}}return null};i(window.$f,{fireEvent:function(){var o=[].slice.call(arguments);var q=$f(o[0]);return q?q._fireEvent(o.slice(1)):null},addPlugin:function(o,p){b.prototype[o]=p;return $f},each:m,extend:i});if(typeof jQuery=="function"){jQuery.prototype.flowplayer=function(q,p){if(!arguments.length||typeof arguments[0]=="number"){var o=[];this.each(function(){var r=$f(this);if(r){o.push(r)}});return arguments.length?o[arguments[0]]:new d(o)}return this.each(function(){$f(this,k(q),p?k(p):{})})}}})();(function(){var e=typeof jQuery=="function";var i={width:"100%",height:"100%",allowfullscreen:true,allowscriptaccess:"always",quality:"high",version:null,onFail:null,expressInstall:null,w3c:false,cachebusting:false};if(e){jQuery.tools=jQuery.tools||{};jQuery.tools.flashembed={version:"1.0.4",conf:i}}function j(){if(c.done){return false}var l=document;if(l&&l.getElementsByTagName&&l.getElementById&&l.body){clearInterval(c.timer);c.timer=null;for(var k=0;k<c.ready.length;k++){c.ready[k].call()}c.ready=null;c.done=true}}var c=e?jQuery:function(k){if(c.done){return k()}if(c.timer){c.ready.push(k)}else{c.ready=[k];c.timer=setInterval(j,13)}};function f(l,k){if(k){for(key in k){if(k.hasOwnProperty(key)){l[key]=k[key]}}}return l}function g(k){switch(h(k)){case"string":k=k.replace(new RegExp('(["\\\\])',"g"),"\\$1");k=k.replace(/^\s?(\d+)%/,"$1pct");return'"'+k+'"';case"array":return"["+b(k,function(n){return g(n)}).join(",")+"]";case"function":return'"function()"';case"object":var l=[];for(var m in k){if(k.hasOwnProperty(m)){l.push('"'+m+'":'+g(k[m]))}}return"{"+l.join(",")+"}"}return String(k).replace(/\s/g," ").replace(/\'/g,'"')}function h(l){if(l===null||l===undefined){return false}var k=typeof l;return(k=="object"&&l.push)?"array":k}if(window.attachEvent){window.attachEvent("onbeforeunload",function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){}})}function b(k,n){var m=[];for(var l in k){if(k.hasOwnProperty(l)){m[l]=n(k[l])}}return m}function a(r,t){var q=f({},r);var s=document.all;var n='<object width="'+q.width+'" height="'+q.height+'"';if(s&&!q.id){q.id="_"+(""+Math.random()).substring(9)}if(q.id){n+=' id="'+q.id+'"'}if(q.cachebusting){q.src+=((q.src.indexOf("?")!=-1?"&":"?")+Math.random())}if(q.w3c||!s){n+=' data="'+q.src+'" type="application/x-shockwave-flash"'}else{n+=' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'}n+=">";if(q.w3c||s){n+='<param name="movie" value="'+q.src+'" />'}q.width=q.height=q.id=q.w3c=q.src=null;for(var l in q){if(q[l]!==null){n+='<param name="'+l+'" value="'+q[l]+'" />'}}var o="";if(t){for(var m in t){if(t[m]!==null){o+=m+"="+(typeof t[m]=="object"?g(t[m]):t[m])+"&"}}o=o.substring(0,o.length-1);n+='<param name="flashvars" value=\''+o+"' />"}n+="</object>";return n}function d(m,p,l){var k=flashembed.getVersion();f(this,{getContainer:function(){return m},getConf:function(){return p},getVersion:function(){return k},getFlashvars:function(){return l},getApi:function(){return m.firstChild},getHTML:function(){return a(p,l)}});var q=p.version;var r=p.expressInstall;var o=!q||flashembed.isSupported(q);if(o){p.onFail=p.version=p.expressInstall=null;m.innerHTML=a(p,l)}else{if(q&&r&&flashembed.isSupported([6,65])){f(p,{src:r});l={MMredirectURL:location.href,MMplayerType:"PlugIn",MMdoctitle:document.title};m.innerHTML=a(p,l)}else{if(m.innerHTML.replace(/\s/g,"")!==""){}else{m.innerHTML="<h2>Flash version "+q+" or greater is required</h2><h3>"+(k[0]>0?"Your version is "+k:"You have no flash plugin installed")+"</h3>"+(m.tagName=="A"?"<p>Click here to download latest version</p>":"<p>Download latest version from <a href='http://www.adobe.com/go/getflashplayer'>here</a></p>");if(m.tagName=="A"){m.onclick=function(){location.href="http://www.adobe.com/go/getflashplayer"}}}}}if(!o&&p.onFail){var n=p.onFail.call(this);if(typeof n=="string"){m.innerHTML=n}}if(document.all){window[p.id]=document.getElementById(p.id)}}window.flashembed=function(l,m,k){if(typeof l=="string"){var n=document.getElementById(l);if(n){l=n}else{c(function(){flashembed(l,m,k)});return}}if(!l){return}if(typeof m=="string"){m={src:m}}var o=f({},i);f(o,m);return new d(l,o,k)};f(window.flashembed,{getVersion:function(){var m=[0,0];if(navigator.plugins&&typeof navigator.plugins["Shockwave Flash"]=="object"){var l=navigator.plugins["Shockwave Flash"].description;if(typeof l!="undefined"){l=l.replace(/^.*\s+(\S+\s+\S+$)/,"$1");var n=parseInt(l.replace(/^(.*)\..*$/,"$1"),10);var r=/r/.test(l)?parseInt(l.replace(/^.*r(.*)$/,"$1"),10):0;m=[n,r]}}else{if(window.ActiveXObject){try{var p=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")}catch(q){try{p=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");m=[6,0];p.AllowScriptAccess="always"}catch(k){if(m[0]==6){return m}}try{p=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")}catch(o){}}if(typeof p=="object"){l=p.GetVariable("$version");if(typeof l!="undefined"){l=l.replace(/^\S+\s+(.*)$/,"$1").split(",");m=[parseInt(l[0],10),parseInt(l[2],10)]}}}}return m},isSupported:function(k){var m=flashembed.getVersion();var l=(m[0]>k[0])||(m[0]==k[0]&&m[1]>=k[1]);return l},domReady:c,asString:g,getHTML:a});if(e){jQuery.fn.flashembed=function(l,k){var m=null;this.each(function(){m=flashembed(this,l,k)});return l.api===false?this:m}}})();;

/**
 * @file
 * Provides the FlowPlayer Drupal behavior.
 */

/**
 * The FlowPlayer Drupal behavior that creates the set of FlowPlayer elements from settings.flowplayer.
 */
(function ($) {
  Drupal.behaviors.flowplayer = {
    attach: function(context, settings) {
      /**
       * Called when the Flowplayer is initialized.
       * Had to move from Drupal.behaviors.flowplayeradmin as this is different namespace
       */
      var flowplayerAdminInit = function () {
        var player = $f('flowplayer-preview');
        // Colour the text boxes their value color.
        $('#flowplayer-color input:text').each(function(index, object) {
          var target = $(object).attr('rel');
          var color = $(object).val();
          if (target && color) {
            player.getControls().css(target, color);
          }
        });

        // Controlbar button toggles
        var buttonToggles = $('#flowplayer-styling input:checkbox');
        buttonToggles.change(function() {
          var params = {};
          buttonToggles.each(function(index, object) {
            params[this.value] = this.checked;
          });
          player.getControls().widgets(params);
        });
        buttonToggles.change(); // Update the player to reflect the settings.

        // Border radius
        $('#edit-flowplayer-border-radius').change(function() {
          player.getControls().css("borderRadius", $(this).val());
        });
        $('#edit-flowplayer-border-radius').change();

        // Background gradient
        $("#edit-flowplayer-background-gradient").change(function() {
          player.getControls().css("backgroundGradient", $(this).val());
        });
        $("#edit-flowplayer-background-gradient").change();
      }
      // onload
      jQuery.each(settings.flowplayer, function(selector, config) {

        // Convert any player object events to JavaScript calls.
        var playerEvents = [
        'onBeforeClick',
        'onLoad',
        'onBeforeLoad',
        'onUnload',
        'onBeforeUnload',
        'onMouseOver',
        'onMouseOut',
        'onKeypress',
        'onBeforeKeypress',
        'onVolume',
        'onBeforeVolume',
        'onMute',
        'onBeforeMute',
        'onUnmute',
        'onBeforeUnmute',
        'onFullscreen',
        'onBeforeFullscreen',
        'onFullscreenExit',
        'onPlaylistReplace',
        'onError'
        ];
        jQuery.each(playerEvents, function(index, event) {
          if (typeof(config[event]) == 'string') {
            config[event] = eval(config[event]);
          }
        });

        // Convert any clip object events to JavaScript events.
        var clipEvents = [
        'onBegin',
        'onBeforeBegin',
        'onMetaData',
        'onStart',
        'onPause',
        'onBeforePause',
        'onResume',
        'onBeforeResume',
        'onSeek',
        'onBeforeSeek',
        'onStop',
        'onBeforeStop',
        'onFinish',
        'onBeforeFinish',
        'onLastSecond',
        'onUpdate'
        ];
        if (config['clip']) {
          jQuery.each(clipEvents, function(index, event) {
            if (typeof(config['clip'][event]) == 'string') {
              config['clip'][event] = eval(config['clip'][event]);
            }
          });
        }

        // Register the playlist clip events.
        if (config['playlist']) {
          jQuery.each(config['playlist'], function(index, clip) {
            jQuery.each(clipEvents, function(e_index, event) {
              if (typeof(config['playlist'][index][event]) == 'string') {
                config['playlist'][index][event] = eval(config['playlist'][index][event]);
              }
            });
          });
        }

        // Register the onCuepoint callback.
        if (config['clip'] && config['clip']['onCuepoint'] && typeof(config['clip']['onCuepoint'][1]) == 'string') {
          config['clip']['onCuepoint'][1] = eval(config['clip']['onCuepoint'][1]);
        }

        // Create the flowplayer element on the non-processed elements.
        $(selector + ':not(.flowplayer-processed)').addClass('flowplayer-processed').flowplayer(settings.basePath + settings.flowplayerSwf, config);
      });
    }
  };
})(jQuery);
;
