/***
 * Name: GitHub Organization Event Traking
 * @author Roberto D'Amico [bobboteck(at)gmail.com]
 * @authoruri http://www.officinerobotiche.it/
 * @license GNU GPL V3
 * @version 0.8.1
 */

/***
 * @desc This is a script used for a Wordpress Widget that show recent GitHub events of a specific Organization
 * @costructor
 * @param container {String} - HTML object that contains the list of eventes
 * @param organization {String} - The identifier of organization on GitHub
 * @param parameters (optional) - object with following keys:
 * 	ItemToDisplay {Int} - Number of item to show in the list event (default value is 10)
 * 	CommitEventMaxItemToDisplay {Int} - Number of max item to show in the commit event (default value is 2)
 */
var GithubOrganizationEventManager = (function(container, organization, parameters)
{
	parameters = parameters || {};
	var ItemToDisplay = (undefined === parameters.ItemToDisplay ? 10 : parameters.ItemToDisplay),
		CommitEventMaxItemToDisplay = (undefined === parameters.CommitEventMaxItemToDisplay ? 2 : parameters.CommitEventMaxItemToDisplay);

	var jsonData;
	
	/*******************************************************************
	 * GetData
	 * 
	 * Calling GitHub API to GET data of GitHub event of Organization
	 */
	this.GetData = function()
	{
		var xhr = new XMLHttpRequest();
		xhr.dataType = "json";
		xhr.open("GET", "https://api.github.com/orgs/" + organization + "/events?per_page=" + ItemToDisplay, true);
		xhr.setRequestHeader('Accept','application/vnd.github.v3.raw+json');
		xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState==4 && xhr.status==200)
			{
				jsonData = JSON.parse(xhr.response);
				BindData();
			}
		}
		xhr.send();
	}
	
	/*******************************************************************
	 * BindData
	 * 
	 * Show the data formatted inside the Target Element
	 */
	function BindData()
	{
		for(var item=0;item<ItemToDisplay;item++)
		{
			var gitEvent = '<div class="event_container">';
			gitEvent += ActivityAuthor(jsonData[item]);
			gitEvent += ActivityOperation(jsonData[item]);
			gitEvent += '</div>';
			
			document.getElementById(container).innerHTML+=gitEvent;
		}
	};
	
	
	
	/*******************************************************************
	 * ActivityAuthor
	 * 
	 * @param	data	Data of item in JSON format
	 */	
	function ActivityAuthor(data)
	{
		var authorData = '<div class="left_info"><div class="author"><img src="' + data.actor.avatar_url + 's=30" alt="' + data.actor.login + '" /></div>';
		
		switch (data.type)
		{
			case "PushEvent":
				authorData += '<div class="icon"><span class="octicon octicon-git-commit" title="Commit"></span></div>';
			break;
			case "CreateEvent":
				authorData += CreateEventAuthorData(data.payload.ref_type);
			break;
			case "IssuesEvent":
				authorData += IssuesEventAuthorData(data.payload.action);
			break;
			case "IssueCommentEvent":
				authorData += '<div class="icon"><span class="octicon octicon-comment-discussion" title="' + data.type + '"></span></div>';
			break;
			case "PullRequestEvent":
				authorData +='<div class="icon"><span class="octicon octicon-git-pull-request" title="' + data.type + '"></span></div>';
			break;
			case "GollumEvent":
				authorData +='<div class="icon"><span class="octicon octicon-book" title="' + data.type + '"></span></div>';
			break;
			case "WatchEvent":
				authorData +='<div class="icon"><span class="octicon octicon-eye-watch" title="' + data.type + '"></span></div>';
			break;
			
			//...

			default:
				authorData += '<div class="icon"><span class="octicon octicon-flame" title="' + data.type + '"></span></div>';
			break;
		}
		
		var monthNames = [ "Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dec" ];
		var date=new Date(data.created_at);
		authorData += '<div class="date">' + date.getDate() + ' ' + monthNames[date.getMonth()] + '</div></div>';
			
		return authorData;
	}
	
	/*******************************************************************
	 * ActivityOperation
	 * 
	 * @param	data	Data of item in JSON format
	 */	
	function ActivityOperation(data)
	{
		var operationData = '<div class="right_info">';
		
		switch (data.type)
		{
			case "PushEvent":
				operationData += PushEventData(data);
			break;
			case "CreateEvent":
				operationData += CreateEventData(data);
			break;
			case "IssuesEvent":
				operationData += IssuesEventData(data);
			break;
			case "IssueCommentEvent":
				operationData += IssueCommentEventData(data);
			break;
			case "PullRequestEvent":
				operationData += PullRequestEventData(data);
			break;
			case "GollumEvent":
				operationData += GollumEventData(data);
			break;
			case "WatchEvent":
				operationData += WatchEventData(data);
			break;
			
			//...
			
			default:
				operationData += '<span class="octicon octicon-flame" title="' + data.type + '"></span>';
			break;
		}
		
		operationData += '</div>';
		
		return operationData;
	}
	
	
	/***** #region ACTIVITY AUTHOR GENERETOR *****/
	function CreateEventAuthorData(eventType)
	{
		var info = "";
		
		switch(eventType)
		{
			case "repository":
				info = '<div class="icon"><span class="octicon octicon-repo" title="Repository"></span></div>';
			break;
			case "branch":
				info = '<div class="icon"><span class="octicon octicon-git-branch" title="Branch"></span></div>';
			break;
			case "tag":
				info = '<div class="icon"><span class="octicon octicon-tag" title="Tag"></span></div>';
			break;
			default:
				info = '<div class="icon"><span class="octicon octicon-flame" title="Flame"></span>' + eventType + '</div>';
			break;
		}
		
		return info;
	}
	
	function IssuesEventAuthorData(eventType)
	{
		var info = "";
		
		switch(eventType)
		{
			case "assigned":
				info = '<div class="icon"><span class="octicon octicon-issue-assigned" title="Issue assigned"></span></div>';
			break;
			case "unassigned":
				info = '<div class="icon"><span class="octicon octicon-issue-unassigned" title="Issue unassigned"></span></div>';
			break;
			case "labeled":
				info = '<div class="icon"><span class="octicon octicon-issue-labeled" title="Issue labeled"></span></div>';
			break;
			case "unlabeled":
				info = '<div class="icon"><span class="octicon octicon-issue-unlabeled" title="Issue unlabeled"></span></div>';
			break;
			case "opened":
				info = '<div class="icon"><span class="octicon octicon-issue-opened" title="Issue opened"></span></div>';
			break;
			case "closed":
				info = '<div class="icon"><span class="octicon octicon-issue-closed" title="Issue closed"></span></div>';
			break;
			case "reopened":
				info = '<div class="icon"><span class="octicon octicon-issue-reopened" title="Issue reopened"></span></div>';
			break;
			default:
				info = '<div class="icon"><span class="octicon octicon-flame" title="Flame"></span>' + eventType + '</div>';
			break;
		}
		
		return info;
	}
	/***** #endregion *****/
	
	/***** #region ACTIVITY OPERATION GENERETOR *****/
	function PushEventData(data)
	{
		var pushEventData = "";
		var branch = data.payload.ref.replace("refs/heads/","");
		pushEventData += 'pushed to branch: <a href="' + branchUrl(data.repo.url, branch) + '">' + branch + '</a><br />';
		pushEventData += 'of repository: <a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
		pushEventData += '<ul class="listCommit">';
		
		var commitToShow = 1;
		var commitMore = 0;
		if(data.payload.commits.length <= CommitEventMaxItemToDisplay)
		{
			commitToShow = data.payload.commits.length;
		}
		else
		{
			commitToShow = CommitEventMaxItemToDisplay;
			commitMore = data.payload.commits.length - CommitEventMaxItemToDisplay;
		}
		
		for(var i=0;i<commitToShow;i++)
		{
			pushEventData += '<li><a href="' + commitUrl(data.payload.commits[i].url) + '">' + data.payload.commits[i].message + '</a></li>';
		}
		
		if(commitMore>0)
		{
			pushEventData += '<li>and ' + commitMore + ' more ...</li>';
		}
		pushEventData += '</ul>';
		
		return pushEventData;
	}
	
	function CreateEventData(data)
	{
		var createEventData = "";
		
		switch(data.payload.ref_type)
		{
			case "repository":
				createEventData = 'created repository: <a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
				createEventData += data.payload.description;
			break;
			case "branch":
				createEventData = 'created branch: <a href="' + replaceAPIUrl(data.repo.url) + '/tree/' + data.payload.ref + '">' + data.payload.ref + '</a><br />';
				createEventData += 'of repository: <a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
				createEventData += data.payload.description;
			break;
			case "tag":
				createEventData = 'created tag: <a href="' + replaceAPIUrl(data.repo.url) + '/tree/' + data.payload.ref + '">' + data.payload.ref + '</a><br />';
				createEventData += 'at: <a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
				createEventData += data.payload.description;
			break;
			default:
				createEventData = '<div class="icon"><span class="octicon octicon-flame" title="Flame"></span>' + data.payload.ref_type + '</div>';
			break;
		}
		
		return createEventData;		
	}
	
	function IssuesEventData(data)
	{
		var issuesEventData = "";
		
		switch(data.payload.action)
		{
			case "assigned":
				issuesEventData = 'Assigned issue <a href="' + data.payload.issue.html_url + '">#' + data.payload.issue.number + '</a> to ' + data.payload.issue.assignee;
			break;
			case "unassigned":
				issuesEventData = 'Unassigned issue <a href="' + data.payload.issue.html_url + '">#' + data.payload.issue.number + '</a> at ' + data.payload.issue.assignee;
			break;
			case "labeled":
				issuesEventData = 'The label ' + data.payload.label.name + ' was added at issue <a href="' + data.payload.issue.html_url + '">#' + data.payload.issue.number + '</a>';
			break;
			case "unlabeled":
				issuesEventData = 'The label ' + data.payload.label.name + ' was removed at issue <a href="' + data.payload.issue.html_url + '">#' + data.payload.issue.number + '</a>';
			break;
			case "opened":
				issuesEventData = 'Opened issue <a href="' + data.payload.issue.html_url + '">#' + data.payload.issue.number + '</a> on ';
				issuesEventData += '<a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
				issuesEventData += data.payload.issue.title;
			break;
			case "closed":
				issuesEventData = 'Closed issue <a href="' + data.payload.issue.html_url + '">#' + data.payload.issue.number + '</a> on ';
				issuesEventData += '<a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
				issuesEventData += data.payload.issue.title;
			break;
			case "reopened":
				issuesEventData = 'Reopened issue <a href="' + data.payload.issue.html_url + '">#' + data.payload.issue.number + '</a> on ';
				issuesEventData += '<a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
				issuesEventData += data.payload.issue.title;
			break;
			default:
				issuesEventData = '<div class="icon"><span class="octicon octicon-flame" title="Flame"></span>' + data.payload.action + '</div>';
			break;
		}
		
		return issuesEventData;
	}
	
	function IssueCommentEventData(data)
	{
		var issueCommentEventData='';
		
		issueCommentEventData = 'Commented on issue <a href="' + data.payload.issue.html_url + '">#' + data.payload.issue.number + '</a> on ';
		issueCommentEventData += '<a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
		issueCommentEventData += data.payload.comment.body;
		
		return issueCommentEventData;
	}
	
	function PullRequestEventData(data)
	{
		var pullRequestEventData='';
		
		switch(data.payload.action)
		{
			case "assigned":
				pullRequestEventData += 'Assigned Pull request <a href="' + data.payload.pull_request.html_url + '">#' + data.payload.pull_request.number + '</a> on ';
			break;
			case "unassigned":
				pullRequestEventData += 'Unassigned Pull request <a href="' + data.payload.pull_request.html_url + '">#' + data.payload.pull_request.number + '</a> on ';
			break;
			case "labeled":
				pullRequestEventData += 'Added Label at Pull request <a href="' + data.payload.pull_request.html_url + '">#' + data.payload.pull_request.number + '</a> on ';
			break;
			case "unlabeled":
				pullRequestEventData += 'Removed Label at Pull request <a href="' + data.payload.pull_request.html_url + '">#' + data.payload.pull_request.number + '</a> on ';
			break;
			case "opened":
				pullRequestEventData += 'Opened Pull request <a href="' + data.payload.pull_request.html_url + '">#' + data.payload.pull_request.number + '</a> on ';
			break;
			case "closed":
				if(data.payload.merged)
				{
					pullRequestEventData += 'Closed and merged Pull request <a href="' + data.payload.pull_request.html_url + '">#' + data.payload.pull_request.number + '</a> on ';
				}
				else
				{
					pullRequestEventData += 'Closed Pull request <a href="' + data.payload.pull_request.html_url + '">#' + data.payload.pull_request.number + '</a> on ';
				}
			break;
			case "reopened":
				pullRequestEventData += 'Reopened Pull request <a href="' + data.payload.pull_request.html_url + '">#' + data.payload.pull_request.number + '</a> on ';
			break;
			case "synchronize":
				pullRequestEventData += 'Synchronize Pull request <a href="' + data.payload.pull_request.html_url + '">#' + data.payload.pull_request.number + '</a> on ';
			break;	
		}
		
		pullRequestEventData += '<a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
		pullRequestEventData += data.payload.pull_request.title;
		
		return pullRequestEventData;
	}
	/*******************************************************************
	 * GollumEventData
	 * 
	 * @param	data	Data of item in JSON format
	 */	
	function GollumEventData(data)
	{
		var gollumEventData='';
		
		gollumEventData += 'on repository: <a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
		gollumEventData += '<ul class="listCommit">';
		
		for(var i=0;i<data.payload.pages.length;i++)
		{
			switch(data.payload.pages[i].action)
			{
				case "created":
					gollumEventData += '<li>created new wiki page <a href="https://github.com' + data.payload.pages[i].html_url + '">' + data.payload.pages[i].title + '</a></li>';
				break;
				case "edited":
					gollumEventData += '<li>edited wiki page <a href="https://github.com' + data.payload.pages[i].html_url + '">' + data.payload.pages[i].title + '</a></li>';
				break;
			}
		}
		
		gollumEventData += '</ul>';
		
		return gollumEventData;
	}
	/*******************************************************************
	 * WatchEventData
	 * 
	 * @param	data	Data of item in JSON format
	 */	
	function WatchEventData(data)
	{
		var watchEventData='';
		
		if(data.payload.action=="started")
		{
			watchEventData += 'started to follow repository <a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a>';
		}
		else
		{
			watchEventData += 'New event action actualy not managed, please open a new <a href="https://github.com/bobboteck/Widget_GitHub_Organization/issues/new">Issue</a>';
		}
		
		return watchEventData;
	}
	/***** #endregion *****/
	
	/***** #region UTILITY *****/
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
	
	function repositoryName(branchName)
	{
		return branchName.replace(organization + "/","");
	}
	
	function commitUrl(url)
	{
		var newUrl = replaceAPIUrl(url);
		newUrl = newUrl.replace("commits","commit");
		return newUrl;
	}
	/***** #endregion *****/
});
