(function ($) {

Drupal.behaviors.mediaGalleryDirectoryFieldsetSummaries = {
  attach: function (context) {
    $('fieldset.directory-form', context).drupalSetSummary(function (context) {
      if ($('#edit-media-gallery-directory-auto', context).attr('checked')) {
        return Drupal.t('Automatic path');
      } else if ($value = $('#edit-media-gallery-directory-und-0-value', context).val()) {
        return Drupal.checkPlain($value);
      } else {
        return Drupal.t('No gallery path');
      }
    });
  }
};

})(jQuery);
