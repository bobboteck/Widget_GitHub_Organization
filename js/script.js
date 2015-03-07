/*
Script Name: GitHub Organization Event Traking 
Description: This is a script used for a Wordpress Widget that show recent GitHub events of a specific Organization
Version: 0.2.0
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
	
	/**************************************************************************
	 * GetData
	 * 
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
	
	/**************************************************************************
	 * BindData
	 * 
	 */
	this.BindData = function()
	{
		commitEventMaxItemToDisplay = this.CommitEventMaxItemToDisplay;
	
		for(var item=0;item<this.ItemToDisplay;item++)
		{
			var gitEvent = '<div class="event_container">';
			gitEvent += ActivityAuthor(jsonData[item]);
			gitEvent += ActivityOperation(jsonData[item]);
			gitEvent += '</div>';
			
			$(this.TargetElement).append(gitEvent);
		}
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
				operationData += PushEventData(data);
			break;
			//...
			default:
				operationData += '<span class="octicon octicon-flame" title="Flame"></span>';
			break;
		}
		
		operationData += '</div>';
		
		return operationData;
	}
	
	
	//***** EVENT DATA GENERETOR *****//
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
			pushEventData += '<li>' + commitMore + ' more ...</li>';
		}
		pushEventData += '</ul>';
		
		return pushEventData;
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
		return branchName.replace(this.Organization + "/","");
	}
	
	function commitUrl(url)
	{
		var newUrl = replaceAPIUrl(url);
		newUrl = newUrl.replace("commits","commit");
		return newUrl;
	}
}
