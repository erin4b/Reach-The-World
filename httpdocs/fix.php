<?php

define('DRUPAL_ROOT','/home/orb/public_html/reachtheworld.org/httpdocs');

$_SERVER['REMOTE_ADDR'] = '';

require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
GLOBAL $user;

$query = db_select('field_config_instance','fci')
          ->fields('fci')
          ->condition('entity_type','node')
          ->execute();

while($row = $query->fetchObject()){
  $data = unserialize($row->data);
  if($data['widget']['type'] == 'text_textarea'){
    print $row->field_name;
    print_r($data);
    exit;
  }
}


?>
