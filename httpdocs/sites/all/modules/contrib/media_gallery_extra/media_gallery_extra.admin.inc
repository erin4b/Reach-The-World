<?php

/**
 * @file
 * Admin page callbacks for the media gallery extra module.
 */

/**
 * Menu callback; Admin settings form.
 *
 * @see media_gallery_extra_admin_form_submit().
 */
function media_gallery_extra_admin_form() {
  $form = array();

  $field_prefix = '';
  $file_default_scheme = variable_get('file_default_scheme', 'public');
  if ($file_default_scheme == 'public') {
    $field_prefix = url(NULL, array('absolute' => FALSE)) . variable_get('file_public_path', conf_path() . '/files') . '/';
  }
  else if ($file_default_scheme == 'private') {
    $field_prefix = variable_get('file_private_path', '') . DIRECTORY_SEPARATOR;
  }

  $form['file'] = array(
    '#type' => 'fieldset',
    '#title' => t('File system'),
  );

  $form['file']['media_gallery_extra_root_directory'] = array(
    '#type' => 'textfield',
    '#title' => t('Galleries root directory'),
    '#default_value' => variable_get('media_gallery_extra_root_directory', ''),
    '#description' => t('Optional subdirectory in the file upload directory where gallery media will be stored. Do not include preceding or trailing slashes.'),
    '#element_validate' => array('_media_gallery_extra_settings_file_directory_validate'),
    '#field_prefix' => $field_prefix,
  );

  if (module_exists('media_gallery_directory')) {
    $tip = t('<strong>Note</strong>: You can configure pattern for automatic gallery subdirectory paths on the <a href="@url">directory pattern configuration page</a>.', array('@url' => url('admin/config/media/gallery/directory')));
  }
  else {
    $tip = t('<strong>Note</strong>: You can enable <em>Media Gallery Directory</em> module to configure a subdirectory path per gallery.');
  }
  $form['file']['tip'] = array('#markup' => $tip);


  $form['personalization'] = array(
    '#type' => 'fieldset',
    '#title' => t('Personalization'),
  );

  $form['personalization']['media_gallery_extra_license_enable'] = array(
    '#type' => 'checkbox',
    '#title' => t('Enable media license'),
    '#description' => t('Uncheck this box to disable the <em>License settings for this image</em> field of the media form.'),
    '#default_value' => variable_get('media_gallery_extra_license_enable', 1),
  );

  $form['personalization']['media_gallery_extra_block_enable'] = array(
    '#type' => 'checkbox',
    '#title' => t('Enable gallery blocks'),
    '#description' => t('Uncheck this box to disable the <em>Blocks settings</em> of the gallery form.'),
    '#default_value' => variable_get('media_gallery_extra_block_enable', 1),
  );

  $form['personalization']['media_gallery_extra_block_access'] = array(
    '#type' => 'radios',
    '#title' => t('Who can create gallery blocks?'),
    '#default_value' => variable_get('media_gallery_extra_block_access', 1),
    '#options' => array(
      0 => t('Administrators only'),
      1 => t('Gallery author (<em>default</em>)'),
    ),
    '#description' => t("Select 'Administrators only' to restrict the ability to create gallery blocks to users with the <em>Administer blocks</em> permission."),
    '#states' => array(
      'invisible' => array(
        'input[name="media_gallery_extra_block_enable"]' => array('checked' => FALSE),
      ),
    ),
  );

  $form['features'] = array(
    '#type' => 'fieldset',
    '#title' => t('Extra features'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#tree' => TRUE,
    '#weight' => 99,
  );

  // We need this for finding out which submodules are enabled/disabled
  $files = system_rebuild_module_data();

  // List features
  foreach (media_gallery_extra_features_list() as $module) {
    if (isset($files[$module])) {
      $info = $files[$module]->info;
      $form['features'][$module] = array(
        '#type' => 'checkbox',
        '#title' => $info['name'],
        '#description' => $info['description'],
        '#default_value' => !empty($files[$module]->status),
      );
    }
  }

  $form['actions'] = array('#type' => 'actions');
  $form['actions']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save configuration'),
    '#weight' => 100,
  );

  return $form;
}

/**
 * Form submission handler for media_gallery_extra_admin_form().
 */
function media_gallery_extra_admin_form_submit($form, &$form_state) {
  if (isset($form_state['values']['features'])) {
    $enable = array();
    $disable = array();
    $module_list = module_list();
    foreach ($form_state['values']['features'] as $module_name => $checked) {
      if ($checked && empty($module_list[$module_name])) {
        $enable[] = $module_name;
      }
      else if (!$checked && !empty($module_list[$module_name])) {
        $disable[] = $module_name;
      }
    }
    $flush_cache = FALSE;
    if (count($enable) > 0) {
      module_enable($enable);
      drupal_set_message(t('Installed modules: !module-list.', array('!module-list' => implode(', ', $enable))));
      $flush_cache = TRUE;
    }
    if (count($disable) > 0) {
      module_disable($disable);
      drupal_set_message(t('Disabled modules: !module-list.', array('!module-list' => implode(', ', $disable))));
      $flush_cache = TRUE;
    }
    if ($flush_cache) {
      drupal_flush_all_caches();
    }
    unset($form_state['values']['features']);
  }
  system_settings_form_submit($form, $form_state);
}

/**
 * Element validate callback for the file destination field.
 *
 * Remove slashes from the beginning and end of the destination value and ensure
 * that the file directory path is not included at the beginning of the value.
 */
function _media_gallery_extra_settings_file_directory_validate($element, &$form_state) {
  // Strip slashes from the beginning and end of $widget['file_directory'].
  $value = trim($element['#value'], '\\/');
  form_set_value($element, $value, $form_state);
}

/**
 * The Galleries settings page will just return the term edit form for the "all galleries" tid.
 */
function media_gallery_extra_admin_default_gallery_collection_settings() {
  $edit = media_gallery_get_default_gallery_collection();
  $form_state['build_info']['args'] = array($edit);
  form_load_include($form_state, 'inc', 'taxonomy', 'taxonomy.admin');
  return drupal_build_form('taxonomy_form_term', $form_state);
}
