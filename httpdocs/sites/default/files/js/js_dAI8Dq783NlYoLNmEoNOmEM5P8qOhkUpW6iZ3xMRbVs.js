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
(function ($) {

/**
 * Attaches sticky table headers.
 */
Drupal.behaviors.tableHeader = {
  attach: function (context, settings) {
    if (!$.support.positionFixed) {
      return;
    }

    $('table.sticky-enabled', context).once('tableheader', function () {
      $(this).data("drupal-tableheader", new Drupal.tableHeader(this));
    });
  }
};

/**
 * Constructor for the tableHeader object. Provides sticky table headers.
 *
 * @param table
 *   DOM object for the table to add a sticky header to.
 */
Drupal.tableHeader = function (table) {
  var self = this;

  this.originalTable = $(table);
  this.originalHeader = $(table).children('thead');
  this.originalHeaderCells = this.originalHeader.find('> tr > th');
  this.displayWeight = null;

  // React to columns change to avoid making checks in the scroll callback.
  this.originalTable.bind('columnschange', function (e, display) {
    // This will force header size to be calculated on scroll.
    self.widthCalculated = (self.displayWeight !== null && self.displayWeight === display);
    self.displayWeight = display;
  });

  // Clone the table header so it inherits original jQuery properties. Hide
  // the table to avoid a flash of the header clone upon page load.
  this.stickyTable = $('<table class="sticky-header"/>')
    .insertBefore(this.originalTable)
    .css({ position: 'fixed', top: '0px' });
  this.stickyHeader = this.originalHeader.clone(true)
    .hide()
    .appendTo(this.stickyTable);
  this.stickyHeaderCells = this.stickyHeader.find('> tr > th');

  this.originalTable.addClass('sticky-table');
  $(window)
    .bind('scroll.drupal-tableheader', $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    .bind('resize.drupal-tableheader', { calculateWidth: true }, $.proxy(this, 'eventhandlerRecalculateStickyHeader'))
    // Make sure the anchor being scrolled into view is not hidden beneath the
    // sticky table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceAnchor.drupal-tableheader', function () {
      window.scrollBy(0, -self.stickyTable.outerHeight());
    })
    // Make sure the element being focused is not hidden beneath the sticky
    // table header. Adjust the scrollTop if it does.
    .bind('drupalDisplaceFocus.drupal-tableheader', function (event) {
      if (self.stickyVisible && event.clientY < (self.stickyOffsetTop + self.stickyTable.outerHeight()) && event.$target.closest('sticky-header').length === 0) {
        window.scrollBy(0, -self.stickyTable.outerHeight());
      }
    })
    .triggerHandler('resize.drupal-tableheader');

  // We hid the header to avoid it showing up erroneously on page load;
  // we need to unhide it now so that it will show up when expected.
  this.stickyHeader.show();
};

/**
 * Event handler: recalculates position of the sticky table header.
 *
 * @param event
 *   Event being triggered.
 */
Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader = function (event) {
  var self = this;
  var calculateWidth = event.data && event.data.calculateWidth;

  // Reset top position of sticky table headers to the current top offset.
  this.stickyOffsetTop = Drupal.settings.tableHeaderOffset ? eval(Drupal.settings.tableHeaderOffset + '()') : 0;
  this.stickyTable.css('top', this.stickyOffsetTop + 'px');

  // Save positioning data.
  var viewHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  if (calculateWidth || this.viewHeight !== viewHeight) {
    this.viewHeight = viewHeight;
    this.vPosition = this.originalTable.offset().top - 4 - this.stickyOffsetTop;
    this.hPosition = this.originalTable.offset().left;
    this.vLength = this.originalTable[0].clientHeight - 100;
    calculateWidth = true;
  }

  // Track horizontal positioning relative to the viewport and set visibility.
  var hScroll = document.documentElement.scrollLeft || document.body.scrollLeft;
  var vOffset = (document.documentElement.scrollTop || document.body.scrollTop) - this.vPosition;
  this.stickyVisible = vOffset > 0 && vOffset < this.vLength;
  this.stickyTable.css({ left: (-hScroll + this.hPosition) + 'px', visibility: this.stickyVisible ? 'visible' : 'hidden' });

  // Only perform expensive calculations if the sticky header is actually
  // visible or when forced.
  if (this.stickyVisible && (calculateWidth || !this.widthCalculated)) {
    this.widthCalculated = true;
    var $that = null;
    var $stickyCell = null;
    var display = null;
    var cellWidth = null;
    // Resize header and its cell widths.
    // Only apply width to visible table cells. This prevents the header from
    // displaying incorrectly when the sticky header is no longer visible.
    for (var i = 0, il = this.originalHeaderCells.length; i < il; i += 1) {
      $that = $(this.originalHeaderCells[i]);
      $stickyCell = this.stickyHeaderCells.eq($that.index());
      display = $that.css('display');
      if (display !== 'none') {
        cellWidth = $that.css('width');
        // Exception for IE7.
        if (cellWidth === 'auto') {
          cellWidth = $that[0].clientWidth + 'px';
        }
        $stickyCell.css({'width': cellWidth, 'display': display});
      }
      else {
        $stickyCell.css('display', 'none');
      }
    }
    this.stickyTable.css('width', this.originalTable.css('width'));
  }
};

})(jQuery);
;
/**
 * @file
 * Handles the JS for the views file browser. Note that this does not currently
 * support multiple file selection
 */


