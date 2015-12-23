<?php
/*
Plugin Name: Widget GitHub Organization
Plugin URI: https://github.com/bobboteck/Widget_GitHub_Organization
Description: This Wordpress Widget show recent GitHub events of a specific Organization
Version: 0.8.1
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
            'itemCount' => 10,
            'commitMaxItem' => 2
        );
 
		$instance = wp_parse_args((array)$instance, $defaults);
		$title = $instance['title'];
		$organization = $instance['organization'];
		$itemCount = $instance['itemCount'];
		$commitMaxItem = $instance['commitMaxItem'];
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
<p>
	<label for="<?php echo $this->get_field_id('commitMaxItem');?>">
	Max number of Commit item to show for one event: <input class="widefat" id="<?php echo $this->get_field_id('commitMaxItem');?>" name="<?php echo $this->get_field_name('commitMaxItem');?>" type="text" value="<?php echo $commitMaxItem; ?>" />
	</label>
</p>
<?php
    }

    function update($new_instance, $old_instance) 
    {
        $instance = $old_instance;
		$instance['title'] = $new_instance['title'];
		$instance['organization'] = $new_instance['organization'];
		$instance['itemCount'] = $new_instance['itemCount'];
		$instance['commitMaxItem'] = $new_instance['commitMaxItem'];
		return $instance;
    }

    function widget($args, $instance) 
    {
		extract($args, EXTR_SKIP);
		
		echo $before_widget;
		
		$title = empty($instance['title']) ? ' ' : apply_filters('widget_title', $instance['title']);
		$organization = empty($instance['organization']) ? 'officinerobotiche' : $instance['organization'];
		$itemCount = empty($instance['itemCount']) ? '10' : $instance['itemCount'];
		$commitMaxItem = empty($instance['commitMaxItem']) ? '10' : $instance['commitMaxItem'];
  
		if (!empty($title))
			echo $before_title . $title . $after_title;
  
        //INIZIO WIDGET
?>
<?php
echo '<link rel="stylesheet" href="' . plugins_url( 'octicons/octicons.css', __FILE__ ) . '" > ';
echo '<link rel="stylesheet" href="' . plugins_url( 'css/style.css', __FILE__ ) . '" > ';
echo '<script src="' . plugins_url( 'js/githuborganization.min.js', __FILE__ ) . '"></script>';
?>
<div id="GitHubOrgContainer"></div>
<script type="text/javascript">
var organizationName = "<?php echo $organization ?>";
var jParameters = {ItemToDisplay:<?php echo $itemCount ?>, CommitEventMaxItemToDisplay:<?php echo $commitMaxItem ?>};
var goem = new GithubOrganizationEventManager("GitHubOrgContainer", organizationName, jParameters);
goem.GetData();
</script>
<?php
        //FINE WIDGET
 
        echo $after_widget;
    }
}

add_action( 'widgets_init', create_function('', 'return register_widget("Widget_Github_Organization");') );
?>
