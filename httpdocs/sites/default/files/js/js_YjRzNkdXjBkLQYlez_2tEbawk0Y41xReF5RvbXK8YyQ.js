/**
 * @file
 * Attaches behaviors for the Contextual module.
 */

(function ($) {

Drupal.contextualLinks = Drupal.contextualLinks || {};

/**
 * Attaches outline behavior for regions associated with contextual links.
 */
Drupal.behaviors.contextualLinks = {
  attach: function (context) {
    $('div.contextual-links-wrapper', context).once('contextual-links', function () {
      var $wrapper = $(this);
      var $region = $wrapper.closest('.contextual-links-region');
      var $links = $wrapper.find('ul.contextual-links');
      var $trigger = $('<a class="contextual-links-trigger" href="#" />').text(Drupal.t('Configure')).click(
        function () {
          $links.stop(true, true).slideToggle(100);
          $wrapper.toggleClass('contextual-links-active');
          return false;
        }
      );
      // Attach hover behavior to trigger and ul.contextual-links.
      $trigger.add($links).hover(
        function () { $region.addClass('contextual-links-region-active'); },
        function () { $region.removeClass('contextual-links-region-active'); }
      );
      // Hide the contextual links when user clicks a link or rolls out of the .contextual-links-region.
      $region.bind('mouseleave click', Drupal.contextualLinks.mouseleave);
      // Prepend the trigger.
      $wrapper.prepend($trigger);
    });
  }
};

/**
 * Disables outline for the region contextual links are associated with.
 */
Drupal.contextualLinks.mouseleave = function () {
  $(this)
    .find('.contextual-links-active').removeClass('contextual-links-active')
    .find('ul.contextual-links').hide();
};

})(jQuery);
;
(function ($) {

/**
 * This script transforms a set of fieldsets into a stack of horizontal
 * tabs. Another tab pane can be selected by clicking on the respective
 * tab.
 *
 * Each tab may have a summary which can be updated by another
 * script. For that to work, each fieldset has an associated
 * 'horizontalTabCallback' (with jQuery.data() attached to the fieldset),
 * which is called every time the user performs an update to a form
 * element inside the tab pane.
 */
Drupal.behaviors.horizontalTabs = {
  attach: function (context) {
    $('.horizontal-tabs-panes', context).once('horizontal-tabs', function () {
      var focusID = $(':hidden.horizontal-tabs-active-tab', this).val();
      var tab_focus;

      // Check if there are some fieldsets that can be converted to horizontal-tabs
      var $fieldsets = $('> fieldset', this);
      if ($fieldsets.length == 0) {
        return;
      }

      // Create the tab column.
      var tab_list = $('<ul class="horizontal-tabs-list"></ul>');
      $(this).wrap('<div class="horizontal-tabs clearfix"></div>').before(tab_list);

      // Transform each fieldset into a tab.
      $fieldsets.each(function (i) {
        var horizontal_tab = new Drupal.horizontalTab({
          title: $('> legend', this).text(),
          fieldset: $(this)
        });
        horizontal_tab.item.addClass('horizontal-tab-button-' + i);
        tab_list.append(horizontal_tab.item);
        $(this)
          .removeClass('collapsible collapsed')
          .addClass('horizontal-tabs-pane')
          .data('horizontalTab', horizontal_tab);
        if (this.id == focusID) {
          tab_focus = $(this);
        }
      });

      $('> li:first', tab_list).addClass('first');
      $('> li:last', tab_list).addClass('last');

      if (!tab_focus) {
        // If the current URL has a fragment and one of the tabs contains an
        // element that matches the URL fragment, activate that tab.
        if (window.location.hash && $(window.location.hash, this).length) {
          tab_focus = $(window.location.hash, this).closest('.horizontal-tabs-pane');
        }
        else {
          tab_focus = $('> .horizontal-tabs-pane:first', this);
        }
      }
      if (tab_focus.length) {
        tab_focus.data('horizontalTab').focus();
      }
    });
  }
};

/**
 * The horizontal tab object represents a single tab within a tab group.
 *
 * @param settings
 *   An object with the following keys:
 *   - title: The name of the tab.
 *   - fieldset: The jQuery object of the fieldset that is the tab pane.
 */
Drupal.horizontalTab = function (settings) {
  var self = this;
  $.extend(this, settings, Drupal.theme('horizontalTab', settings));

  this.link.click(function () {
    self.focus();
    return false;
  });

  // Keyboard events added:
  // Pressing the Enter key will open the tab pane.
  this.link.keydown(function(event) {
    if (event.keyCode == 13) {
      self.focus();
      // Set focus on the first input field of the visible fieldset/tab pane.
      $("fieldset.horizontal-tabs-pane :input:visible:enabled:first").focus();
      return false;
    }
  });

  // Pressing the Enter key lets you leave the tab again.
  this.fieldset.keydown(function(event) {
    // Enter key should not trigger inside <textarea> to allow for multi-line entries.
    if (event.keyCode == 13 && event.target.nodeName != "TEXTAREA") {
      // Set focus on the selected tab button again.
      $(".horizontal-tab-button.selected a").focus();
      return false;
    }
  });

  this.fieldset
    .bind('summaryUpdated', function () {
      self.updateSummary();
    })
    .trigger('summaryUpdated');
};

Drupal.horizontalTab.prototype = {
  /**
   * Displays the tab's content pane.
   */
  focus: function () {
    this.fieldset
      .removeClass('horizontal-tab-hidden')
      .siblings('fieldset.horizontal-tabs-pane')
        .each(function () {
          var tab = $(this).data('horizontalTab');
          tab.fieldset.addClass('horizontal-tab-hidden');
          tab.item.removeClass('selected');
        })
        .end()
      .siblings(':hidden.horizontal-tabs-active-tab')
        .val(this.fieldset.attr('id'));
    this.item.addClass('selected');
    // Mark the active tab for screen readers.
    $('#active-horizontal-tab').remove();
    this.link.append('<span id="active-horizontal-tab" class="element-invisible">' + Drupal.t('(active tab)') + '</span>');
  },

  /**
   * Updates the tab's summary.
   */
  updateSummary: function () {
    this.summary.html(this.fieldset.drupalGetSummary());
  },

  /**
   * Shows a horizontal tab pane.
   */
  tabShow: function () {
    // Display the tab.
    this.item.removeClass('horizontal-tab-hidden');
    // Update .first marker for items. We need recurse from parent to retain the
    // actual DOM element order as jQuery implements sortOrder, but not as public
    // method.
    this.item.parent().children('.horizontal-tab-button').removeClass('first')
      .filter(':visible:first').addClass('first');
    // Display the fieldset.
    this.fieldset.removeClass('horizontal-tab-hidden');
    // Focus this tab.
    this.focus();
    return this;
  },

  /**
   * Hides a horizontal tab pane.
   */
  tabHide: function () {
    // Hide this tab.
    this.item.addClass('horizontal-tab-hidden');
    // Update .first marker for items. We need recurse from parent to retain the
    // actual DOM element order as jQuery implements sortOrder, but not as public
    // method.
    this.item.parent().children('.horizontal-tab-button').removeClass('first')
      .filter(':visible:first').addClass('first');
    // Hide the fieldset.
    this.fieldset.addClass('horizontal-tab-hidden');
    // Focus the first visible tab (if there is one).
    var $firstTab = this.fieldset.siblings('.horizontal-tabs-pane:not(.horizontal-tab-hidden):first');
    if ($firstTab.length) {
      $firstTab.data('horizontalTab').focus();
    }
    return this;
  }
};

/**
 * Theme function for a horizontal tab.
 *
 * @param settings
 *   An object with the following keys:
 *   - title: The name of the tab.
 * @return
 *   This function has to return an object with at least these keys:
 *   - item: The root tab jQuery element
 *   - link: The anchor tag that acts as the clickable area of the tab
 *       (jQuery version)
 *   - summary: The jQuery element that contains the tab summary
 */
Drupal.theme.prototype.horizontalTab = function (settings) {
  var tab = {};
  tab.item = $('<li class="horizontal-tab-button" tabindex="-1"></li>')
    .append(tab.link = $('<a href="#"></a>')
      .append(tab.title = $('<strong></strong>').text(settings.title))
      .append(tab.summary = $('<span class="summary"></span>')
    )
  );
  return tab;
};

})(jQuery);
;