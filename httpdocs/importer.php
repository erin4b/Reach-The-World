<?php

/**
 * @file
 * The PHP page that serves all page requests on a Drupal installation.
 *
 * The routines here dispatch control to the appropriate handler, which then
 * prints the appropriate page.
 *
 * All Drupal code is released under the GNU General Public License.
 * See COPYRIGHT.txt and LICENSE.txt.
 */

/**
 * Root directory of Drupal installation.
 */
define('DRUPAL_ROOT', getcwd());

require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
require_once DRUPAL_ROOT . '/' . variable_get('password_inc', 'includes/password.inc');

/*
$data = file_get_contents("http://reachtheworld.org/export.php?p=password&c=users");
$users = json_decode($data);
foreach($users AS $user){
  if($user->name != ''){
    $user_obj = user_load_by_name($user->name);

    $hashed_pass = user_hash_password($user->pass, 11);
    if ($hashed_pass) {
      $hashed_pass  = 'U' . $hashed_pass;

      $acct = array(
        'name' => $user->name,
        'mail' => $user->mail,
        'created' => $user->created,
        'access' => $user->access,
        'login' => $user->login,
        'status' => $user->status,
        'timezone' => $user->timezone_name,
        'roles' => array(),
        'field_user_first_name' => array(),
        'field_user_last_name' => array()
      );

      if(isset($user->profile_first_name))
        $acct['field_user_first_name'][LANGUAGE_NONE]['0']['value'] = $user->profile_first_name;
      if(isset($user->profile_last_name))
        $acct['field_user_last_name'][LANGUAGE_NONE]['0']['value'] = $user->profile_last_name;

      foreach($user->roles AS $role){
        $r = user_role_load_by_name($role);
        $acct['roles'][$r->rid] = $r->name;
      }
      user_save($user_obj, $acct);
      db_update('users')->fields(array('pass' => $hashed_pass))->condition('uid', $user_obj->uid)->execute();
    }
  }
}
*/

$data = file_get_contents("http://reachtheworld.org/export.php?p=password&c=journey&id=52545");
$journeys = json_decode($data);
foreach($journeys AS $journey){
  $q = db_select('node_transfer','nt')->fields('nt')->condition('onid',$journey->nid)->execute();
  if($q->rowCount() > 0){
    $row = $q->fetchObject();
    $node = node_load($row->nnid);
  }else{
    $node = new stdClass;
    $node->title = $journey->title;
    $node->type = 'journey';
    node_object_prepare($node);
  }

  $user = user_load_by_name($journey->name);
  profile2_load_by_user($user, $type_name = NULL);

  $node->language = LANGUAGE_NONE;
  $node->uid = $user->uid;
  $node->name = $user->name;
  $node->status = $journey->status;
  $node->promote = $journey->promote;
  $node->comment = $journey->comment;

  node_submit($node);
  node_save($node);

  db_merge('node_transfer')
    ->key(array('nnid'=>$node->nid))
    ->fields(array('onid'=>$journey->nid))
    ->execute();
  foreach($journey->og_content AS $content){
    switch($content->type){
      case 'journey_info':
        $node->body[LANGUAGE_NONE][0]['value'] = $content->field_journey_description[0]->value;
        node_submit($node);
        node_save($node);
      break;

      case 'profile':
        //print_r($content);
        print_r($user);
      break;
    }
  }
}
