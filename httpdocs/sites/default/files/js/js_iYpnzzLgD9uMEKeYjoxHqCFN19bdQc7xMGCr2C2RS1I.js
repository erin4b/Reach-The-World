/*!
	jQuery ColorBox v1.4.6 - 2013-03-19
	(c) 2013 Jack Moore - jacklmoore.com/colorbox
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function(e,t,i){function o(i,o,n){var r=t.createElement(i);return o&&(r.id=et+o),n&&(r.style.cssText=n),e(r)}function n(){return i.innerHeight?i.innerHeight:e(i).height()}function r(e){var t=E.length,i=(j+e)%t;return 0>i?t+i:i}function h(e,t){return Math.round((/%/.test(e)?("x"===t?H.width():n())/100:1)*parseInt(e,10))}function s(e,t){return e.photo||e.photoRegex.test(t)}function l(e,t){return e.retinaUrl&&i.devicePixelRatio>1?t.replace(e.photoRegex,e.retinaSuffix):t}function a(e){"contains"in v[0]&&!v[0].contains(e.target)&&(e.stopPropagation(),v.focus())}function d(){var t,i=e.data(O,Z);null==i?(z=e.extend({},Y),console&&console.log&&console.log("Error: cboxElement missing settings object")):z=e.extend({},i);for(t in z)e.isFunction(z[t])&&"on"!==t.slice(0,2)&&(z[t]=z[t].call(O));z.rel=z.rel||O.rel||e(O).data("rel")||"nofollow",z.href=z.href||e(O).attr("href"),z.title=z.title||O.title,"string"==typeof z.href&&(z.href=e.trim(z.href))}function c(i,o){e(t).trigger(i),ct.trigger(i),e.isFunction(o)&&o.call(O)}function u(){var e,t,i,o,n,r=et+"Slideshow_",h="click."+et;z.slideshow&&E[1]?(t=function(){clearTimeout(e)},i=function(){(z.loop||E[j+1])&&(e=setTimeout(X.next,z.slideshowSpeed))},o=function(){F.html(z.slideshowStop).unbind(h).one(h,n),ct.bind(nt,i).bind(ot,t).bind(rt,n),v.removeClass(r+"off").addClass(r+"on")},n=function(){t(),ct.unbind(nt,i).unbind(ot,t).unbind(rt,n),F.html(z.slideshowStart).unbind(h).one(h,function(){X.next(),o()}),v.removeClass(r+"on").addClass(r+"off")},z.slideshowAuto?o():n()):v.removeClass(r+"off "+r+"on")}function f(i){G||(O=i,d(),E=e(O),j=0,"nofollow"!==z.rel&&(E=e("."+tt).filter(function(){var t,i=e.data(this,Z);return i&&(t=e(this).data("rel")||i.rel||this.rel),t===z.rel}),j=E.index(O),-1===j&&(E=E.add(O),j=E.length-1)),g.css({opacity:parseFloat(z.opacity),cursor:z.overlayClose?"pointer":"auto",visibility:"visible"}).show(),J&&v.add(g).removeClass(J),z.className&&v.add(g).addClass(z.className),J=z.className,K.html(z.close).show(),U||(U=$=!0,v.css({visibility:"hidden",display:"block"}),I=o(ut,"LoadedContent","width:0; height:0; overflow:hidden").appendTo(y),D=b.height()+k.height()+y.outerHeight(!0)-y.height(),B=C.width()+T.width()+y.outerWidth(!0)-y.width(),N=I.outerHeight(!0),A=I.outerWidth(!0),z.w=h(z.initialWidth,"x"),z.h=h(z.initialHeight,"y"),X.position(),at&&H.bind("resize."+dt+" scroll."+dt,function(){g.css({width:H.width(),height:n(),top:H.scrollTop(),left:H.scrollLeft()})}).trigger("resize."+dt),u(),c(it,z.onOpen),_.add(M).hide(),v.focus(),t.addEventListener&&(t.addEventListener("focus",a,!0),ct.one(ht,function(){t.removeEventListener("focus",a,!0)})),z.returnFocus&&ct.one(ht,function(){e(O).focus()})),w())}function p(){!v&&t.body&&(V=!1,H=e(i),v=o(ut).attr({id:Z,"class":lt?et+(at?"IE6":"IE"):"",role:"dialog",tabindex:"-1"}).hide(),g=o(ut,"Overlay",at?"position:absolute":"").hide(),W=o(ut,"LoadingOverlay").add(o(ut,"LoadingGraphic")),x=o(ut,"Wrapper"),y=o(ut,"Content").append(M=o(ut,"Title"),S=o(ut,"Current"),P=o("button","Previous"),R=o("button","Next"),F=o("button","Slideshow"),W,K=o("button","Close")),x.append(o(ut).append(o(ut,"TopLeft"),b=o(ut,"TopCenter"),o(ut,"TopRight")),o(ut,!1,"clear:left").append(C=o(ut,"MiddleLeft"),y,T=o(ut,"MiddleRight")),o(ut,!1,"clear:left").append(o(ut,"BottomLeft"),k=o(ut,"BottomCenter"),o(ut,"BottomRight"))).find("div div").css({"float":"left"}),L=o(ut,!1,"position:absolute; width:9999px; visibility:hidden; display:none"),_=R.add(P).add(S).add(F),e(t.body).append(g,v.append(x,L)))}function m(){function i(e){e.which>1||e.shiftKey||e.altKey||e.metaKey||(e.preventDefault(),f(this))}return v?(V||(V=!0,R.click(function(){X.next()}),P.click(function(){X.prev()}),K.click(function(){X.close()}),g.click(function(){z.overlayClose&&X.close()}),e(t).bind("keydown."+et,function(e){var t=e.keyCode;U&&z.escKey&&27===t&&(e.preventDefault(),X.close()),U&&z.arrowKey&&E[1]&&!e.altKey&&(37===t?(e.preventDefault(),P.click()):39===t&&(e.preventDefault(),R.click()))}),e.isFunction(e.fn.on)?e(t).on("click."+et,"."+tt,i):e("."+tt).live("click."+et,i)),!0):!1}function w(){var t,n,r,a=X.prep,u=++ft;$=!0,q=!1,O=E[j],d(),c(st),c(ot,z.onLoad),z.h=z.height?h(z.height,"y")-N-D:z.innerHeight&&h(z.innerHeight,"y"),z.w=z.width?h(z.width,"x")-A-B:z.innerWidth&&h(z.innerWidth,"x"),z.mw=z.w,z.mh=z.h,z.maxWidth&&(z.mw=h(z.maxWidth,"x")-A-B,z.mw=z.w&&z.w<z.mw?z.w:z.mw),z.maxHeight&&(z.mh=h(z.maxHeight,"y")-N-D,z.mh=z.h&&z.h<z.mh?z.h:z.mh),t=z.href,Q=setTimeout(function(){W.show()},100),z.inline?(r=o(ut).hide().insertBefore(e(t)[0]),ct.one(st,function(){r.replaceWith(I.children())}),a(e(t))):z.iframe?a(" "):z.html?a(z.html):s(z,t)?(t=l(z,t),e(q=new Image).addClass(et+"Photo").bind("error",function(){z.title=!1,a(o(ut,"Error").html(z.imgError))}).one("load",function(){var e;u===ft&&(z.retinaImage&&i.devicePixelRatio>1&&(q.height=q.height/i.devicePixelRatio,q.width=q.width/i.devicePixelRatio),z.scalePhotos&&(n=function(){q.height-=q.height*e,q.width-=q.width*e},z.mw&&q.width>z.mw&&(e=(q.width-z.mw)/q.width,n()),z.mh&&q.height>z.mh&&(e=(q.height-z.mh)/q.height,n())),z.h&&(q.style.marginTop=Math.max(z.mh-q.height,0)/2+"px"),E[1]&&(z.loop||E[j+1])&&(q.style.cursor="pointer",q.onclick=function(){X.next()}),lt&&(q.style.msInterpolationMode="bicubic"),setTimeout(function(){a(q)},1))}),setTimeout(function(){q.src=t},1)):t&&L.load(t,z.data,function(t,i){u===ft&&a("error"===i?o(ut,"Error").html(z.xhrError):e(this).contents())})}var g,v,x,y,b,C,T,k,E,H,I,L,W,M,S,F,R,P,K,_,z,D,B,N,A,O,j,q,U,$,G,Q,X,J,V,Y={transition:"elastic",speed:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,inline:!1,html:!1,iframe:!1,fastIframe:!0,photo:!1,href:!1,title:!1,rel:!1,opacity:.9,preloading:!0,className:!1,retinaImage:!1,retinaUrl:!1,retinaSuffix:"@2x.$1",current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",open:!1,returnFocus:!0,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",photoRegex:/\.(gif|png|jp(e|g|eg)|bmp|ico)((#|\?).*)?$/i,onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:void 0},Z="colorbox",et="cbox",tt=et+"Element",it=et+"_open",ot=et+"_load",nt=et+"_complete",rt=et+"_cleanup",ht=et+"_closed",st=et+"_purge",lt=!e.support.leadingWhitespace,at=lt&&!i.XMLHttpRequest,dt=et+"_IE6",ct=e("<a/>"),ut="div",ft=0;e.colorbox||(e(p),X=e.fn[Z]=e[Z]=function(t,i){var o=this;if(t=t||{},p(),m()){if(e.isFunction(o))o=e("<a/>"),t.open=!0;else if(!o[0])return o;i&&(t.onComplete=i),o.each(function(){e.data(this,Z,e.extend({},e.data(this,Z)||Y,t))}).addClass(tt),(e.isFunction(t.open)&&t.open.call(o)||t.open)&&f(o[0])}return o},X.position=function(e,t){function i(e){b[0].style.width=k[0].style.width=y[0].style.width=parseInt(e.style.width,10)-B+"px",y[0].style.height=C[0].style.height=T[0].style.height=parseInt(e.style.height,10)-D+"px"}var o,r,s,l=0,a=0,d=v.offset();H.unbind("resize."+et),v.css({top:-9e4,left:-9e4}),r=H.scrollTop(),s=H.scrollLeft(),z.fixed&&!at?(d.top-=r,d.left-=s,v.css({position:"fixed"})):(l=r,a=s,v.css({position:"absolute"})),a+=z.right!==!1?Math.max(H.width()-z.w-A-B-h(z.right,"x"),0):z.left!==!1?h(z.left,"x"):Math.round(Math.max(H.width()-z.w-A-B,0)/2),l+=z.bottom!==!1?Math.max(n()-z.h-N-D-h(z.bottom,"y"),0):z.top!==!1?h(z.top,"y"):Math.round(Math.max(n()-z.h-N-D,0)/2),v.css({top:d.top,left:d.left,visibility:"visible"}),e=v.width()===z.w+A&&v.height()===z.h+N?0:e||0,x[0].style.width=x[0].style.height="9999px",o={width:z.w+A+B,height:z.h+N+D,top:l,left:a},0===e&&v.css(o),v.dequeue().animate(o,{duration:e,complete:function(){i(this),$=!1,x[0].style.width=z.w+A+B+"px",x[0].style.height=z.h+N+D+"px",z.reposition&&setTimeout(function(){H.bind("resize."+et,X.position)},1),t&&t()},step:function(){i(this)}})},X.resize=function(e){U&&(e=e||{},e.width&&(z.w=h(e.width,"x")-A-B),e.innerWidth&&(z.w=h(e.innerWidth,"x")),I.css({width:z.w}),e.height&&(z.h=h(e.height,"y")-N-D),e.innerHeight&&(z.h=h(e.innerHeight,"y")),e.innerHeight||e.height||(I.css({height:"auto"}),z.h=I.height()),I.css({height:z.h}),X.position("none"===z.transition?0:z.speed))},X.prep=function(t){function i(){return z.w=z.w||I.width(),z.w=z.mw&&z.mw<z.w?z.mw:z.w,z.w}function n(){return z.h=z.h||I.height(),z.h=z.mh&&z.mh<z.h?z.mh:z.h,z.h}if(U){var h,a="none"===z.transition?0:z.speed;I.empty().remove(),I=o(ut,"LoadedContent").append(t),I.hide().appendTo(L.show()).css({width:i(),overflow:z.scrolling?"auto":"hidden"}).css({height:n()}).prependTo(y),L.hide(),e(q).css({"float":"none"}),h=function(){function t(){lt&&v[0].style.removeAttribute("filter")}var i,n,h=E.length,d="frameBorder",u="allowTransparency";U&&(n=function(){clearTimeout(Q),W.hide(),c(nt,z.onComplete)},lt&&q&&I.fadeIn(100),M.html(z.title).add(I).show(),h>1?("string"==typeof z.current&&S.html(z.current.replace("{current}",j+1).replace("{total}",h)).show(),R[z.loop||h-1>j?"show":"hide"]().html(z.next),P[z.loop||j?"show":"hide"]().html(z.previous),z.slideshow&&F.show(),z.preloading&&e.each([r(-1),r(1)],function(){var t,i,o=E[this],n=e.data(o,Z);n&&n.href?(t=n.href,e.isFunction(t)&&(t=t.call(o))):t=e(o).attr("href"),t&&s(n,t)&&(t=l(n,t),i=new Image,i.src=t)})):_.hide(),z.iframe?(i=o("iframe")[0],d in i&&(i[d]=0),u in i&&(i[u]="true"),z.scrolling||(i.scrolling="no"),e(i).attr({src:z.href,name:(new Date).getTime(),"class":et+"Iframe",allowFullScreen:!0,webkitAllowFullScreen:!0,mozallowfullscreen:!0}).one("load",n).appendTo(I),ct.one(st,function(){i.src="//about:blank"}),z.fastIframe&&e(i).trigger("load")):n(),"fade"===z.transition?v.fadeTo(a,1,t):t())},"fade"===z.transition?v.fadeTo(a,0,function(){X.position(0,h)}):X.position(a,h)}},X.next=function(){!$&&E[1]&&(z.loop||E[j+1])&&(j=r(1),f(E[j]))},X.prev=function(){!$&&E[1]&&(z.loop||j)&&(j=r(-1),f(E[j]))},X.close=function(){U&&!G&&(G=!0,U=!1,c(rt,z.onCleanup),H.unbind("."+et+" ."+dt),g.fadeTo(200,0),v.stop().fadeTo(300,0,function(){v.add(g).css({opacity:1,cursor:"auto"}).hide(),c(st),I.empty().remove(),setTimeout(function(){G=!1,c(ht,z.onClosed)},1)}))},X.remove=function(){e([]).add(v).add(g).remove(),v=null,e("."+tt).removeData(Z).removeClass(tt),e(t).unbind("click."+et)},X.element=function(){return e(O)},X.settings=Y)})(jQuery,document,window);;
(function ($) {

Drupal.behaviors.initColorbox = {
  attach: function (context, settings) {
    if (!$.isFunction($.colorbox)) {
      return;
    }
    $('a, area, input', context)
      .filter('.colorbox')
      .once('init-colorbox')
      .colorbox(settings.colorbox);
  }
};

{
  $(document).bind('cbox_complete', function () {
    Drupal.attachBehaviors('#cboxLoadedContent');
  });
}

})(jQuery);
;
(function ($) {

Drupal.behaviors.initColorboxDefaultStyle = {
  attach: function (context, settings) {
    $(document).bind('cbox_complete', function () {
      // Only run if there is a title.
      if ($('#cboxTitle:empty', context).length == false) {
        setTimeout(function () { $('#cboxTitle', context).slideUp() }, 1500);
        $('#cboxLoadedContent img', context).bind('mouseover', function () {
          $('#cboxTitle', context).slideDown();
        });
        $('#cboxOverlay', context).bind('mouseover', function () {
          $('#cboxTitle', context).slideUp();
        });
      }
      else {
        $('#cboxTitle', context).hide();
      }
    });
  }
};

})(jQuery);
;

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
 * Attach handlers to evaluate the strength of any password fields and to check
 * that its confirmation is correct.
 */
