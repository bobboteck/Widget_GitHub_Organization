/*
Script Name: GitHub Organization Event Traking 
Description: This is a script used for a Wordpress Widget that show recent GitHub events of a specific Organization
Version: 0.3.1
Author: Roberto D'Amico [bobboteck(at)gmail.com]
Author URI: http://www.officinerobotiche.it/
*/

function GithubOrganizationEventManager(organization)
{
	// Object properties
	this.Organization = organization;		// Name of organization
	this.ItemToDisplay = 5;					// Default number of item to show
	this.CommitEventMaxItemToDisplay = 2;	// Max number of commit item to show for one event
	this.TargetElement;						// HTML element to add event info
	// Object variable
	var jsonData;
	var commitEventMaxItemToDisplay;
	var organizationName;
	
	/*******************************************************************
	 * GetData
	 * 
	 * Calling GitHub API to GET data of GitHub event of Organization
	 */
	this.GetData = function()
	{
		var xhr = new XMLHttpRequest();
		xhr.dataType = "json";
		xhr.open("GET", "https://api.github.com/orgs/" + this.Organization + "/events", false);
		xhr.setRequestHeader('Accept','application/vnd.github.v3.raw+json');
		xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8');
		xhr.send(null);
		
		jsonData = JSON.parse(xhr.response);
	}
	
	/*******************************************************************
	 * BindData
	 * 
	 * Show the data formatted inside the Target Element
	 */
	this.BindData = function()
	{
		commitEventMaxItemToDisplay = this.CommitEventMaxItemToDisplay;
		organizationName = this.Organization;
	
		for(var item=0;item<this.ItemToDisplay;item++)
		{
			var gitEvent = '<div class="event_container">';
			gitEvent += ActivityAuthor(jsonData[item]);
			gitEvent += ActivityOperation(jsonData[item]);
			gitEvent += '</div>';
			
			$(this.TargetElement).append(gitEvent);
		}
	}
	
	
	
	/*******************************************************************
	 * ActivityAuthor
	 * 
	 * @param	data	Data of item in JSON format
	 * 
	 * 
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
			//...
			default:
				operationData += '<span class="octicon octicon-flame" title="' + data.type + '"></span>';
			break;
		}
		
		operationData += '</div>';
		
		return operationData;
	}
	
	
	/* region ACTIVITY AUTHOR GENERETOR */
	function CreateEventAuthorData(type)
	{
		var info = "";
		
		switch(type)
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
				info = '<div class="icon"><span class="octicon octicon-flame" title="Flame"></span>' + type + '</div>';
			break;
		}
		
		return info;
	}
	
	function IssuesEventAuthorData(type)
	{
		var info = "";
		
		switch(type)
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
				info = '<div class="icon"><span class="octicon octicon-flame" title="Flame"></span>' + type + '</div>';
			break;
		}
		
		return info;
	}
	/* endregion */
	
	//***** ACTIVITY OPERATION GENERETOR *****//
	function PushEventData(data)
	{
		var pushEventData = "";
		var branch = data.payload.ref.replace("refs/heads/","");
		pushEventData += 'pushed to branch: <a href="' + branchUrl(data.repo.url, branch) + '">' + branch + '</a><br />';
		pushEventData += 'of repository: <a href="' + replaceAPIUrl(data.repo.url) + '">' + repositoryName(data.repo.name) + '</a><br />';
		pushEventData += '<ul class="listCommit">';
		
		var commitToShow = 1;
		var commitMore = 0;
		if(data.payload.commits.length <= commitEventMaxItemToDisplay)
		{
			commitToShow = data.payload.commits.length;
		}
		else
		{
			commitToShow = commitEventMaxItemToDisplay;
			commitMore = data.payload.commits.length - commitEventMaxItemToDisplay;
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
				createEventData = '<div class="icon"><span class="octicon octicon-flame" title="Flame"></span>' + type + '</div>';
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
	
	//***** UTILITY *****//
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
		return branchName.replace(organizationName + "/","");
	}
	
	function commitUrl(url)
	{
		var newUrl = replaceAPIUrl(url);
		newUrl = newUrl.replace("commits","commit");
		return newUrl;
	}
}
