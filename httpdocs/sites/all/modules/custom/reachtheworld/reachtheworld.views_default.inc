<?php

/**
 * Implements hook_views_default_views()
 **/
function reachtheworld_views_default_views(){
  $views = array();

  $view = new view();
  $view->name = 'article_images';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Article Images';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'none';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['style_plugin'] = 'grid';
  $handler->display->display_options['style_options']['columns'] = '5';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* Footer: Global: Block area */
  $handler->display->display_options['footer']['block']['id'] = 'block';
  $handler->display->display_options['footer']['block']['table'] = 'views';
  $handler->display->display_options['footer']['block']['field'] = 'block';
  $handler->display->display_options['footer']['block']['empty'] = TRUE;
  $handler->display->display_options['footer']['block']['block_to_insert'] = 'reachtheworld:rtw_image_block';
  $handler->display->display_options['footer']['block']['title'] = '<none>';
  /* Relationship: Content: Images (field_page_images) */
  $handler->display->display_options['relationships']['field_page_images_value']['id'] = 'field_page_images_value';
  $handler->display->display_options['relationships']['field_page_images_value']['table'] = 'field_data_field_page_images';
  $handler->display->display_options['relationships']['field_page_images_value']['field'] = 'field_page_images_value';
  $handler->display->display_options['relationships']['field_page_images_value']['required'] = TRUE;
  $handler->display->display_options['relationships']['field_page_images_value']['delta'] = '-1';
  /* Field: Field collection item: Image */
  $handler->display->display_options['fields']['field_image']['id'] = 'field_image';
  $handler->display->display_options['fields']['field_image']['table'] = 'field_data_field_image';
  $handler->display->display_options['fields']['field_image']['field'] = 'field_image';
  $handler->display->display_options['fields']['field_image']['relationship'] = 'field_page_images_value';
  $handler->display->display_options['fields']['field_image']['label'] = '';
  $handler->display->display_options['fields']['field_image']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_image']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_image']['type'] = 'lightbox2__lightbox__thumbnail__original';
  $handler->display->display_options['fields']['field_image']['settings'] = array(
    'image_style' => '',
    'image_link' => '',
  );
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Contextual filter: Content: Nid */
  $handler->display->display_options['arguments']['nid']['id'] = 'nid';
  $handler->display->display_options['arguments']['nid']['table'] = 'node';
  $handler->display->display_options['arguments']['nid']['field'] = 'nid';
  $handler->display->display_options['arguments']['nid']['default_action'] = 'default';
  $handler->display->display_options['arguments']['nid']['default_argument_type'] = 'node';
  $handler->display->display_options['arguments']['nid']['summary']['number_of_records'] = '0';
  $handler->display->display_options['arguments']['nid']['summary']['format'] = 'default_summary';
  $handler->display->display_options['arguments']['nid']['summary_options']['items_per_page'] = '25';
  /* Contextual filter: Field collection item: Page (field_page) */
  $handler->display->display_options['arguments']['field_page_value']['id'] = 'field_page_value';
  $handler->display->display_options['arguments']['field_page_value']['table'] = 'field_data_field_page';
  $handler->display->display_options['arguments']['field_page_value']['field'] = 'field_page_value';
  $handler->display->display_options['arguments']['field_page_value']['relationship'] = 'field_page_images_value';
  $handler->display->display_options['arguments']['field_page_value']['default_action'] = 'default';
  $handler->display->display_options['arguments']['field_page_value']['default_argument_type'] = 'php';
  $handler->display->display_options['arguments']['field_page_value']['default_argument_options']['code'] = '$view->filter[0][\'value\'] = $_GET[\'page\'];';
  $handler->display->display_options['arguments']['field_page_value']['summary']['number_of_records'] = '0';
  $handler->display->display_options['arguments']['field_page_value']['summary']['format'] = 'default_summary';
  $handler->display->display_options['arguments']['field_page_value']['summary_options']['items_per_page'] = '25';
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;

  $views['article_images'] = $view;


  return $views;
}

?>