Drupal.behaviors.password = {
  attach: function (context, settings) {
    var translate = settings.password;
    $('input.password-field', context).once('password', function () {
      var passwordInput = $(this);
      var innerWrapper = $(this).parent();
      var outerWrapper = $(this).parent().parent();

      // Add identifying class to password element parent.
      innerWrapper.addClass('password-parent');

      // Add the password confirmation layer.
      $('input.password-confirm', outerWrapper).parent().prepend('<div class="password-confirm">' + translate['confirmTitle'] + ' <span></span></div>').addClass('confirm-parent');
      var confirmInput = $('input.password-confirm', outerWrapper);
      var confirmResult = $('div.password-confirm', outerWrapper);
      var confirmChild = $('span', confirmResult);

      // Add the description box.
      var passwordMeter = '<div class="password-strength"><div class="password-strength-text" aria-live="assertive"></div><div class="password-strength-title">' + translate['strengthTitle'] + '</div><div class="password-indicator"><div class="indicator"></div></div></div>';
      $(confirmInput).parent().after('<div class="password-suggestions description"></div>');
      $(innerWrapper).prepend(passwordMeter);
      var passwordDescription = $('div.password-suggestions', outerWrapper).hide();

      // Check the password strength.
      var passwordCheck = function () {

        // Evaluate the password strength.
        var result = Drupal.evaluatePasswordStrength(passwordInput.val(), settings.password);

        // Update the suggestions for how to improve the password.
        if (passwordDescription.html() != result.message) {
          passwordDescription.html(result.message);
        }

        // Only show the description box if there is a weakness in the password.
        if (result.strength == 100) {
          passwordDescription.hide();
        }
        else {
          passwordDescription.show();
        }

        // Adjust the length of the strength indicator.
        $(innerWrapper).find('.indicator').css('width', result.strength + '%');

        // Update the strength indication text.
        $(innerWrapper).find('.password-strength-text').html(result.indicatorText);

        passwordCheckMatch();
      };

      // Check that password and confirmation inputs match.
      var passwordCheckMatch = function () {

        if (confirmInput.val()) {
          var success = passwordInput.val() === confirmInput.val();

          // Show the confirm result.
          confirmResult.css({ visibility: 'visible' });

          // Remove the previous styling if any exists.
          if (this.confirmClass) {
            confirmChild.removeClass(this.confirmClass);
          }

          // Fill in the success message and set the class accordingly.
          var confirmClass = success ? 'ok' : 'error';
          confirmChild.html(translate['confirm' + (success ? 'Success' : 'Failure')]).addClass(confirmClass);
          this.confirmClass = confirmClass;
        }
        else {
          confirmResult.css({ visibility: 'hidden' });
        }
      };

      // Monitor keyup and blur events.
      // Blur must be used because a mouse paste does not trigger keyup.
      passwordInput.keyup(passwordCheck).focus(passwordCheck).blur(passwordCheck);
      confirmInput.keyup(passwordCheckMatch).blur(passwordCheckMatch);
    });
  }
};

