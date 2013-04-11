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
//define('DRUPAL_ROOT', getcwd());
define('DRUPAL_ROOT','/home/orb/public_html/reachtheworld.org/httpdocs');

$_SERVER['REMOTE_ADDR'] = '';

require_once DRUPAL_ROOT . '/includes/bootstrap.inc';
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
require_once DRUPAL_ROOT . '/' . variable_get('password_inc', 'includes/password.inc');
GLOBAL $user;

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
  $types = node_type_get_types();
  if(!isset($types[$type]))
    return new stdClass;
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

$data = file_get_contents("http://reachtheworld.org/export.php?p=password&c=journeys");
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
  $jnode->created = $journey->created;
  $jnode->changed = $journey->changed;
  save_node($jnode,$journey->nid);

  $save_path = 'public://user/'.$user->uid;
  file_prepare_directory($save_path,FILE_CREATE_DIRECTORY);
  print "Saved Journey {$journey->nid}\r\n";
  foreach($journey->og_content AS $content){
    print "Saved {$content->type} {$content->nid}\r\n";
    $fields = array();
    $location_enabled = FALSE;

    $enode = get_node($content->type,$content->nid);
    $user = user_load_by_name($content->name);
    $enode->title = $content->title;
    $enode->uid = $user->uid;
    $enode->name = $user->name;
    $enode->status = $content->status;
    $enode->promote = $content->promote;
    $enode->comment = $content->comment;
    $enode->created = $content->created;
    $enode->changed = $content->changed;

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
        $enode->body[LANGUAGE_NONE][0]['value'] = $content->body;
        $enode->field_date[LANGUAGE_NONE][0]['value'] = strtotime($content->field_date[0]->value);
      break;

      case "fn_daily_life":
        $location_enabled = TRUE;
        $fields = array(
          'body' => 'abstract',
          'field_introduction' => 'field_intro',
          'field_full_name' => 'field_name',
          'field_where_you_live' => '',
          'field_family' => '',
          'field_transportation' => '',
          'field_clothing' => '',
          'field_free_time' => '',
          'field_language_hello' => '',
          'field_pets' => '',
          'field_you_traveled' => '',
          'field_work' => '',
          'field_say_to_us' => ''
        );
      break;

      case "fn_food":
        $location_enabled = TRUE;
        $fields = array(
          'body'=>'abstract',
          'field_introduction'=>'field_intro',
          'field_food' => '',
          'field_food_impression' => '',
          'field_food_prepared' => '',
          'field_food_environment' => '',
        );
      break;

      case "fn_kids_lives":
        $location_enabled = TRUE;
        $fields = array(
          'body'=>'abstract',
          'field_introduction'=>'field_intro',
          'field_meals' => '',
          'field_house' => '',
          'field_chores' => '',
          'field_jobs' => '',
          'field_school_time' => '',
          'field_school_travel' => '',
          'field_school_lunch' => '',
          'field_language' => '',
          'field_kids_school' => 'field_kids_names',
          'field_subjects' => '',
          'field_homework' => '',
          'field_after_school' => '',
          'field_celebrity' => '',
          'field_music' => '',
          'field_field_grow_up' => 'field_grow_up',
          'field_go_anywhere' => '',
          'field_think_about_us' => '',
          'field_questions_for_kids' => ''
        );
      break;

      case "fn_nations":
        $location_enabled = TRUE;
        $fields = array(
          'body'=>'abstract',
          'field_introduction'=>'field_intro',
        );
      break;

      case "fn_nature":
        $location_enabled = TRUE;
        $fields = array(
          'body'=>'abstract',
          'field_introduction'=>'field_intro',
          'field_community_need' => '',
          'field_need_cause' => '',
          'field_need_being_met' => ''
        );
      break;

      case "fn_traditions":
        $location_enabled = TRUE;
        $fields = array(
          'body'=>'abstract',
          'field_introduction'=>'field_intro',
          'field_tradition' => '',
          'field_community' => '',
          'field_environment_connection' => '',
        );
      break;

      case "fn_transportation":
        $location_enabled = TRUE;
        $fields = array(
          'body'=>'abstract',
          'field_introduction'=>'field_intro',
          'field_get_around' => '',
          'field_you_getting_around' => '',
          'field_connected_to_culture' => '',
        );
      break;

      case "fn_world_connections":
        $location_enabled = TRUE;
        $fields = array(
          'body' => 'abstract',
          'field_introduction' => 'field_intro',
          'field_special' => '',
          'field_parts_of_environment' => '',
          'field_challenges' => '',
          'field_adopting' => ''
        );
      break;

      case "journal":
        $location_enabled = TRUE;
        $fields = array(
          'body' => 'abstract',
        );
      break;

      case "log_book":
        $location_enabled = TRUE;
        $enode->field_local_time[LANGUAGE_NONE][0]['value'] = strtotime($content->field_local_time[0]->value);

        $fields = array(
          'body' => 'abstract',
          'field_time_zone' => '',
          'field_travel_distance' => '',
          'field_travel_so_far' => '',
          'field_mode_of_transportation' => '',
          'field_interesting_visit' => '',
          'field_other_travel_news' => '',
          'field_sunny_days' => '',
          'field_cloudy_days' => '',
          'field_rainy_days' => '',
          'field_snowy_days' => '',
          'field_windy_days' => '',
          'field_temperature' => '',
          'field_weather' => '',
          'field_animals' => '',
          'field_coolest_thing' => '',
          'field_other_nature_news' => '',
          'field_languages_spoken' => '',
          'field_money' => '',
          'field_bottle_of_water' => '',
          'field_best_meal' => '',
          'field_music_listened' => '',
          'field_most_fun' => '',
          'field_break' => '',
          'field_read' => '',
          'field_sports' => '',
          'field_arguments' => '',
          'field_other_our_news' => '',
        );
      break;

      case "photo_album":
        $location_enabled = TRUE;
      break;

      case "video":
        $location_enabled = TRUE;
        $enode->field_video = array(LANGUAGE_NONE => array());
        foreach($content->field_video AS $video){
          $url = str_ireplace(' ','%20',trim('http://www.reachtheworld.org/'.$video->filepath));
          $video = file_get_contents($url);
          $filename = drupal_basename($url);
          $destination = 'public://videos/original/'.$filename;
          $file = file_save_data($video,$destination);
          $enode->field_video[LANGUAGE_NONE][] = (array)$file;
        }
      break;

      case "video_conference":
        $enode->field_date[LANGUAGE_NONE][0]['value'] = strtotime($content->field_date[0]->value);
      break;

      case "video_gallery":
        $location_enabled = TRUE;
      break;
    }

    if($content->image_content > 0){
      $enode->field_images = array(LANGUAGE_NONE => array());
      foreach($content->image_content AS $image){
        $url = str_ireplace(' ','%20',trim('http://www.reachtheworld.org/'.$image->images->_original));
        $image = file_get_contents($url);
        $filename = drupal_basename($url);
        $destination = $save_path.'/'.$filename;
        $file = file_save_data($image,$destination);
        $enode->field_images[LANGUAGE_NONE][] = (array)$file;
      }

    }

    //CHECK IF LOCATION ENABLED FOR CONTENT TYPE
    if($location_enabled){
      if(sizeof($content->locations) > 0){
        $location = array((array)$content->locations[0]);
        $location[0]['locpick'] = (array)$location[0]['locpick'];
        unset($location[0]['lid']);
        $enode->field_location[LANGUAGE_NONE] = $location;
      }
    }

    // CHECK TO MAKE SURE THE type IS SET FOR THE OBJECT AND SAVE
    if(isset($enode->type)){
      // GO THROUGH THE FIELD MAPPINGS TO MAKE THE TRANSFER
      foreach($fields AS $new_field=>$old_field){
        //IF THE OLD FIELD ISNT SET THEN IT IS THE SAME AS THE NEW FIELD
        if($old_field == '') $old_field = $new_field;
        if(isset($content->$old_field)){
          $old_field_info = $content->$old_field;
          //D7 USES LANGUAGE ENCODED FIELDS HAVE TO USE LANGUAGE_NONE FOR LANGUAGE NEUTRAL FIELDS
          $tmp = array(LANGUAGE_NONE => array());
          foreach($old_field_info AS $of){
            $tmp[LANGUAGE_NONE][] = (array)$of;
          }
          $enode->$new_field = $tmp;
        }
      }
      //OG 7.2+ USES NID TO REFERENCE OG ID
      $enode->og_group_ref[LANGUAGE_NONE][0]['target_id'] = $jnode->nid;
      save_node($enode,$content->nid);
    }
  }
}
