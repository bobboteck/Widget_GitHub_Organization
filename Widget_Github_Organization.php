<?php
/*
Plugin Name: Widget GitHub Organization
Plugin URI: http://www.officinerobotiche.it/
Description: This Wordpress Widget show recent GitHub events of a specific Organization
Version: 0.1.1
Author: Roberto D'Amico
Author URI: http://www.officinerobotiche.it/
*/
class Widget_Github_Organization extends WP_Widget 
{
    function Widget_Github_Organization() 
    {
		$widget_ops = array('classname' => 'Widget_Github_Organization', 'description' => 'Widget used to show last event in the Organization GitHub' );
		$this->WP_Widget('Widget_Github_Organization', 'GithHub Organization Event Traking', $widget_ops);
    }

    function form($instance) 
    {
        /* Impostazioni di default del widget */
		$defaults = array(
            'title' => 'GithHub Organization Event Traking',
            'organization' => '',
            'itemCount' => 10
        );
 
		$instance = wp_parse_args((array)$instance, $defaults);
		$title = $instance['title'];
		$organization = $instance['organization'];
		$itemCount = $instance['itemCount'];
?>
<p>
	<label for="<?php echo $this->get_field_id('title');?>">
	Title: <input class="widefat" id="<?php echo $this->get_field_id('title');?>" name="<?php echo $this->get_field_name('title');?>" type="text" value="<?php echo $title; ?>" />
	</label>
</p>
<p>
	<label for="<?php echo $this->get_field_id('organization');?>">
	Organization: <input class="widefat" id="<?php echo $this->get_field_id('organization');?>" name="<?php echo $this->get_field_name('organization');?>" type="text" value="<?php echo $organization; ?>" />
	</label>
</p>
<p>
	<label for="<?php echo $this->get_field_id('itemCount');?>">
	Item to show: <input class="widefat" id="<?php echo $this->get_field_id('itemCount');?>" name="<?php echo $this->get_field_name('itemCount');?>" type="text" value="<?php echo $itemCount; ?>" />
	</label>
</p>
<?php
    }

    function update($new_instance, $old_instance) 
    {
        $instance = $old_instance;
		$instance['title'] = $new_instance['title'];
		$instance['organization'] = $new_instance['organization'];
		$instance['itemnum'] = $new_instance['itemnum'];
		return $instance;
    }

    function widget($args, $instance) 
    {
		extract($args, EXTR_SKIP);
		
		echo $before_widget;
		
		$title = empty($instance['title']) ? ' ' : apply_filters('widget_title', $instance['title']);
		$organization = empty($instance['organization']) ? 'officinerobotiche' : $instance['organization'];
		$itemCount = empty($instance['itemCount']) ? '10' : $instance['itemCount'];
  
		if (!empty($title))
			echo $before_title . $title . $after_title;
  
        //INIZIO WIDGET
?>
<?php
echo '<link rel="stylesheet" href="' . plugins_url( 'octicons/octicons.css', __FILE__ ) . '" > ';
?>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<style>
#target {}
.event_container {clear:both;font-size:12px;}
.event_container a {font-weight:bold;}
.left_info {width:34px;margin-right:5px;float:left;}
.author {height:34px;}
.author img {border-radius:3px;margin:2px}
.icon {text-align:center;}
.date {text-align:center;font-size:10px;}
.right_info {margin-right:5px;}
.listCommit {padding-left:50px;margin:0;}
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
		gitEvent += ActivityOperation(gitData[i], organizationName);
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

function ActivityOperation(data, organization)
{
	var operationData = '<div class="right_info">';
	
	switch (data.type)
	{
		case "PushEvent":
			var branch = data.payload.ref.replace("refs/heads/","");
			operationData += 'pushed to branch: <a href="' + branchUrl(data.repo.url, branch) + '">' + branch + '</a><br />';
			operationData += 'of repository: <a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name, organization) + '</a><br />';
			//length
			operationData += '<ul class="listCommit">';
			for(var i=0;i<data.payload.commits.length;i++)
			{
				operationData += '<li><a href="' + commitUrl(data.payload.commits[i].url) + '">' + data.payload.commits[i].message + '</a> [' + data.payload.commits.length + ']</li>';
			}
			operationData += '</ul>';
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

function repositoryName(branchName, organization)
{
	return branchName.replace(organization + "/","");
}

function commitUrl(url)
{
	var newUrl = replaceAPIUrl(url);
	newUrl = newUrl.replace("commits","commit");
	return newUrl;
}
</script>
<div id="target"></div>
<?php
        //FINE WIDGET
 
        echo $after_widget;
    }
}

add_action( 'widgets_init', create_function('', 'return register_widget("Widget_Github_Organization");') );
?>