/**
 * Evaluate the strength of a user's password.
 *
 * Returns the estimated strength and the relevant output message.
 */
Drupal.evaluatePasswordStrength = function (password, translate) {
  var weaknesses = 0, strength = 100, msg = [];

  var hasLowercase = /[a-z]+/.test(password);
  var hasUppercase = /[A-Z]+/.test(password);
  var hasNumbers = /[0-9]+/.test(password);
  var hasPunctuation = /[^a-zA-Z0-9]+/.test(password);

  // If there is a username edit box on the page, compare password to that, otherwise
  // use value from the database.
  var usernameBox = $('input.username');
  var username = (usernameBox.length > 0) ? usernameBox.val() : translate.username;

  // Lose 5 points for every character less than 6, plus a 30 point penalty.
  if (password.length < 6) {
    msg.push(translate.tooShort);
    strength -= ((6 - password.length) * 5) + 30;
  }

  // Count weaknesses.
  if (!hasLowercase) {
    msg.push(translate.addLowerCase);
    weaknesses++;
  }
  if (!hasUppercase) {
    msg.push(translate.addUpperCase);
    weaknesses++;
  }
  if (!hasNumbers) {
    msg.push(translate.addNumbers);
    weaknesses++;
  }
  if (!hasPunctuation) {
    msg.push(translate.addPunctuation);
    weaknesses++;
  }

  // Apply penalty for each weakness (balanced against length penalty).
  switch (weaknesses) {
    case 1:
      strength -= 12.5;
      break;

    case 2:
      strength -= 25;
      break;

    case 3:
      strength -= 40;
      break;

    case 4:
      strength -= 40;
      break;
  }

  // Check if password is the same as the username.
  if (password !== '' && password.toLowerCase() === username.toLowerCase()) {
    msg.push(translate.sameAsUsername);
    // Passwords the same as username are always very weak.
    strength = 5;
  }

  // Based on the strength, work out what text should be shown by the password strength meter.
  if (strength < 60) {
    indicatorText = translate.weak;
  } else if (strength < 70) {
    indicatorText = translate.fair;
  } else if (strength < 80) {
    indicatorText = translate.good;
  } else if (strength <= 100) {
    indicatorText = translate.strong;
  }

  // Assemble the final message.
  msg = translate.hasWeaknesses + '<ul><li>' + msg.join('</li><li>') + '</li></ul>';
  return { strength: strength, message: msg, indicatorText: indicatorText };

};

