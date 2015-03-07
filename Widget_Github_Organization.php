<?php
/*
Plugin Name: Widget GitHub Organization
Plugin URI: http://www.officinerobotiche.it/
Description: This Wordpress Widget show recent GitHub events of a specific Organization
Version: 0.2.0
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
echo '<link rel="stylesheet" href="' . plugins_url( 'css/style.css', __FILE__ ) . '" > ';
?>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<?php
echo '<script src="' . plugins_url( 'js/script.js', __FILE__ ) . '"></script>';
?>
<script type="text/javascript">
$(document).ready(function() {
	var itemNumber = <?php echo $itemCount ?>;
	var itemCommit = 3;
	var organizationName = "<?php echo $organization ?>";

	var goem = new GithubOrganizationEventManager(organizationName);
	goem.ItemToDisplay = itemNumber;
	goem.TargetElement = "#target";
	//goem.CommitEventMaxItemToDisplay = itemCommit;
	goem.GetData();
	goem.BindData();
});
</script>
<div id="target"></div>
<?php
        //FINE WIDGET
 
        echo $after_widget;
    }
}

add_action( 'widgets_init', create_function('', 'return register_widget("Widget_Github_Organization");') );
?>
