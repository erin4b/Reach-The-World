
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
    $('.krumo-footnote .krumo-call').once().before('<img style="vertical-align: middle;" title="Click to expand. Double-click to show path." src="' + Drupal.settings.basePath + 'misc/help.png"/>');

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
/**
 * @file
 * Adds the collapsible functionality to the rules debug log.
 */

// Registers the rules namespace.
Drupal.rules = Drupal.rules || {};

(function($) {
  Drupal.behaviors.rules_debug_log = {
    attach: function(context) {
      $('.rules-debug-open').click(function () {
        var icon = $(this).children('span.ui-icon');
        if ($(this).next().is(':hidden')) {
          Drupal.rules.changeDebugIcon(icon, true);
        }
        else {
          Drupal.rules.changeDebugIcon(icon, false);
        }
        $(this).next().toggle();
      }).next().hide();

      $('.rules-debug-open-main').click(function () {
        var icon = $(this).children('span.ui-icon');
        if ($(this).parent().next().is(':hidden')) {
          Drupal.rules.changeDebugIcon(icon, true);
          $(this).parent().children('.rules-debug-open-all').text(Drupal.t('-Close all-'));
        }
        else {
          Drupal.rules.changeDebugIcon(icon, false);
          $(this).parent().children('.rules-debug-open-all').text(Drupal.t('-Open all-'));
        }
        $(this).parent().next().toggle();
      }).parent().next().hide();

      $('.rules-debug-open-all').click(function() {
        if ($('.rules-debug-open-main').parent().next().is(':hidden')) {
          $('.rules-debug-open').next().show();
          Drupal.rules.changeDebugIcon($('.rules-debug-open').children('span.ui-icon'), true);
          $('.rules-debug-open-main').parent().next().show();
          Drupal.rules.changeDebugIcon($(this).prev().children('span.ui-icon'), true);
          $(this).text(Drupal.t('-Close all-'));
        }
        else {
          $('.rules-debug-open-main').parent().next().hide();
          Drupal.rules.changeDebugIcon($('.rules-debug-open-main').children('span.ui-icon'), false);
          $(this).text(Drupal.t('-Open all-'));
          $('.rules-debug-open').next().hide();
          Drupal.rules.changeDebugIcon($(this).prev().children('span.ui-icon'), false);
        }
      });
    }
  };

  /**
   * Changes the icon of a collapsible div.
   */
  Drupal.rules.changeDebugIcon = function(item, open) {
    if (open == true) {
      item.removeClass('ui-icon-triangle-1-e');
      item.addClass('ui-icon-triangle-1-s');
    }
    else {
      item.removeClass('ui-icon-triangle-1-s');
      item.addClass('ui-icon-triangle-1-e');
    }
  }
})(jQuery);
;
(function ($) {

Drupal.behaviors.tableSelect = {
  attach: function (context, settings) {
    // Select the inner-most table in case of nested tables.
    $('th.select-all', context).closest('table').once('table-select', Drupal.tableSelect);
  }
};

Drupal.tableSelect = function () {
  // Do not add a "Select all" checkbox if there are no rows with checkboxes in the table
  if ($('td input:checkbox', this).length == 0) {
    return;
  }

  // Keep track of the table, which checkbox is checked and alias the settings.
  var table = this, checkboxes, lastChecked;
  var strings = { 'selectAll': Drupal.t('Select all rows in this table'), 'selectNone': Drupal.t('Deselect all rows in this table') };
  var updateSelectAll = function (state) {
    // Update table's select-all checkbox (and sticky header's if available).
    $(table).prev('table.sticky-header').andSelf().find('th.select-all input:checkbox').each(function() {
      $(this).attr('title', state ? strings.selectNone : strings.selectAll);
      this.checked = state;
    });
  };

  // Find all <th> with class select-all, and insert the check all checkbox.
  $('th.select-all', table).prepend($('<input type="checkbox" class="form-checkbox" />').attr('title', strings.selectAll)).click(function (event) {
    if ($(event.target).is('input:checkbox')) {
      // Loop through all checkboxes and set their state to the select all checkbox' state.
      checkboxes.each(function () {
        this.checked = event.target.checked;
        // Either add or remove the selected class based on the state of the check all checkbox.
        $(this).closest('tr').toggleClass('selected', this.checked);
      });
      // Update the title and the state of the check all box.
      updateSelectAll(event.target.checked);
    }
  });

  // For each of the checkboxes within the table that are not disabled.
  checkboxes = $('td input:checkbox:enabled', table).click(function (e) {
    // Either add or remove the selected class based on the state of the check all checkbox.
    $(this).closest('tr').toggleClass('selected', this.checked);

    // If this is a shift click, we need to highlight everything in the range.
    // Also make sure that we are actually checking checkboxes over a range and
    // that a checkbox has been checked or unchecked before.
    if (e.shiftKey && lastChecked && lastChecked != e.target) {
      // We use the checkbox's parent TR to do our range searching.
      Drupal.tableSelectRange($(e.target).closest('tr')[0], $(lastChecked).closest('tr')[0], e.target.checked);
    }

    // If all checkboxes are checked, make sure the select-all one is checked too, otherwise keep unchecked.
    updateSelectAll((checkboxes.length == $(checkboxes).filter(':checked').length));

    // Keep track of the last checked checkbox.
    lastChecked = e.target;
  });
};

Drupal.tableSelectRange = function (from, to, state) {
  // We determine the looping mode based on the the order of from and to.
  var mode = from.rowIndex > to.rowIndex ? 'previousSibling' : 'nextSibling';

  // Traverse through the sibling nodes.
  for (var i = from[mode]; i; i = i[mode]) {
    // Make sure that we're only dealing with elements.
    if (i.nodeType != 1) {
      continue;
    }

    // Either add or remove the selected class based on the state of the target checkbox.
    $(i).toggleClass('selected', state);
    $('input:checkbox', i).each(function () {
      this.checked = state;
    });

    if (to.nodeType) {
      // If we are at the end of the range, stop.
      if (i == to) {
        break;
      }
    }
    // A faster alternative to doing $(i).filter(to).length.
    else if ($.filter(to, [i]).r.length) {
      break;
    }
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
    this.stickyTable.css('width', this.originalTable.outerWidth());
  }
};

})(jQuery);
;
