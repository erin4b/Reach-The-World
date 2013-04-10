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

function get_by_old_node($onid){
  $q = db_select('node_transfer','nt')->fields('nt')->condition('onid',$onid)->execute();

  if($q->rowCount() > 0){
    return $q->fetchObject();
  }
  return FALSE;
}

function get_node($type=NULL,$nid=NULL){
  $row = get_by_old_node($nid);
  if($row !== FALSE){
    $node = node_load($row->nnid);
  }else{
    $node = new stdClass;
    $node->type = $type;
  }
  node_object_prepare($node);
  $node->language = LANGUAGE_NONE;
  return $node;
}

function save_node(&$node,$onid){
  node_submit($node);
  node_save($node);
  db_merge('node_transfer')
    ->key(array('nnid'=>$node->nid))
    ->fields(array('onid'=>$onid))
    ->execute();
}

$data = file_get_contents("http://reachtheworld.org/export.php?p=password&c=journey&id=52545,53530,52485");
$journeys = json_decode($data);
foreach($journeys AS $journey){
  $jnode = get_node('journey',$journey->nid);
  $jnode->title = $journey->title;

  $user = user_load_by_name($journey->name);
  $jnode->uid = $user->uid;
  $jnode->name = $user->name;
  $jnode->status = $journey->status;
  $jnode->promote = $journey->promote;
  $jnode->comment = $journey->comment;
  save_node($jnode,$journey->nid);

  foreach($journey->og_content AS $content){
    $user = user_load_by_name($content->name);
    switch($content->type){
      case 'journey_info':
        $jnode->body[LANGUAGE_NONE][0]['value'] = $content->field_journey_description[0]->value;
        node_submit($jnode);
        node_save($jnode);
      break;

      case 'profile':
        //$user = profile2_load_by_user($user);
      break;

      case "event":
        $enode = get_node('event',$content->nid);
        $enode->title = $content->title;
        $enode->uid = $user->uid;
        $enode->name = $user->name;
        $enode->body[LANGUAGE_NONE][0]['value'] = $content->body;
        $enode->status = $journey->status;
        $enode->promote = $journey->promote;
        $enode->comment = $journey->comment;
        $enode->field_date[LANGUAGE_NONE][0]['value'] = strtotime($content->field_date[0]->value);
        $enode->og_group_ref[LANGUAGE_NONE][0]['target_id'] = 
        //save_node($enode,$content->nid);
      break;

      case "fn_daily_life":
      case "fn_food":
      case "fn_kids_lives":
      case "fn_nations":
      case "fn_nature":
      case "fn_traditions":
      case "fn_transportation":
      case "fn_world_connections":
      case "itinerary_location":
      case "journal":
      case "log_book":
      case "photo_album":
      case "video":
      case "video_conference":
      case "video_gallery":
      break;
    }
  }
}
