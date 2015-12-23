=== Plugin Name ===
Contributors:
Donate link:
Tags: GitHub, Organization, Activity
Requires at least: 3.0.1
Tested up to: 4.4
Stable tag: 4.3
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

This Wordpress Widget show recent GitHub events of a specific Organization.

== Description ==

Simply add a Widget, in your Worpress site, to show recent GitHub activity of our Organiazion.

Configuration:
* Number of event to show
* Number of item to show for every Commit Item

== Installation ==

Use the classic procedure to install the plugin: 

1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Go in Appearance->Widget and add a Widget in zone you prefer
4. You can set a Widget Title 
5. Indicate the parameter Organization (required), here is inserted the identifier of the organization on GitHub

== Frequently Asked Questions ==

No FAQ actualy, for a question you can write a message to me.

== Screenshots ==

1. Show widget in action `/assets/Widget-in-action.png`
2. Widget settings `/assets/widget-settings.png`

== Changelog ==

= 0.8.0 = 
* Added mangment for event type: GollumEvent, WatchEvent

= 0.7.0 = 
Improved performance:
* Using the asynchronous call to github  
* Querying a specific number of events, according to the widget settings
* Using the min version of JS library for the widget. The vesione extended is used by the HTML page Test_WGO.html
* Removed the use of external library JQuery 

= 0.6.0 =
* Added managment for event type: PullRequest

= 0.5.0 =
* Added managment for event type: IssueComment

= 0.4.0 =
* Added managment for event type: Issue

= 0.3.1 =
* Modified the graphic display of events and added a parameter to set the maximum number of visible Commit for each event

= 0.3.0 =
* Added event management for type: CreateEvent

= 0.2.0 =
* Working, manages only events commit

= 0.1.0 =
* First commit, not stable