(function ($) {

  Drupal.behaviors.mediaYouTubeBrowser = {
    attach: function (context, settings) {

      // Container for the files that get passed back to the browser
      var files = {};

      // Disable the links on media items list
      $('ul#media-browser-library-list a').click(function() {
        return false;
      });

      // Catch the click on a media item
      $('#media-youtube-add .media-item').bind('click', function () {
        // Remove all currently selected files
        $('.media-item').removeClass('selected');
        // Set the current item to active
        $(this).addClass('selected');
        // Add this FID to the array of selected files
        var uri = $(this).parent('a[data-uri]').attr('data-uri');
        // Get the file from the settings which was stored in
        // template_preprocess_media_views_view_media_browser()
        var file = Drupal.settings.media.files[uri];
        var files = new Array();
        files.push(file);
        Drupal.media.browser.selectMedia(files);
        $("input[name='sumitted-video']").val(uri);
      });

//      $('.')
    }
  }

}(jQuery));;
(function ($) {

/**
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
  }
};

})(jQuery);
;
/**
 * @file
 * Provides JavaScript additions to the managed file field type.
 *
 * This file provides progress bar support (if available), popup windows for
 * file previews, and disabling of other file fields during Ajax uploads (which
 * prevents separate file fields from accidentally uploading files).
 */

(function ($) {

/**
 * Attach behaviors to managed file element upload fields.
 */
Drupal.behaviors.fileValidateAutoAttach = {
  attach: function (context, settings) {
    if (settings.file && settings.file.elements) {
      $.each(settings.file.elements, function(selector) {
        var extensions = settings.file.elements[selector];
        $(selector, context).bind('change', {extensions: extensions}, Drupal.file.validateExtension);
      });
    }
  },
  detach: function (context, settings) {
    if (settings.file && settings.file.elements) {
      $.each(settings.file.elements, function(selector) {
        $(selector, context).unbind('change', Drupal.file.validateExtension);
      });
    }
  }
};

/**
 * Attach behaviors to the file upload and remove buttons.
 */
Drupal.behaviors.fileButtons = {
  attach: function (context) {
    $('input.form-submit', context).bind('mousedown', Drupal.file.disableFields);
    $('div.form-managed-file input.form-submit', context).bind('mousedown', Drupal.file.progressBar);
  },
  detach: function (context) {
    $('input.form-submit', context).unbind('mousedown', Drupal.file.disableFields);
    $('div.form-managed-file input.form-submit', context).unbind('mousedown', Drupal.file.progressBar);
  }
};

/**
 * Attach behaviors to links within managed file elements.
 */
Drupal.behaviors.filePreviewLinks = {
  attach: function (context) {
    $('div.form-managed-file .file a, .file-widget .file a', context).bind('click',Drupal.file.openInNewWindow);
  },
  detach: function (context){
    $('div.form-managed-file .file a, .file-widget .file a', context).unbind('click', Drupal.file.openInNewWindow);
  }
};

/**
 * File upload utility functions.
 */
Drupal.file = Drupal.file || {
  /**
   * Client-side file input validation of file extensions.
   */
  validateExtension: function (event) {
    // Remove any previous errors.
    $('.file-upload-js-error').remove();

    // Add client side validation for the input[type=file].
    var extensionPattern = event.data.extensions.replace(/,\s*/g, '|');
    if (extensionPattern.length > 1 && this.value.length > 0) {
      var acceptableMatch = new RegExp('\\.(' + extensionPattern + ')$', 'gi');
      if (!acceptableMatch.test(this.value)) {
        var error = Drupal.t("The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.", {
          // According to the specifications of HTML5, a file upload control
          // should not reveal the real local path to the file that a user
          // has selected. Some web browsers implement this restriction by
          // replacing the local path with "C:\fakepath\", which can cause
          // confusion by leaving the user thinking perhaps Drupal could not
          // find the file because it messed up the file path. To avoid this
          // confusion, therefore, we strip out the bogus fakepath string.
          '%filename': this.value.replace('C:\\fakepath\\', ''),
          '%extensions': extensionPattern.replace(/\|/g, ', ')
        });
        $(this).closest('div.form-managed-file').prepend('<div class="messages error file-upload-js-error">' + error + '</div>');
        this.value = '';
        return false;
      }
    }
  },
  /**
   * Prevent file uploads when using buttons not intended to upload.
   */
  disableFields: function (event){
    var clickedButton = this;

    // Only disable upload fields for Ajax buttons.
    if (!$(clickedButton).hasClass('ajax-processed')) {
      return;
    }

    // Check if we're working with an "Upload" button.
    var $enabledFields = [];
    if ($(this).closest('div.form-managed-file').length > 0) {
      $enabledFields = $(this).closest('div.form-managed-file').find('input.form-file');
    }

    // Temporarily disable upload fields other than the one we're currently
    // working with. Filter out fields that are already disabled so that they
    // do not get enabled when we re-enable these fields at the end of behavior
    // processing. Re-enable in a setTimeout set to a relatively short amount
    // of time (1 second). All the other mousedown handlers (like Drupal's Ajax
    // behaviors) are excuted before any timeout functions are called, so we
    // don't have to worry about the fields being re-enabled too soon.
    // @todo If the previous sentence is true, why not set the timeout to 0?
    var $fieldsToTemporarilyDisable = $('div.form-managed-file input.form-file').not($enabledFields).not(':disabled');
    $fieldsToTemporarilyDisable.attr('disabled', 'disabled');
    setTimeout(function (){
      $fieldsToTemporarilyDisable.attr('disabled', false);
    }, 1000);
  },
  /**
   * Add progress bar support if possible.
   */
  progressBar: function (event) {
    var clickedButton = this;
    var $progressId = $(clickedButton).closest('div.form-managed-file').find('input.file-progress');
    if ($progressId.length) {
      var originalName = $progressId.attr('name');

      // Replace the name with the required identifier.
      $progressId.attr('name', originalName.match(/APC_UPLOAD_PROGRESS|UPLOAD_IDENTIFIER/)[0]);

      // Restore the original name after the upload begins.
      setTimeout(function () {
        $progressId.attr('name', originalName);
      }, 1000);
    }
    // Show the progress bar if the upload takes longer than half a second.
    setTimeout(function () {
      $(clickedButton).closest('div.form-managed-file').find('div.ajax-progress-bar').slideDown();
    }, 500);
  },
  /**
   * Open links to files within forms in a new window.
   */
  openInNewWindow: function (event) {
    $(this).attr('target', '_blank');
    window.open(this.href, 'filePreview', 'toolbar=0,scrollbars=1,location=1,statusbar=1,menubar=0,resizable=1,width=500,height=550');
    return false;
  }
};

})(jQuery);
;
(function ($) {

/**
 * Attaches the autocomplete behavior to all required fields.
 */
Drupal.behaviors.autocomplete = {
  attach: function (context, settings) {
    var acdb = [];
    $('input.autocomplete', context).once('autocomplete', function () {
      var uri = this.value;
      if (!acdb[uri]) {
        acdb[uri] = new Drupal.ACDB(uri);
      }
      var $input = $('#' + this.id.substr(0, this.id.length - 13))
        .attr('autocomplete', 'OFF')
        .attr('aria-autocomplete', 'list');
      $($input[0].form).submit(Drupal.autocompleteSubmit);
      $input.parent()
        .attr('role', 'application')
        .append($('<span class="element-invisible" aria-live="assertive"></span>')
          .attr('id', $input.attr('id') + '-autocomplete-aria-live')
        );
      new Drupal.jsAC($input, acdb[uri]);
    });
  }
};

/**
 * Prevents the form from submitting if the suggestions popup is open
 * and closes the suggestions popup when doing so.
 */
Drupal.autocompleteSubmit = function () {
  return $('#autocomplete').each(function () {
    this.owner.hidePopup();
  }).length == 0;
};

/**
 * An AutoComplete object.
 */
Drupal.jsAC = function ($input, db) {
  var ac = this;
  this.input = $input[0];
  this.ariaLive = $('#' + this.input.id + '-autocomplete-aria-live');
  this.db = db;

  $input
    .keydown(function (event) { return ac.onkeydown(this, event); })
    .keyup(function (event) { ac.onkeyup(this, event); })
    .blur(function () { ac.hidePopup(); ac.db.cancel(); });

};

/**
 * Handler for the "keydown" event.
 */
Drupal.jsAC.prototype.onkeydown = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 40: // down arrow.
      this.selectDown();
      return false;
    case 38: // up arrow.
      this.selectUp();
      return false;
    default: // All other keys.
      return true;
  }
};

/**
 * Handler for the "keyup" event.
 */
Drupal.jsAC.prototype.onkeyup = function (input, e) {
  if (!e) {
    e = window.event;
  }
  switch (e.keyCode) {
    case 16: // Shift.
    case 17: // Ctrl.
    case 18: // Alt.
    case 20: // Caps lock.
    case 33: // Page up.
    case 34: // Page down.
    case 35: // End.
    case 36: // Home.
    case 37: // Left arrow.
    case 38: // Up arrow.
    case 39: // Right arrow.
    case 40: // Down arrow.
      return true;

    case 9:  // Tab.
    case 13: // Enter.
    case 27: // Esc.
      this.hidePopup(e.keyCode);
      return true;

    default: // All other keys.
      if (input.value.length > 0 && !input.readOnly) {
        this.populatePopup();
      }
      else {
        this.hidePopup(e.keyCode);
      }
      return true;
  }
};

/**
 * Puts the currently highlighted suggestion into the autocomplete field.
 */
Drupal.jsAC.prototype.select = function (node) {
  this.input.value = $(node).data('autocompleteValue');
};

/**
 * Highlights the next suggestion.
 */
Drupal.jsAC.prototype.selectDown = function () {
  if (this.selected && this.selected.nextSibling) {
    this.highlight(this.selected.nextSibling);
  }
  else if (this.popup) {
    var lis = $('li', this.popup);
    if (lis.length > 0) {
      this.highlight(lis.get(0));
    }
  }
};

/**
 * Highlights the previous suggestion.
 */
Drupal.jsAC.prototype.selectUp = function () {
  if (this.selected && this.selected.previousSibling) {
    this.highlight(this.selected.previousSibling);
  }
};

/**
 * Highlights a suggestion.
 */
Drupal.jsAC.prototype.highlight = function (node) {
  if (this.selected) {
    $(this.selected).removeClass('selected');
  }
  $(node).addClass('selected');
  this.selected = node;
  $(this.ariaLive).html($(this.selected).html());
};

/**
 * Unhighlights a suggestion.
 */
Drupal.jsAC.prototype.unhighlight = function (node) {
  $(node).removeClass('selected');
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Hides the autocomplete suggestions.
 */
Drupal.jsAC.prototype.hidePopup = function (keycode) {
  // Select item if the right key or mousebutton was pressed.
  if (this.selected && ((keycode && keycode != 46 && keycode != 8 && keycode != 27) || !keycode)) {
    this.input.value = $(this.selected).data('autocompleteValue');
  }
  // Hide popup.
  var popup = this.popup;
  if (popup) {
    this.popup = null;
    $(popup).fadeOut('fast', function () { $(popup).remove(); });
  }
  this.selected = false;
  $(this.ariaLive).empty();
};

/**
 * Positions the suggestions popup and starts a search.
 */
Drupal.jsAC.prototype.populatePopup = function () {
  var $input = $(this.input);
  var position = $input.position();
  // Show popup.
  if (this.popup) {
    $(this.popup).remove();
  }
  this.selected = false;
  this.popup = $('<div id="autocomplete"></div>')[0];
  this.popup.owner = this;
  $(this.popup).css({
    top: parseInt(position.top + this.input.offsetHeight, 10) + 'px',
    left: parseInt(position.left, 10) + 'px',
    width: $input.innerWidth() + 'px',
    display: 'none'
  });
  $input.before(this.popup);

  // Do search.
  this.db.owner = this;
  this.db.search(this.input.value);
};

/**
 * Fills the suggestion popup with any matches received.
 */
Drupal.jsAC.prototype.found = function (matches) {
  // If no value in the textfield, do not show the popup.
  if (!this.input.value.length) {
    return false;
  }

  // Prepare matches.
  var ul = $('<ul></ul>');
  var ac = this;
  for (key in matches) {
    $('<li></li>')
      .html($('<div></div>').html(matches[key]))
      .mousedown(function () { ac.select(this); })
      .mouseover(function () { ac.highlight(this); })
      .mouseout(function () { ac.unhighlight(this); })
      .data('autocompleteValue', key)
      .appendTo(ul);
  }

  // Show popup with matches, if any.
  if (this.popup) {
    if (ul.children().length) {
      $(this.popup).empty().append(ul).show();
      $(this.ariaLive).html(Drupal.t('Autocomplete popup'));
    }
    else {
      $(this.popup).css({ visibility: 'hidden' });
      this.hidePopup();
    }
  }
};

Drupal.jsAC.prototype.setStatus = function (status) {
  switch (status) {
    case 'begin':
      $(this.input).addClass('throbbing');
      $(this.ariaLive).html(Drupal.t('Searching for matches...'));
      break;
    case 'cancel':
    case 'error':
    case 'found':
      $(this.input).removeClass('throbbing');
      break;
  }
};

/**
 * An AutoComplete DataBase object.
 */
Drupal.ACDB = function (uri) {
  this.uri = uri;
  this.delay = 300;
  this.cache = {};
};

/**
 * Performs a cached and delayed search.
 */
Drupal.ACDB.prototype.search = function (searchString) {
  var db = this;
  this.searchString = searchString;

  // See if this string needs to be searched for anyway.
  searchString = searchString.replace(/^\s+|\s+$/, '');
  if (searchString.length <= 0 ||
    searchString.charAt(searchString.length - 1) == ',') {
    return;
  }

  // See if this key has been searched for before.
  if (this.cache[searchString]) {
    return this.owner.found(this.cache[searchString]);
  }

  // Initiate delayed search.
  if (this.timer) {
    clearTimeout(this.timer);
  }
  this.timer = setTimeout(function () {
    db.owner.setStatus('begin');

    // Ajax GET request for autocompletion. We use Drupal.encodePath instead of
    // encodeURIComponent to allow autocomplete search terms to contain slashes.
    $.ajax({
      type: 'GET',
      url: db.uri + '/' + Drupal.encodePath(searchString),
      dataType: 'json',
      success: function (matches) {
        if (typeof matches.status == 'undefined' || matches.status != 0) {
          db.cache[searchString] = matches;
          // Verify if these are still the matches the user wants to see.
          if (db.searchString == searchString) {
            db.owner.found(matches);
          }
          db.owner.setStatus('found');
        }
      },
      error: function (xmlhttp) {
        alert(Drupal.ajaxError(xmlhttp, db.uri));
      }
    });
  }, this.delay);
};

/**
 * Cancels the current autocomplete request.
 */
Drupal.ACDB.prototype.cancel = function () {
  if (this.owner) this.owner.setStatus('cancel');
  if (this.timer) clearTimeout(this.timer);
  this.searchString = '';
};

})(jQuery);
;
(function ($) {
  Drupal.behaviors.media_browser_folders = {
    attach: function (context) {
      // Show links hidden by media module.
      // This is a workaround, see http://drupal.org/node/1174374 for details.
      $('.action-links li', context).show();
      // Remove the not needed ones only
      $('ul.action-links li', context).has('a[href$="file/browser"], a[href$="media/import"]').hide();
      var gallery = $('#media-thumb-list');
      var selectedPreviewIndex = 0;
      var selectedPreviewItems = new Array();
      Drupal.behaviors.media_browser_folders.loadedMedia = new Array();
      // Load active folder
      Drupal.behaviors.media_browser_folders.loadFolderContents($("ul.media-folder-list  li.selected"), 0);
      // Bind click handlers.

      // Toggle the display of subfolders
      $("ul.media-folder-list li.parent div.icon").bind('click', Drupal.behaviors.media_browser_folders.toggleSubfolders);
      // Close all folders.
      $('ul.media-folder-list li.parent ul').addClass('hidden');
      // Ensure the path to the selected folder is open.
      $('ul.media-folder-list li.selected').parents('ul').removeClass('hidden');
      // remove old select assets
      $('div.media-thumbnails-select').remove();
      // folder content loading:
      $('li.folder').bind('click', function( event ) {
        // grab item
        var $item = $(this);
        // and load contents
        Drupal.behaviors.media_browser_folders.loadFolderContents($item, 0);
        return false;
      });
      if(Drupal.settings.media_browser_plus.folder_dnd_enabled) {
        $("li.folder div.drop").droppable({
          accept: "#media-thumb-list > li",
          drop: Drupal.behaviors.media_browser_folders.moveImage,
          over: function (event, ui) {
            $(this).toggleClass('dragOverDrop');
          },
          out: function (event, ui) {
            $(this).toggleClass('dragOverDrop');
          }
        });

      }
      $("#media-basket-list").droppable({
        accept: "#media-thumb-list > li",
        drop: Drupal.behaviors.media_browser_folders.dropSelectedMedia,
        over: function (event, ui) {
          $(this).toggleClass('dragOverDrop');
        },
        out: function (event, ui) {
          $(this).toggleClass('dragOverDrop');
        }
      });
      $('#media-filter-launch').bind('click', function( event ) {
        $.colorbox({iframe:true, href:Drupal.settings.media_browser_plus.url +
          "admin/content/file/filter", width:"90%", height:"90%", onClosed: Drupal.behaviors.media_browser_folders.reloadData});
        return false;
      });
      $('#media_buttons_view').bind('click', function( event ) {
          $media = $("div.selected:first", $('#media-thumb-list'));
          if($media.html() != null)
            window.open(Drupal.settings.media_browser_plus.url +
              "file/" +Drupal.behaviors.media_browser_folders.getId($media.parent().attr('id'), 11) + "/view");
          return false;
        });
      $('#media_buttons_preview').bind('click', function( event ) {
        // reset selectionArray
        selectedPreviewItems = new Array();
        selectedPreviewIndex = 0;
        $("div.media-item.selected", $('#media-thumb-list')).each(function(index) {
          var $media = $(this);
          // check for double adding
          selectedPreviewItems.push(Drupal.behaviors.media_browser_folders.getId($media.parent().attr('id'), 11));
        });
        if(selectedPreviewItems.length > 0) {
          // open an empty colorbox to show activity
          $.colorbox({initialWidth:"300px", initialHeight:"200px"});
          Drupal.behaviors.media_browser_folders.loadPreview(selectedPreviewItems[selectedPreviewIndex]);
        }
      return false;
      });
      $('#media_basket_remove_all').bind('click', function( event ) {
        $('li', $('#media-basket-list')).each(function(index){
          var $media = $(this);
          $media.remove();
        });
        return false;
      });
      $('#previous_preview_item').bind('click', function( event ) {
        selectedPreviewIndex--;
        if(selectedPreviewIndex < 0)
          selectedPreviewIndex = selectedPreviewItems.length - 1;
        Drupal.behaviors.media_browser_folders.loadPreview(selectedPreviewItems[selectedPreviewIndex]);
        return false;
      });
      $('#select_preview_item').bind('click', function( event ) {
        $media = $('div.media-item', $('#media-item-' + selectedPreviewItems[selectedPreviewIndex], $('#media-thumb-list')));
        Drupal.behaviors.media_browser_folders.selectMedia($media);
        return false;
      });
      $('#next_preview_item').bind('click', function( event ) {
        selectedPreviewIndex++;
        if(selectedPreviewIndex > (selectedPreviewItems.length -1))
          selectedPreviewIndex = 0;
        Drupal.behaviors.media_browser_folders.loadPreview(selectedPreviewItems[selectedPreviewIndex]);
        return false;
      });
      $('#media_main_view_select_all').bind('click', function( event ) {
          $('div.media-item', $('#media-thumb-list')).each(function(index){
            var $media = $(this);
            var $input = $('input', $media.parent());
            //
            $media.addClass('selected');
            $input.attr('checked', true);
          });
      });
      $('#media_main_view_deselect_all').bind('click', function( event ) {
          $('div.media-item', $('#media-thumb-list')).each(function(index){
            var $media = $(this);
            var $input = $('input', $media.parent());
            //
            $media.removeClass('selected');
            $input.attr('checked', false);
          });
      });
      $('#media_buttons_select').bind('click', function( event ) {
        Drupal.behaviors.media_browser_folders.selectMediaItems();
        return false;
      });
    },
    // function which moves an image into a new folder
    moveImage: function (event , ui) {
      var folder = $(this).parent();
      $(this).removeClass('dragOverDrop');
      if (folder.hasClass('selected')) {
        return;
      }
      var item = ui.draggable;
      // every image has an hidden input with its id inside its <li> tag
      var id = Drupal.behaviors.media_browser_folders.getId(item.attr('id'), 11);

      // remove the hover media over folder class
      folder.removeClass('emptyFolder');
      folder.parent().children(":first-child").removeClass("emptyParent");
      folder.parent().children(":first-child").removeClass("empty");
      // look if old folder is now empty
      // send the change media folder request
      // @TODO: think about some success/error UI Feedback
      $.post(Drupal.settings.media_browser_plus.url + "admin/content/file/change_folder", {media: id, folder: folder.attr('id')});
      // remove item from gallery
      item.addClass("movedImage");
      item.fadeOut();
      if($('#media-thumb-list > li:not(.movedImage)').length - 2 <= 0){
          var oldFolder = $('li.selected');
          oldFolder.addClass('emptyFolder');
          if(folder.parent().children(":first-child").hasClass("emptyParent")){
            oldFolder.parent().children(":first-child").addClass("emptyParent");
          } else {
            oldFolder.parent().children(":first-child").addClass("empty");
          }
        }
    },
    selectMediaItems : function (data) {
      $('div.selected', $('#media-thumb-list')).each(function(index){
        // put single select check here to otherwise
        // you get a whole lot of alerts in some cases
        if(!Drupal.settings.media_browser_plus.multiselect) {
          if($('li', $('#media-basket-list')).html() != null) {
            alert(Drupal.settings.media_browser_plus.messages.only_one_selection_allowed);
            return false;
          }
        }
        // grab item
        var $media = $(this);
        Drupal.behaviors.media_browser_folders.selectMedia($media);
      });
    },
    selectMedia: function (data) {
      // check for double adding
      $media = $(data);
      Drupal.behaviors.media_browser_folders.performMediaBasketSelection($media.parent());
    },
    dropSelectedMedia : function (event , ui) {
      $clone = $(ui.draggable);
      $media = $('li[id="'+$clone.attr('id')+'"]', $('#media-thumb-list'));
      Drupal.behaviors.media_browser_folders.performMediaBasketSelection($media);
      if(Drupal.settings.media_browser_plus.multiselect)
        Drupal.behaviors.media_browser_folders.selectMediaItems();
    },
    performMediaBasketSelection : function ($media) {
      var id = $media.attr('id');
      id = id.slice(11, id.length);
      // check if single-section mode is set
      if(!Drupal.settings.media_browser_plus.multiselect) {
        if($('li', $('#media-basket-list')).html() != null) {
          alert(Drupal.settings.media_browser_plus.messages.only_one_selection_allowed);
          return false;
        }
      }
      // check for double adding
      $item_dup = $('li[id="basket-media-item-'+id+'"]', $('#media-basket-list'));
      if($item_dup.html() == null) {
        var item = '<li id="basket-media-item-' + id + '">' + $media.html() + '</li>';
        $item = $(item).clone();
        $item.removeClass('selected');
        $('.media-item', $item).append('<input type="hidden" name="selected_media['+id+']" value="1">');
        $item.bind('click', function( event ) {
          $(this).remove();
          return true;
          });
        $item.appendTo('#media-basket-list');
      }
    },
    loadFolderContents: function ($item, $page) {
      $('.selected').removeClass('selected');
      // Set folder as new active folder and set new page
      $item.addClass('selected');
      // Remove old pictures.
      $("#media-thumb-list > li").remove();
      var loading = '<li id="loading_media"><img src="'+Drupal.settings.media_browser_plus.images_url+'loading.gif" /><li>';
      $loading = $(loading);
      $loading.appendTo('#media-thumb-list');
      // @TODO: add some kind of loading UI and failure handling here
      // and load in new ones
      $filter = Drupal.settings.media_browser_plus.filter;
      $.getJSON(Drupal.settings.media_browser_plus.url + "admin/content/file/thumbnailsJSON", {folder: $item.attr('id'), page : $page, filter : $filter}, Drupal.behaviors.media_browser_folders.folderContentsLoaded);
      // redo the pages menu
      Drupal.settings.media_browser_plus.page = $page;
    },
    addPageItem: function ($folder, $page, $title) {
      $page_item = '<div class="media_paging_page';
      if(Drupal.settings.media_browser_plus.page == $page)
        $page_item += " active_page";
      $page_item += '">' + $title + '</div>';
      $page_item = $($page_item);
      $page_item.bind('click', function( event ) {
        // load the selected page
        Drupal.behaviors.media_browser_folders.loadFolderContents($folder, $page);
        return false;
      });
      // append the item
      $('#media_browser_plus_pages').append($page_item);
    },
    folderContentsLoaded: function (data) {
      // Skip if there are no data.
      if (!data) {
        return;
      }
      var results_count = data['media'].length;
      var overall_count = data['overall_count'];
      var folder = $('#'+data['folder_loaded']);
      var newMedia = data['media'];
      Drupal.behaviors.media_browser_folders.loadedMedia = Drupal.behaviors.media_browser_folders.loadedMedia.concat(newMedia);
      // remove loading indicator
      $('#loading_media').remove();
      jQuery(data['media']).each(function(index){
        // grab item
        var item = this;
        // create checkbox for form actions
        var checkbox = '<input class="form-checkbox hidden" id="edit-files-' + item.fid + '" name="files[' + item.fid + ']" value="1" type="checkbox">';
        // append item
        var listItem = $('<li></li>').appendTo('#media-thumb-list')
          .attr('id', 'media-item-' + item.fid)
          .html(checkbox + item.preview)
          .bind('click', function( event ) {
            // grab item
            var media = $(this);
            var input = $('input', media);
            // toggle selection
            $('.media-item', media).toggleClass('selected');
            input.attr('checked', $('.media-item', media).hasClass('selected'));
            // check for single-selection
            if(!Drupal.settings.media_browser_plus.multiselect) {
              // and remove all other selections
            }
            return true;
          })
          .dblclick( function(event) {
            $('input', $(this)).attr('checked', true);
            $('#media_buttons_edit').click();
          });
        $item = $(item);
        if(Drupal.settings.media_browser_plus.multiselect || Drupal.settings.media_browser_plus.folder_dnd_enabled)
          listItem.draggable({
            cancel: "a.ui-icon", // clicking an icon won't initiate dragging
            revert: "invalid", // when not dropped, the item will revert back to its initial position
            containment: "document", // stick to demo-frame if present
            helper: "clone",
            cursor: "move"
          });
      });
      // handle paging menu:
      $('#media_browser_plus_pages').html('');
      var $pages = Math.ceil(overall_count / Drupal.settings.media_browser_plus.per_page);
      var $i = $pages;
      var $start = Math.max(0, Drupal.settings.media_browser_plus.page - Math.ceil(Drupal.settings.media_browser_plus.page_items_per_page / 2));
      var $end = Math.min($pages, $start + Drupal.settings.media_browser_plus.page_items_per_page);
      if($start > 0){
        Drupal.behaviors.media_browser_folders.addPageItem(folder, $start-1, "...");
      }
      // create numbers
      if($pages > 1)
        for($i = $start; $i < $end; $i++){
          Drupal.behaviors.media_browser_folders.addPageItem(folder, $i, $i + 1);
        }
      // append one extra to show that there are more pages
      if($pages > $i){
        Drupal.behaviors.media_browser_folders.addPageItem(folder, $i, "...");
      }
    },
    toggleSubfolders: function (event) {
      // Toggle the display of subfolders.
      $(this).siblings().children('ul').toggleClass('hidden');
      return false;
    },
    loadPreview: function (id) {
      if(id > 0) {
        $('#media-preview-label').html('...');
        var myWidth = 0, myHeight = 0;
        if( typeof( window.innerWidth ) == 'number' ) {
          //Non-IE
          myWidth = window.parent.innerWidth;
          myHeight = window.parent.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
          //IE 6+ in 'standards compliant mode'
          myWidth = document.documentElement.clientWidth;
          myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
          //IE 4 compatible
          myWidth = document.body.clientWidth;
          myHeight = document.body.clientHeight;
        }
        $maxWidth = myWidth - 100;
        $maxHeight = myHeight - 250;
        $.post(Drupal.settings.media_browser_plus.url + "admin/content/file/" + id +"/preview", { maxWidth: $maxWidth, maxHeight: $maxHeight}, Drupal.behaviors.media_browser_folders.displayLoadedPreview);
        $('#media_browser_plus_preview_content').html('<img src="'+Drupal.settings.media_browser_plus.images_url+'loading.gif" />');
      }
    },
    displayLoadedPreview: function (data) {
      var $item = $(this);
      $('#media_browser_plus_preview_content').html(data);
      $meta = $('.preview-metadata', $('#media_browser_plus_preview_content'));
      $.colorbox({inline:true, href:"#media-preview-table"});
      $('#media-preview-label').html($meta.attr('title'));
    },
    reloadData: function (data) {
      window.location.reload();
    },
    getWindowSize: function () {
      var myWidth = 0, myHeight = 0;
      if( typeof( window.innerWidth ) == 'number' ) {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
      } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
      } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
      }
      return new Array(myWidth, myHeight);
    },
    getId : function (idString, idStart) {
      return idString.slice(idStart, idString.length);
    }
  };
})(jQuery);
;
(function ($) {
  Drupal.behaviors.media_browser_library = {
    attach: function (context) {
      //Drupal.media.browser.selectedMedia = [];
      $('#proceed_with_select').bind('click', function( event ) {
        // checking for selection mode
        if(!Drupal.settings.media_browser_plus.multiselect) {
          var id = $('div.media-item.selected:first', $('#media-thumb-list')).parent().attr('id');
          // grab id - remove the "media-item-" part
          id = Drupal.behaviors.media_browser_folders.getId(id, 11);
          // add object
          Drupal.behaviors.media_browser_library.selectMedia(id);
        } else {
          // getting selected media objects
          $('#media-basket-list li').each(function (index) {
            // grab id - remove the "basket-media-item-" part
            var id = Drupal.behaviors.media_browser_folders.getId($(this).attr('id'), 18);
            // add object
            Drupal.behaviors.media_browser_library.selectMedia(id);
          });
        }
        Drupal.media.browser.submit();
        return false;
      });
      // resize the media browser
      if(typeof (parent.document.documentElement.clientWidth) == 'number'){
        width = parent.document.documentElement.clientWidth - 100;
        scrollTop = parent.window.pageYOffset;
        scrollLeft = parent.window.pageXOffset;
        $('#mediaBrowser', top.document).css('width', width+'px');
        $('.ui-dialog.media-wrapper', top.document).css('top', (scrollTop+25)+'px');
        $('.ui-dialog.media-wrapper', top.document).css('left', (scrollLeft+50)+'px');
        $('#mediaBrowser', top.document).attr('width', width);
        $('.ui-dialog.media-wrapper', top.document).css('width', (width+10)+'px');
      }
    },
    selectMedia : function (id) {
      var media = Drupal.behaviors.media_browser_folders.loadedMedia;
      for(var i = 0; i < media.length; i++) {
        if(media[i].fid == id) {
          Drupal.media.browser.selectedMedia.push(media[i]);
          break;
        }
      }
    }
  };
})(jQuery);
;
/**
 * @file
 * Provides default functions for the media browser
 */

