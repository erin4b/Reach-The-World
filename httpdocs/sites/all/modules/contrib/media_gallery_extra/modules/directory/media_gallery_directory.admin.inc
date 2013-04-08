<?php

/**
 * @file
 * Admin page callbacks for the media gallery directory module.
 */

/**
 * Menu callback; Admin settings form.
 */
function media_gallery_directory_admin_settings() {
  $form = array();

  $description = t('Define the patterns to create directory paths for galleries. Leave empty to disable this feature.');
  $examples = '<p>' . t('Examples of patterns:') . '</p>';
  $examples .= '<dl>';
  $examples .= '<dt><code>[node:title]</code></dt>';
  $examples .= '<dd>' . t('A directory per gallery and use the title as directory name (e.g. <code>GALLERIES_ROOT_DIR/title/</code>) (<em>default pattern</em>).') . '</dd>';
  $examples .= '<dt><code>[node:author]</code></dt>';
  $examples .= '<dd>' . t('A directory per user (e.g. <code>GALLERIES_ROOT_DIR/username/</code>).') . '</dd>';
  $examples .= '<dt><code>[node:author]/[node:title]</code></dt>';
  $examples .= '<dd>' . t('A directory per user and subdirectory per gallery (e.g. <code>GALLERIES_ROOT_DIR/username/title/</code>).') . '</dd>';
  $examples .= '<dt><code>[node:created:custom:Y]/[node:created:custom:m]/[node:title]</code></dt>';
  $examples .= '<dd>' . t('A directory based on current date with format yy/mm/dd (e.g. <code>GALLERIES_ROOT_DIR/2012/04/title/</code>).') . '</dd>';
  $examples .= '<dt><code>photos_[current-date:raw]</code></dt>';
  $examples .= '<dd>' . t('A directory per gallery and use the current timestamp as directory name (e.g. <code>GALLERIES_ROOT_DIR/photos_1333469609/</code>).') . '</dd>';

  $form['media_gallery_directory_pattern'] = array(
    '#type' => 'textfield',
    '#title' => t('Pattern for gallery media directory path'),
    '#description' => $description . $examples,
    '#default_value' => variable_get('media_gallery_directory_pattern', MEDIA_GALLERY_DIRECTORY_DEFAULT_PATTERN),
    //'#element_validate' => array('_media_gallery_extra_settings_file_directory_validate'),
  );

  if (module_exists('token')) {
    $form['media_gallery_directory_pattern']['#element_validate'][] = 'token_element_validate';
    $form['media_gallery_directory_pattern']['#token_types'] = array('node');
    $form['media_gallery_directory_pattern_replacement'] = array(
      '#type' => 'fieldset',
      '#title' => t('Replacement patterns'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#theme' => 'token_tree',
      '#token_types' => array('node'),
      '#global_types' => TRUE,
      '#click_insert' => TRUE,
    );
  }

  $form['settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Replacement settings'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );

  $form['settings']['media_gallery_directory_separator'] = array(
    '#type' => 'textfield',
    '#title' => t('Separator'),
    '#size' => 1,
    '#maxlength' => 1,
    '#default_value' => variable_get('media_gallery_directory_separator', '_'),
    '#description' => t('Character used to separate words in directory path. This will replace any spaces and punctuation characters.'),
  );

  $form['settings']['media_gallery_directory_lowercase'] = array(
    '#type' => 'radios',
    '#title' => t('Character lower case'),
    '#default_value' => variable_get('media_gallery_directory_lowercase', TRUE),
    '#options' => array(
      0 => t('Leave case the same as source token values.'),
      1 => t('Change to lower case'),
    ),
  );

  $form['settings']['media_gallery_directory_pattern_update_action'] = array(
    '#type' => 'radios',
    '#title' => t('Update action'),
    '#default_value' => variable_get('media_gallery_extra_directory_pattern_update_action', MEDIA_GALLERY_DIRECTORY_UPDATE_ACTION_KEEP),
    '#options' => array(
      MEDIA_GALLERY_DIRECTORY_UPDATE_ACTION_KEEP => t('Keep the original directory path.'),
      MEDIA_GALLERY_DIRECTORY_UPDATE_ACTION_LEAVE => t('Create a new directory and leave the existing files intact.'),
      //MEDIA_GALLERY_DIRECTORY_UPDATE_ACTION_MOVE => t('Create a new directory and move uploaded files to new directory. (Not recommended).'),
    ),
    '#description' => t('What should be done when updating an existing gallery which already has a directory?'),
  );

  if (module_exists('transliteration')) {
    $form['settings']['media_gallery_directory_transliterate'] = array(
      '#type' => 'checkbox',
      '#title' => t('Replace unwanted characters'),
      '#default_value' => variable_get('media_gallery_directory_transliterate', FALSE),
      '#description' => t('When a pattern includes certain characters (such as those with accents) should Pathauto attempt to transliterate them into the ASCII-96 alphabet? Transliteration is handled by the Transliteration module.'),
    );
  }
  else {
    $form['settings']['transliteration_tip'] = array(
      '#markup' => t('<strong>Note</strong>: you can use <a href="@url">Transliteration</a> module to replace unwanted characters (like accents or apostrophes) to ASCII characters.', array('@url' => 'http://drupal.org/project/transliteration')),
    );
  }

//   $form['bulk'] = array(
//     '#type' => 'fieldset',
//     '#title' => t('Bulk update'),
//     '#description' => t(''),
//     '#collapsible' => TRUE,
//     '#collapsed' => TRUE,
//   );

//   $form['bulk']['update'] = array(
//     '#type' => 'submit',
//     '#value' => t('Update all media gallery directory'),
//     '#submit' => array('media_gallery_directory_admin_bulk_update_submit'),
//   );

  return system_settings_form($form);
}

/**
 * Form submission handler for bulk update button on
 * media_gallery_directory_admin_settings().
 */
function media_gallery_directory_admin_bulk_update_submit($form, &$form_state) {
  // send the user to the confirmation page
  $form_state['redirect'] = 'admin/config/media/gallery/directory/bulk-update';
}