/**
 * Field instance settings screen: force the 'Display on registration form'
 * checkbox checked whenever 'Required' is checked.
 */
Drupal.behaviors.fieldUserRegistration = {
  attach: function (context, settings) {
    var $checkbox = $('form#field-ui-field-edit-form input#edit-instance-settings-user-register-form');

    if ($checkbox.length) {
      $('input#edit-instance-required', context).once('user-register-form-checkbox', function () {
        $(this).bind('change', function (e) {
          if ($(this).attr('checked')) {
            $checkbox.attr('checked', true);
          }
        });
      });

    }
  }
};

})(jQuery);
;

(function($) {

/**
 * Drupal FieldGroup object.
 */
Drupal.FieldGroup = Drupal.FieldGroup || {};
Drupal.FieldGroup.Effects = Drupal.FieldGroup.Effects || {};
Drupal.FieldGroup.groupWithfocus = null;

Drupal.FieldGroup.setGroupWithfocus = function(element) {
  element.css({display: 'block'});
  Drupal.FieldGroup.groupWithfocus = element;
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processFieldset = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.fieldset', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $('legend span.fieldset-legend', $(this)).eq(0).append(' ').append($('.form-required').eq(0).clone());
        }
        if ($('.error', $(this)).length) {
          $('legend span.fieldset-legend', $(this)).eq(0).addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processAccordion = {
  execute: function (context, settings, type) {
    $('div.field-group-accordion-wrapper', context).once('fieldgroup-effects', function () {
      var wrapper = $(this);

      wrapper.accordion({
        autoHeight: false,
        active: '.field-group-accordion-active',
        collapsible: true,
        changestart: function(event, ui) {
          if ($(this).hasClass('effect-none')) {
            ui.options.animated = false;
          }
          else {
            ui.options.animated = 'slide';
          }
        }
      });

      if (type == 'form') {
        // Add required fields mark to any element containing required fields
        wrapper.find('div.accordion-item').each(function(i){
          if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
            $('h3.ui-accordion-header').eq(i).append(' ').append($('.form-required').eq(0).clone());
          }
          if ($('.error', $(this)).length) {
            $('h3.ui-accordion-header').eq(i).addClass('error');
            var activeOne = $(this).parent().accordion("activate" , i);
            $('.ui-accordion-content-active', activeOne).css({height: 'auto', width: 'auto', display: 'block'});
          }
        });
      }
    });
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processHtabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any element containing required fields
      $('fieldset.horizontal-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('horizontalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('horizontalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('horizontalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 */
Drupal.FieldGroup.Effects.processTabs = {
  execute: function (context, settings, type) {
    if (type == 'form') {
      // Add required fields mark to any fieldsets containing required fields
      $('fieldset.vertical-tabs-pane', context).once('fieldgroup-effects', function(i) {
        if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
          $(this).data('verticalTab').link.find('strong:first').after($('.form-required').eq(0).clone()).after(' ');
        }
        if ($('.error', $(this)).length) {
          $(this).data('verticalTab').link.parent().addClass('error');
          Drupal.FieldGroup.setGroupWithfocus($(this));
          $(this).data('verticalTab').focus();
        }
      });
    }
  }
}

/**
 * Implements Drupal.FieldGroup.processHook().
 *
 * TODO clean this up meaning check if this is really
 *      necessary.
 */
Drupal.FieldGroup.Effects.processDiv = {
  execute: function (context, settings, type) {

    $('div.collapsible', context).once('fieldgroup-effects', function() {
      var $wrapper = $(this);

      // Turn the legend into a clickable link, but retain span.field-group-format-toggler
      // for CSS positioning.

      var $toggler = $('span.field-group-format-toggler:first', $wrapper);
      var $link = $('<a class="field-group-format-title" href="#"></a>');
      $link.prepend($toggler.contents());

      // Add required field markers if needed
      if ($(this).is('.required-fields') && $(this).find('.form-required').length > 0) {
        $link.append(' ').append($('.form-required').eq(0).clone());
      }

      $link.appendTo($toggler);

      // .wrapInner() does not retain bound events.
      $link.click(function () {
        var wrapper = $wrapper.get(0);
        // Don't animate multiple times.
        if (!wrapper.animating) {
          wrapper.animating = true;
          var speed = $wrapper.hasClass('speed-fast') ? 300 : 1000;
          if ($wrapper.hasClass('effect-none') && $wrapper.hasClass('speed-none')) {
            $('> .field-group-format-wrapper', wrapper).toggle();
          }
          else if ($wrapper.hasClass('effect-blind')) {
            $('> .field-group-format-wrapper', wrapper).toggle('blind', {}, speed);
          }
          else {
            $('> .field-group-format-wrapper', wrapper).toggle(speed);
          }
          wrapper.animating = false;
        }
        $wrapper.toggleClass('collapsed');
        return false;
      });

    });
  }
};

/**
 * Behaviors.
 */
Drupal.behaviors.fieldGroup = {
  attach: function (context, settings) {
    if (settings.field_group == undefined) {
      return;
    }

    // Execute all of them.
    $.each(Drupal.FieldGroup.Effects, function (func) {
      // We check for a wrapper function in Drupal.field_group as
      // alternative for dynamic string function calls.
      var type = func.toLowerCase().replace("process", "");
      if (settings.field_group[type] != undefined && $.isFunction(this.execute)) {
        this.execute(context, settings, settings.field_group[type]);
      }
    });

    // Fixes css for fieldgroups under vertical tabs.
    $('.fieldset-wrapper .fieldset > legend').css({display: 'block'});
    $('.vertical-tabs fieldset.fieldset').addClass('default-fallback');

  }
};

})(jQuery);;
(function ($) {

/**
 * Retrieves the summary for the first element.
 */
$.fn.drupalGetSummary = function () {
  var callback = this.data('summaryCallback');
  return (this[0] && callback) ? $.trim(callback(this[0])) : '';
};

/**
 * Sets the summary for all matched elements.
 *
 * @param callback
 *   Either a function that will be called each time the summary is
 *   retrieved or a string (which is returned each time).
 */
$.fn.drupalSetSummary = function (callback) {
  var self = this;

  // To facilitate things, the callback should always be a function. If it's
  // not, we wrap it into an anonymous function which just returns the value.
  if (typeof callback != 'function') {
    var val = callback;
    callback = function () { return val; };
  }

  return this
    .data('summaryCallback', callback)
    // To prevent duplicate events, the handlers are first removed and then
    // (re-)added.
    .unbind('formUpdated.summary')
    .bind('formUpdated.summary', function () {
      self.trigger('summaryUpdated');
    })
    // The actual summaryUpdated handler doesn't fire when the callback is
    // changed, so we have to do this manually.
    .trigger('summaryUpdated');
};

/**
 * Sends a 'formUpdated' event each time a form element is modified.
 */
Drupal.behaviors.formUpdated = {
  attach: function (context) {
    // These events are namespaced so that we can remove them later.
    var events = 'change.formUpdated click.formUpdated blur.formUpdated keyup.formUpdated';
    $(context)
      // Since context could be an input element itself, it's added back to
      // the jQuery object and filtered again.
      .find(':input').andSelf().filter(':input')
      // To prevent duplicate events, the handlers are first removed and then
      // (re-)added.
      .unbind(events).bind(events, function () {
        $(this).trigger('formUpdated');
      });
  }
};

/**
 * Prepopulate form fields with information from the visitor cookie.
 */
Drupal.behaviors.fillUserInfoFromCookie = {
  attach: function (context, settings) {
    $('form.user-info-from-cookie').once('user-info-from-cookie', function () {
      var formContext = this;
      $.each(['name', 'mail', 'homepage'], function () {
        var $element = $('[name=' + this + ']', formContext);
        var cookie = $.cookie('Drupal.visitor.' + this);
        if ($element.length && cookie) {
          $element.val(cookie);
        }
      });
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
