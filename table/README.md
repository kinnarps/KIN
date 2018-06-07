# KIN.table

## Description of parameters
* `wrapperelement`: String containing element selector of where to put the table
* `dataurl` 	: Url for fetching table data (see [data.json](https://github.com/kinnarps/KIN/blob/master/table/data.json))
* `hitsperpage` : Number of hits per page
* `stylesize`	: String "small" smaller row font
* `density`	: Column padding, medium is default. Possible values are 'narrow','medium','large'
* `loader`	: Default true, will display a loader on table update
* `loadermsg`	: String with a message to display under the loader
* `ondataloaded`: Callback event that is fired when the data has loaded, data object is sent as a parameter
* `rowformatter`: Callback event that is fired on each row print, row html and row data object is sent as parameters
* `columns`	: Array of objects containing configuration of the columns
* `actions`	: Array of objects containing row actions
* `beforeupdate`: Callback to be executed before updating table
* `afterupdate`	: Callback to be executed after updating table, contains the response object
* `savestate`	: boolean should table state (paginator,hitsperpage) be saved in sessionStorage
* `addstatetourl` : Will add each sessionStorage object as a parameter to your dataurl if set to true.
* `onselect` : Callback to be executed when checking and unchecking a checkbox when selectable is set to true for a column. Row data is sent as parameter.


## Description of column object
* `type`	: Option 1 string value column,2 Sortable column, 3 action menu column,4 adds a slide down arrow to display additional information. See example
* `columnname`	: Header name of column
* `columnwidth`	: Width of column, uses bootstrap responsive columns. All columns must sum up to a value of maximum of 12
* `datafield`	: Name of data field to be used as a value
* `formatter`	: Callback function for formatting the column value with additional formatting.
* `selectable`	: Default false, inserts a checkbox in the column, use the onselect callback in main config.

## Description of action object
* `title`	: Action title
* `parameter`	: Callback parameters sent to the callback function, possible to send a plain string or return data from the dataobject. To return a data object wrapp your data-field inside a $[]. You can also pass an object with multiple parameters.
* `icon`	: Icon that will show up to the left of the title. See [Icon reference](http://liferay.github.io/alloy-bootstrap/base-css.html#icons) for a list of icons.
* `callback`	: Callback function for executing the action

## Description of sortable column
Option 2 for column type will add two additional parameters to KIN.table.urlparameters when the user click on the sort arrows. 
* `sortby`	: Parameter that contains the column data name
* `sortdirection`: Parameter containing either asc or desc depening on which arrow the user clicked on

## Description of toggle panel column
Option 4 for column type will add an expandable panel below each row. Same as option type 1 except it will need a callback function for populating the panel with data. Important that the callback function is sent as a string. See [example](#example-create-and-show-a-panel-with-additional-data-below-each-row) below.
* `panelcallback` : The callback that should be called, must be a string and be defined in global scope.

## Methods
* `KIN.table.update` : Re-paints the table
* `KIN.table.addurlparameter(key,value)` : Adds additional parameters to the update request
* `KIN.table.removeurlparameter(key)`
* `KIN.table.addstatevalue(key,value)` : Adds additional parameters to the table statae sessionStorage object
* `KIN.table.removestatevalue(key)`

## Properties
* `KIN.table.urlparameters` : Custom parameter object
* `KIN.table.statevalues` : Session storage object

## Example 
```javascript
var table = KIN.table.init({
	wrapperelement	 	: ".custom-table",
	dataurl			: "<%= getPublishedContentUrl %>",
	hitsperpage		: 25,
	stylesize		: 'small',
	density			: 'narrow',
	loader			: true,
	loadermsg		: 'Loading',
	savestate		: boolean,
	addstatetourl		: boolean,
	beforeupdate		: function(){/*Before table is updated, set state and urlparameters for example*/},
	afterupdate		: function(data){},
	ondataloaded		: function(data){},
	onselect		: function(data){},
	rowformatter		: function(rowobject,rowdata){},
	columns : [
		{"type": "1", "columnname":"Title", "columnwidth":"2", "datafield":"title",formatter : formatTitleCol,selectable:true},
		{"type": "2", "columnname":"Publish date", "columnwidth":"2", "datafield":"publishDate"},
		{"type": "2", "columnname":"Modified date", "columnwidth":"3", "datafield":"modifiedDate"},
		{"type": "1", "columnname":"Type", "columnwidth":"3", "datafield":"structureName"},
		{"type": "3", "columnname":"", "columnwidth":"2"}
	],
	actions : [
		{"title": '<liferay-ui:message key="edit" />', parameter: "$[editUrl]", "icon": "icon-edit",callback:editArticle},
		{"title": '<liferay-ui:message key="delete" />', parameter: {articleId:"$[articleId]",groupId:"$[groupId]"},"icon": "icon-trash", callback:deleteArticle},
		{"title": '<liferay-ui:message key="open" />', parameter: {personType:"Supplier",url:"$[viewurl]",title:"$[title]"}, "icon": "icon-search",callback:openurl},
  			
	],
})


/*Example of a callback formatter function*/
function formatTitleCol(obj){
	return '<a class="kingfisher" target="_blank" href="'+obj.item.viewurl+'">'+obj.columnvalue+'</a>';
}

/*Example of action callback functions*/
function editArticle(parameter){
	openEditor(parameter)
}

function deleteArticle(parameters){
	KIN.utils.confirm_custom({
		content : {
			title : 'Confirm',
			message : 'This action will move your article to the recycle bin.'
			},
		theme : 'chili-red',
		onOk:<portlet:namespace />onOkTrashArticle,
		onCancel:<portlet:namespace />onCancel,
		parameters:{
			articleId:parameters.articleId,
			groupId:parameters.groupId
		}
	})
}

$(document).on("change","#some-element",function(){		
		/*This will add some temporary parameters to the table update request*/
		KIN.table.urlparameters.status = "some-value"; 		
		KIN.table.urlparameters.searchKey = "some-value";
		KIN.table.update();
	});

```
<br /><br />


## Example saving states to a search input field
Note that if you set addstatetourl to true you dont have to use addurlparameter as the state values will be appended as parameters to your dataurl. 
```javascript
$(document).ready(function(){
	$("#my-content-search").on("keyup",function(e){
		if($(this).val().length > 3){					
			//Add my search key to the session storage
			KIN.table.statevalues.searchKey = $("#my-content-search").val();
			
			//Update table
			KIN.table.update();
		}else if ($(this).val().length == 0){
			KIN.table.statevalues.searchKey = '';
			KIN.table.update();
		}
	});
	
	var table = KIN.table.init({
		wrapperelement	 	: ".custom-table",
		dataurl			: "<%= getPublishedContentUrl %>",
		savestate		: true,
		addstatetourl		: true,
		ondataloaded		: function(data){
						//Get my custom saved state value from sessionStorage and set value of the search field
						if(((table || {}).tablestate || {}).searchKey){
							$("#my-content-search").val(table.tablestate.searchKey)
						}
						return data;/*Init callback when data is loaded*/
					},
		columns : [
					{"type": "1", "columnname":"Title", "columnwidth":"2", "datafield":"title"},
		]
	})
})
```

## Example create and show a panel with additional data below each row
```javascript
function printthepanel(callbackobj){
	//The callbackobj contains the current rows data item, panelwrapper element selector for inserting html inside the panel and the row id for the current row
	
	/*Data from row item*/
	$(obj.panelwrapper).html(item.title)
	
	/*Remote data*/
	var id = (obj.rowid + 1)
	$.get("https://sekinitutv01.kinnarps.com:3000/albums/"+id,function(data){
		$(obj.panelwrapper).html(data.title)
	})
}

$(document).ready(function(){
	var table = KIN.table.init({
		wrapperelement	 	: ".custom-table",
		dataurl			: "<%= getPublishedContentUrl %>",
		columns : [
			{"type": "4", "columnname":"Title", "columnwidth":"2", "datafield":"title",panelcallback:"printthepanel"},
		]
	})
})
```
