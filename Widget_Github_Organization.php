<?php
/*
Plugin Name: Widget GitHub Organization Event Traking 
Plugin URI: http://www.officinerobotiche.it/
Description: This Wordpress Widget show recent GitHub events of a specific Organization
Version: 0.0.1
Author: Roberto D'Amico
Author URI: http://www.officinerobotiche.it/
*/
class GithubOrganizationEventTraking extends WP_Widget {
    function GithubOrganizationEventTraking() {
        parent::__construct(
			// Base ID of your widget
			'RDA_GOET', 
			// Widget name will appear in UI
			__('Officine Robotiche - GithHub Organization Event Traking', 'RDA_GOET_OfficineRobotiche'), 
			// Widget description
			array( 'description' => __( 'Widget used to show last event in the Organization GitHub', 'RDA_GOET_OfficineRobotiche' ), ) 
		);
    }

    function widget($args, $instance) {
		// Widget variables
		$title = apply_filters( 'widget_title', $instance['title'] );
		$organization = apply_filters( 'widget_organization', $instance['organization'] );
		$itemCount = apply_filters( 'widget_itemCount', $instance['itemCount'] );
        echo $args['before_widget'];
  
        //INIZIO WIDGET
?>
<link rel="stylesheet" href="octicons/octicons.css">
<style>
#target {}
.wgo_title {}
.event_container {clear:both;}
.left_info {width:34px;margin-right:5px;float:left;}
.author {height:34px;}
.author img {border-radius:3px;margin:2px}
.icon {text-align:center;}
.date {text-align:center;}
.right_info {margin-right:5px;}
</style>
<script type="text/javascript">
$(document).ready(function() {
	var itemNumber = <?php echo $itemCount ?>;
	var organizationName = "<?php echo $organization ?>";
	var gitData = GetGithubData(organizationName);
	
	for(i=0;i<10;i++)
	{
		var gitEvent = '<div class="event_container">';
		gitEvent += ActivityAuthor(gitData[i]);
		gitEvent += ActivityOperation(gitData[i]);
		gitEvent += '</div>';
		
		$("#target").append(gitEvent);
	}
});

function GetGithubData(organization)
{
	var xhr = new XMLHttpRequest();
	xhr.dataType = "json";
	xhr.open("GET", "https://api.github.com/orgs/" + organization + "/events", false);
	xhr.setRequestHeader('Accept','application/vnd.github.v3.raw+json');
	xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
	xhr.send(null);
	
	var jsonData = JSON.parse(xhr.response);
	
	return jsonData;
}

function ActivityAuthor(data)
{
	var authorData = '<div class="left_info"><div class="author"><img src="' + data.actor.avatar_url + 's=30" alt="' + data.actor.login + '" />';
	
	switch (data.type)
	{
		case "PushEvent":
			authorData += '</div><div class="icon"><span class="octicon octicon-git-commit" title="Commit"></span></div>';
		break;
		//...
		default:
			authorData += '</div><div class="icon"><span class="octicon octicon-flame" title="Flame"></span></div>';
		break;
	}
	
	var monthNames = [ "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dec" ];
	var date=new Date(data.created_at);
	authorData += '<div class="date">' + date.getDate() + ' ' + monthNames[date.getMonth()] + '</div></div>';
		
	return authorData;
}

function ActivityOperation(data)
{
	var operationData = '<div class="right_info">';
	
	switch (data.type)
	{
		case "PushEvent":
			var branch = data.payload.ref.replace("refs/heads/","");
			operationData += 'pushed to branch: <a href="' + branchUrl(data.repo.url, branch) + '">' + branch + '</a><br />';
			operationData += 'of repository: <a href="' + replaceAPIUrl(data.repo.url) + '">' + data.repo.name + '</a><br />';
			operationData += '<a href="' + commitUrl(data.payload.commits[0].url) + '">' + data.payload.commits[0].message + '</a>'; //I commit potrebbero essere anche di più di uno
		break;
		//...
		default:
			operationData += '<span class="octicon octicon-flame" title="Flame"></span>';
		break;
	}
	
	operationData += '</div>';
	
	return operationData;
}

function replaceAPIUrl(url)
{
	return url.replace("https://api.github.com/repos/","https://github.com/");
}

function branchUrl(url, branchName)
{
	var newUrl = replaceAPIUrl(url);
	newUrl += "/tree/" + branchName;
	return newUrl;
}

function commitUrl(url)
{
	var newUrl = replaceAPIUrl(url);
	newUrl = newUrl.replace("commits","commit");
	return newUrl;
}
</script>
<div id="target">
	<div class="wgo_title"><?php echo $title ?></div>
</div>
<?php
        //FINE WIDGET
 
        echo $args['after_widget'];
    }
    
    function update($new_instance, $old_instance) {
        return $new_instance;
    }
    
    function form($instance) {
        //$title = esc_attr($instance['title']);
        
        /* Impostazioni di default del widget */
		$defaults = array(
            'title' => 'GithHub Organization Event Traking',
            'organization' => '',
            'itemnum' => 10
        );
 
		$instance = wp_parse_args((array)$instance, $defaults);
?>
<p>
	<label for="<?php echo $this->get_field_id('title');?>">
	Title: <input class="widefat" id="<?php echo $this-/>get_field_id('title');?>" name="<?php echo $this->get_field_name('title');?>" type="text" value="<?php echo $title; ?>" />
	</label>
</p>
<p>
	<label for="<?php echo $this->get_field_id('organization');?>">
	Organization: <input class="widefat" id="<?php echo $this-/>get_field_id('organization');?>" name="<?php echo $this->get_field_name('organization');?>" type="text" value="<?php echo $organization; ?>" />
	</label>
</p>
<p>
	<label for="<?php echo $this->get_field_id('itemCount');?>">
	Item to show: <input class="widefat" id="<?php echo $this-/>get_field_id('itemCount');?>" name="<?php echo $this->get_field_name('itemCount');?>" type="text" value="<?php echo $itemCount; ?>" />
	</label>
</p>
<?php
    }
}
 
function load_widget() {
    register_widget('RDA_GOET');
}
 
add_action('widgets_init', 'load_widget');
?>
