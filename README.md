# Widget_GitHub_Organization

[![Join the chat at https://gitter.im/bobboteck/Widget_GitHub_Organization](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bobboteck/Widget_GitHub_Organization?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) 

For any questions you can use Gitter, to ask me! But if you want to report a problem or a bug, open an issue.

---
This is a **Wordpress Widget**, that show recent **GitHub events** of a specific **Organization**

The widget is currently in development, checks the version available in the repository, to learn about the features that are currently available.
*Any support or collaboration* in development of Widgets are welcome, you can contact me at my email address (roberto.damico@officinerobotiche.it), just to tell me you're using the widget and appreciate the work that has been done so far.
If you want to report *bugs*, *malfunctions*, *make a request to add or change functionality*, I ask you to use the system of **[Issue](https://github.com/bobboteck/Widget_GitHub_Organization/issues)** offered by GitHub.


##Versions
Version 0.8.0 - Added mangment for event type: GollumEvent, WatchEvent

Version 0.7.0 - Improved performance:
- Using the asynchronous call to github  
- Querying a specific number of events, according to the widget settings
- Using the min version of JS library for the widget. The vesione extended is used by the HTML page Test_WGO.html
- Removed the use of external library JQuery 

Version 0.6.0 - Added managment for event type: PullRequest

Version 0.5.0 - Added managment for event type: IssueComment

Version 0.4.0 - Added managment for event type: Issue

Version 0.3.1 - Modified the graphic display of events and added a parameter to set the maximum number of visible Commit for each event

Version 0.3.0 - Added event management for type: CreateEvent

Version 0.2.0 - Working, manages only events commit

In the image below you can see the example of Widget in action
![alt tag](https://github.com/bobboteck/Widget_GitHub_Organization/blob/master/img/Widget-in-action.png)

##Installation

The widget is not currently present in the official repositories of **Wordpress**, if you want to install it, you can follow the steps in the **[Wiki](https://github.com/bobboteck/Widget_GitHub_Organization/wiki)**

###Easy testing
You can simply testing the widget functionality on your PC, by opening the file **Test_WGO.html** content in the project.

###External component
This Widget usign:
- ~~JQuery (http://jquery.com/)~~
- GitHub Octicons (https://octicons.github.com/)
