<?php

/**
 * @file
 * Form alters of the media gallery extra module.
 */

/**
* Implements hook_form_alter().
*/
function media_gallery_extra_form_alter(&$form, &$form_state, $form_id) {}

/**
 * Implements hook_form_FORM_ID_alter().
 *
 * @see media_gallery_form_media_gallery_node_form_alter().
 */
function media_gallery_extra_form_media_gallery_node_form_alter(&$form, &$form_state, $form_id) {
  // Avoid Drupal.behaviors.menuFieldsetSummaries overrride
  $form['#attached']['js'] = array(drupal_get_path('module', 'media_gallery_extra') . '/media_gallery_extra.form.js');

  // Move block vertical tab to gallery settings fieldset
  $fieldset = array(
    'media_gallery_expose_block' => 'block',
    'media_gallery_block_columns' => 'block',
    'media_gallery_block_rows' => 'block',
  );
  foreach ($fieldset as $id => $subgroup) {
    $form['settings_wrapper'][$subgroup][$id] = $form[$subgroup][$id];
  }
  unset($form['block']);

  $form['settings_wrapper']['block']['#prefix'] = '<div class="block-settings settings-group hidden clearfix"><div class="group-label">' . t('Blocks settings') . '</div><div class="setting-icon"></div><div class="no-overflow">';
  $form['settings_wrapper']['block']['#suffix'] = '</div></div>';

  // Set block access
  $access = FALSE;
  if (variable_get('media_gallery_extra_block_enable', 1)) {
    $access = variable_get('media_gallery_extra_block_access', 1) ? TRUE : user_access('administer blocks');
  }
  $form['settings_wrapper']['block']['#access'] = $access;
}

/**
 * Implements hook_form_FORM_ID_alter().
 *
 * @see media_gallery_form_media_edit_alter().
 */
function media_gallery_extra_form_media_edit_alter(&$form, &$form_state, $form_id) {
  if (isset($form['field_license'])) {
    $form['field_license']['#access'] = variable_get('media_gallery_extra_license_enable', 1);
  }
}

/**
 * Implements hook_form_FORM_ID_alter().
 *
 * @see media_add_upload().
 * @see media_add_upload_validate().
 * @see media_add_upload_submit().
 */
function media_gallery_extra_form_media_add_upload_alter(&$form, &$form_state, $form_id) {
  // Nothing to do, media_add_upload_submit() respect $params['file_directory'].
}

/**
 * Implements hook_form_FORM_ID_alter().
 *
 * @see media_add_upload_multiple().
 * @see media_add_upload_multiple_submit().
 */
function media_gallery_extra_form_media_add_upload_multiple_alter(&$form, &$form_state, $form_id) {
  // Change default submit handler to respect $params['file_directory'].
  $form['#submit'] = array_diff($form['#submit'], array('media_add_upload_multiple_submit'));
  array_unshift($form['#submit'], 'media_gallery_extra_media_add_upload_multiple_submit');
}

/**
 * Implements hook_form_FORM_ID_alter().
 *
 * @see media_internet_add().
 * @see media_internet_add_validate().
 * @see media_internet_add_submit().
 */
function media_gallery_extra_form_media_internet_add_alter(&$form, &$form_state, $form_id) {
  // @todo Add support to $params['file_directory'].
}

/**
 * Override media_add_upload_multiple submit handler to respect
 * $params['file_directory'].
 *
 * @see media_gallery_extra_form_media_add_upload_multiple_alter().
 * @see media_add_upload_multiple_submit().
 *
 * @todo Submit patch to media-7.x-1.x module.
 */
function media_gallery_extra_media_add_upload_multiple_submit($form, &$form_state) {
  $params = $form_state['build_info']['args'][0];

  // Determine what URI scheme this file should use.
  $scheme = !empty($params['uri_scheme']) && file_stream_wrapper_valid_scheme($params['uri_scheme']) ? $params['uri_scheme'] : file_default_scheme();
  $scheme .= '://';

  // Prepare the file's subdirectory path.
  $directory = '';
  if (!empty($params['file_directory'])) {
    $directory = token_replace($params['file_directory']) . '/';

    // If the directory isn't writable, or doesn't exist and can't be created,
    // the upload will fail.
    $prepare_directory = file_stream_wrapper_uri_normalize($scheme . $directory);
    if (!file_prepare_directory($prepare_directory, FILE_CREATE_DIRECTORY)) {
      drupal_set_message(t('The file directory @dir does not exist or is not writable. Please contact an administrator.', array('@dir' => $prepare_directory)), 'error');
      return;
    }
  }

  $saved_files = array();
  // We can't use file_save_upload() because of http://www.jacobsingh.name/content/tight-coupling-no-not
  foreach ($form_state['values']['upload'] as $uploaded_file) {
    if ($uploaded_file['status'] == 'done') {
      $source = $uploaded_file['tmppath'];

      // Compose the file's permanent destination.
      $destination = file_stream_wrapper_uri_normalize($scheme . $directory . $uploaded_file['name']);

      // Rename it to its original name, and put it in its final home.
      // Note - not using file_move here because if we call file_get_mime
      // (in file_uri_to_object) while it has a .tmp extension, it horks.

      $destination = file_unmanaged_move($source, $destination, FILE_EXISTS_RENAME);

      $file = file_uri_to_object($destination);
      file_save($file);
      _media_gallery_extra_save_file_permanently($file);

      $saved_files[] = $file;
    }
    else {
      // @todo: move this to element validate or something.
      form_set_error('pud', t('The specified file %name could not be uploaded.', array('%name' => $uploaded_file['name'])));
    }
  }
  // Get a list of fids to pass back.
  $fids = array();
  foreach ($saved_files as $file) {
    $fids[] = $file->fid;
  }
  $form_state['redirect'] = array('media/browser', array('query' => array('render' => 'media-popup', 'fid' => $fids)));
}

/**
 * Function copied from media.module, to not break compatibility with media < 7.x-1.2
 */
function _media_gallery_extra_save_file_permanently($file) {
  if ($file->status < FILE_STATUS_PERMANENT) {
    $file->status = FILE_STATUS_PERMANENT;
    file_save($file);
  }
}