(function ($) {
namespace('Drupal.media.browser');

Drupal.media.browser.selectedMedia = [];
Drupal.media.browser.mediaAdded = function () {};
Drupal.media.browser.selectionFinalized = function (selectedMedia) {
  // This is intended to be overridden if a callee wants to be triggered
  // when the media selection is finalized from inside the browser.
  // This is used for the file upload form for instance.
};

Drupal.behaviors.MediaBrowser = {
  attach: function (context) {
    if (Drupal.settings.media.selectedMedia) {
      Drupal.media.browser.selectMedia(Drupal.settings.media.selectedMedia);
      // Fire a confirmation of some sort.
      Drupal.media.browser.finalizeSelection();
    }

    // Instantiate the tabs.
    $('#media-browser-tabset').tabs({
      // Ensure that the modal resizes to the content on each tab switch.
      show: Drupal.media.browser.resizeIframe
    });

    $('.media-browser-tab').each( Drupal.media.browser.validateButtons );

    Drupal.media.browser.selectErrorTab();

  }
  // Wait for additional params to be passed in.
};

Drupal.media.browser.launch = function () {

};

Drupal.media.browser.validateButtons = function() {
  // The media browser runs in an IFRAME. The Drupal.media.popups.mediaBrowser()
  // function sets up the IFRAME and "OK" and "Cancel" buttons that are outside
  // of the IFRAME, so that their click handlers can destroy the IFRAME while
  // retaining information about what media items were selected. However,
  // Drupal UI convention is to place all action buttons on the same "line"
  // at the bottom of the form, so if the form within the IFRAME contains a
  // "Submit" button or other action buttons, then the "OK" and "Cancel"
  // buttons below the IFRAME break this convention and confuse the user.
  // Therefore, we add "Submit" and "Cancel" buttons inside the IFRAME, and
  // have their click action trigger the click action of the corresonding
  // "OK" and "Cancel" buttons that are outside the IFRAME. media.css contains
  // CSS rules that hide the outside buttons.

  // If a submit button is present, another round-trip to the server is needed
  // before the user's selection is finalized. For these cases, when the form's
  // real Submit button is clicked, the server either returns another form for
  // the user to fill out, or else a completion page that contains or sets the
  // Drupal.media.browser.selectedMedia variable. If the latter, then
  // Drupal.media.popups.mediaBrowser.mediaBrowserOnLoad() auto-triggers the
  // "OK" button action to finalize the selection and remove the IFRAME.

  // We need to check for the fake submit/cancel buttons that are used on
  // non-form based pane content. On these items we need to bind the clicks
  // so that media can be selected or the window can be closed. This is still a
  // hacky approach, but it is a step in the right direction.

  $('a.button.fake-submit', this).once().bind('click', Drupal.media.browser.submit);
  $('a.button.fake-cancel', this).once().bind('click', Drupal.media.browser.submit);
};

Drupal.media.browser.submit = function () {
  // @see Drupal.media.browser.validateButtons().
  var buttons = $(parent.window.document.body).find('#mediaBrowser').parent('.ui-dialog').find('.ui-dialog-buttonpane button');
  if ($(this).hasClass('fake-cancel')) {
    buttons[1].click();
  }
  else {
    buttons[0].click();
  }

  // Return false to prevent the fake link "click" from continuing.
  return false;
}

Drupal.media.browser.selectMedia = function (selectedMedia) {
  Drupal.media.browser.selectedMedia = selectedMedia;
};

Drupal.media.browser.finalizeSelection = function () {
  if (!Drupal.media.browser.selectedMedia) {
    throw new exception(Drupal.t('Cannot continue, nothing selected'));
  }
  else {
    Drupal.media.browser.selectionFinalized(Drupal.media.browser.selectedMedia);
  }
};

/**
 * Resize the Media Browser to the content height.
 */
Drupal.media.browser.resizeIframe = function (event) {
  var h = $('body').height();
  $(parent.window.document).find('#mediaBrowser').height(h);
};

Drupal.media.browser.selectErrorTab = function() {
  // Find the ID of a tab with an error in it
  var errorTabID = $('#media-browser-tabset')
    .find('.error')
    .parents('.media-browser-tab')
    .attr('id');

  if (errorTabID !== undefined) {
    // Find the Tab Link with errorTabID
    var tab = $('a[href="#' + errorTabID + '"]');
    // Find the index of the tab
    var index = $('#media-browser-tabset a').index(tab);
    // Select the tab
    $('#media-browser-tabset').tabs('select', index)
  }
}

}(jQuery));
;
