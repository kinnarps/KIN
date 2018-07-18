(function($){
	$.fn.KIN_table = function(config){
		$(this).each(function(){
			var $elt = this;
	
			if (typeof $elt.KIN !== 'object')
				$elt.KIN = {};
			
			$elt.KIN.table = {
				// INIT
				init : function(config){
					var _this = this;
					this.portletNamespace 			= config.portletNamespace;
					this.hitsperpage 				= config.hitsperpage;
					this.pagenumber 				= config.pagenumber || 1;
					this.dataurl 					= config.dataurl;
					this.parameterurl 				= config.dataurl; 
					this.loader 					= (typeof config.loader !== "undefined" )?config.loader:this.loader;
					this.loadermsg 					= (typeof config.loadermsg !== "undefined" )?config.loadermsg:"";
					this.config 					= config;
					this.savestate					= (typeof config.savestate !== "undefined" )?config.savestate:this.savestate;
					this.uniqid						= '_' + Math.random().toString(36).substr(2, 9);
					this.$wrapper					= $($elt);
					
					var tablestate = sessionStorage.getItem('tablestate' + this.uniqid);
					
					if(tablestate) {
						tablestate = JSON.parse(tablestate);
						_this.tablestate = tablestate;
						this.hitsperpage = tablestate.hitsperpage
						this.pagenumber = tablestate.pagenumber
						this.tablestate = tablestate
					}
					
					
					var stylesize = ((config || {}).stylesize)?"small":"";
					var density = ((config || {}).density)?config.density:this.density;
								
					var wrapperHtml = '<div class="KIN_table_header"></div><div class="KIN_table_body '+stylesize+' density-'+density+'"></div><div class="KIN_table_footer"></div>';
					
					this.$wrapper.html(wrapperHtml);
					this.$wrapper.data('id', this.uniqid);
					
					var headerHtml = this.getHtmlHeaders(config.columns)
					this.$wrapper.find(".KIN_table_header").html(headerHtml);
					
					
					this.parameterurl = this.parameterurl + "&hitsperpage="+this.hitsperpage+"&pagenumber="+this.pagenumber;
					
					if(tablestate && config.addstatetourl){
						for (var member in tablestate) {
							if(member != "hitsperpage" && member != "pagenumber")
								_this.parameterurl = _this.parameterurl + "&"+member+"="+ tablestate[member]
						}
					}
					
					if(this.loader){
						KIN.ui.page_loader.show({text: _this.loadermsg, width: "10%"})
					}
					
					/* Fetch data and print table */
					$.when(
						this.getPromise(_this.parameterurl)
					).then(function(response){
						_this.responsedata = response;
						if (typeof(_this.config.ondataloaded) === 'function') {
							_this.responsedata.$wrapper = _this.$wrapper;
							returndata = _this.config.ondataloaded(_this.responsedata);
							if(returndata){
								_this.responsedata = returndata;
							}
						}
					
						var bodyHtml = _this.getHtmlTableBody(_this.responsedata.items, config.columns, config.actions)	
						_this.$wrapper.find(".KIN_table_body").html(bodyHtml)
						_this.$wrapper.find(".KIN_table_footer").append(_this.getHtmlHitsPerPage());
						_this.$wrapper.find(".KIN_table_footer").append(_this.getHtmlPaginator());
						_this.$wrapper.find(".KIN_table_hitsperpage").val(_this.hitsperpage)
						_this.initPaginator(_this.responsedata);
						
						if (_this.responsedata.hits <= _this.hitsperpage) {
							_this.$wrapper.find(".KIN_table_footer .simple-pagination").hide();
						}
						
						if(_this.loader){
							KIN.ui.page_loader.destroy();
						}
					});
					
					/* onClick action */
					_this.$wrapper.on("click", ".js-action-click", function(){
						var index = $(this).attr("data-count");
						var actionIndex = $(this).attr("data-item-action-count");
						var parameter = $(this).attr("data-parameter")
						var parameterType = $(this).attr("data-parameter-type")
						
						if(parameterType == "object"){
							parameter = JSON.parse(parameter);
						}
						
						var itemActions = _this.actions.storage[index];
						itemActions[actionIndex](parameter);
						_this.actions.hide();
					});
					
					/* Column on click sort arrows */
					_this.$wrapper.on("click", ".js-click-sort", function(){
						$(_this.wrapperElement).find(".js-click-sort").removeClass("current");
						$(this).addClass("current");
						_this.urlparameters.sortdirection = $(this).data('direction');
						_this.urlparameters.sortby = $(this).data('col'); 
						_this.update();
					});
					
					/* Row slidedown panel */
					_this.$wrapper.on("click", ".KIN_js-view-row-data", function(){
						var row = $(this).data("row");
						var rowid = $(this).data("rowid");
						var callback = $(this).data("callback"); 
						
						if (typeof callback === 'function'){
							callback.call(this, {'item':_this.responsedata.items[rowid],'panelwrapper':_this.$wrapper.find('.KIN_table_panel_wrapper_row_'+rowid),'rowid':rowid});
						}
						
						_this.$wrapper.find("."+row).next("div").toggleClass("hidden");
						$(this).toggleClass("open");
						if(!_this.$wrapper.find("."+row).next("div").hasClass("hidden")){
							//$(this).toggleClass("open")   
						}else{
							//$(this).html("V") 
						}
					});
					
					/* Row onChange checkbox */
					_this.$wrapper.on("change", ".KIN_table_checkbox input[type='checkbox']", function(){
						if(config.onselect && typeof(config.onselect) === 'function'){
							var rowid = $(this).data("rowid");
							config.onselect(_this.responsedata.items[rowid]);
						}
					})
					
					return _this;
				},
				
				// UPDATE
				update : function(config){
					var _this = this;
							
					if ( (_this.config || {}).beforeupdate && typeof(_this.config.beforeupdate) === 'function') 
						_this.config.beforeupdate();
					
					if(this.loader){
						KIN.ui.page_loader.show({text: this.loadermsg, width: "10%"}) 
					}
					
					if(this.savestate){
						var tablestate = {
							hitsperpage : _this.hitsperpage,
							pagenumber : _this.pagenumber
						}
						for (var member in _this.statevalues) {
							tablestate[member] = _this.statevalues[member] 
						}
						sessionStorage.setItem('tablestate' + this.uniqid, JSON.stringify(tablestate));
					}
			
					this.parameterurl = _this.dataurl + "&hitsperpage="+_this.hitsperpage+"&pagenumber="+_this.pagenumber;
		
					
					for (var member in _this.urlparameters) {
							this.parameterurl = this.parameterurl + "&"+member+"="+_this.urlparameters[member]
					}
		  
					if(tablestate && _this.config.addstatetourl){
						for (var member in tablestate) {
							if(member != "hitsperpage" && member != "pagenumber") 
								_this.parameterurl = _this.parameterurl + "&"+member+"="+ tablestate[member] 
						}
					}
					
					
					$.when(
						this.getPromise(_this.parameterurl)
					).then(function(response){
						var bodyHtml = _this.getHtmlTableBody(response.items, _this.config.columns, _this.config.actions)	
						_this.$wrapper.find(".KIN_table_body").html(bodyHtml)
						_this.responsedata = response;
						_this.initPaginator(response);
						
						if (_this.responsedata.hits <= _this.hitsperpage) {
							_this.$wrapper.find(".KIN_table_footer .simple-pagination").hide();
						} else {
							_this.$wrapper.find(".KIN_table_footer .simple-pagination").show();
						}
						
						if(_this.loader){
							KIN.ui.page_loader.destroy()
						}
						if ( (_this.config || {}).afterupdate && typeof(_this.config.afterupdate) === 'function') {
							response.$wrapper = _this.$wrapper;
							_this.config.afterupdate(response);
						}
					});
				},
				
				// GET HTML HEADERS
				getHtmlHeaders : function(columns){
					htmlHeaders = '<div class="row table-header">'; 
					for (i = 0; i < columns.length; i++) {
						if(columns[i].type == "2"){
							htmlHeaders += '<div class="col-md-'+columns[i].columnwidth+'"><p>'+columns[i].columnname+' <i class="js-click-sort arrow-up" data-col="'+columns[i].datafield+'" data-direction="asc"></i><i class="js-click-sort arrow-down" data-col="'+columns[i].datafield+'" data-direction="desc"></i></p></div>'; 
						}else{
							htmlHeaders += '<div class="col-md-'+columns[i].columnwidth+'"><p>'+columns[i].columnname+'</p></div>';
						}
						
					}
					htmlHeaders += '</div>';
					return htmlHeaders;
				},
				
				// GET HTML TABLE BODY
				getHtmlTableBody : function(data,columns,actions){ 
					var _this = this;
					var htmlBody = '';
					
					$.each(data,function(i,item){
						var rowHtml = '';
						
						rowHtml += '<div class="row table-row row_'+i+'" data-id="row_'+i+'">';
						
						for (i0 = 0; i0 < columns.length; i0++) {
							var slideHtml = '';
							var checkHtml = '';
							var pushSlideClass = '';
							
							if (columns[i0].type == "1" || columns[i0].type == "2" || columns[i0].type == "4") { 
								
														
								if ((columns[i0] || {}).selectable && columns[i0].selectable) {
									/* Adds a checkbox if selectable is true */
									checkHtml = '<div class="KIN_table_checkbox"><p><input type="checkbox" data-rowid="'+i+'"></p></div>'
									pushSlideClass = 'push';
								}
								
								if (columns[i0].type == "4") {
									/* Adds a slide down toggler inside column type number 4*/ 
									slideHtml += '<div class="KIN_table_slide_toggle_wrapper '+pushSlideClass+'"><p><a href="javascript:void(0)" class="KIN_table_info_slide_toggle KIN_js-view-row-data" data-callback="'+columns[i0].panelcallback+'" data-row="row_'+i+'" data-rowid="'+i+'"></a></p></div>'
								}
								
								if (columns[i0].formatter && typeof(columns[i0].formatter) === 'function') {
									var formattedColumn = columns[i0].formatter({panelwrapper:".KIN_table_panel_wrapper_row_"+i, row:"row_"+i, item:item, columnvalue:item[columns[i0].datafield]});
									rowHtml += '<div class="col-md-'+columns[i0].columnwidth+'">'+slideHtml+checkHtml+'<p>'+formattedColumn+'</p></div>';
								} else {
									rowHtml += '<div class="col-md-'+columns[i0].columnwidth+'">'+slideHtml+checkHtml+'<p>'+item[columns[i0].datafield]+'</p></div>'; 
								}
							} else if(columns[i0].type == "3") {
								var className = 'js-wrapper__actions_' + i + ' wrapper__actions  lfr-icon-menu'
								rowHtml += '<div class="col-md-'+columns[i0].columnwidth+'"><div class="' + className + '">'+
								'<div class="actions__row actions_' + i + '">';
								var itemActions = [];
								var itemParameters = [];
								
								for(a0 = 0 ; a0 < actions.length ; a0++) {
									itemActions.push(actions[a0].callback);
									
									var callBackParameter;
									var parameterType = "";
									 
									if (typeof actions[a0].parameter === "object") {
										//If parameter is an object with $[text] we want to replace with data from json as parameters to the callback function
										var tempObject = {};
										for (var member in actions[a0].parameter) {
		
											var sFind = actions[a0].parameter[member];
											var test = _parseParameter(sFind)
											
											if (test == null) {
												tempObject[member] = sFind; 
											} else {
												tempObject[member] = item[test[1]];
											} 
									    }  		
																		
										//callBackParameter = JSON.stringify(actions[a0].parameter);
										callBackParameter = JSON.stringify(tempObject);
										parameterType = "object"
									} else {
										var sFind = actions[a0].parameter;
										
										var test = _parseParameter(sFind);
										if (test == null) {
											callBackParameter = sFind;
										} else {
											callBackParameter = item[test[1]];
										}
										
										parameterType = "string";
									}
									
									rowHtml += '<div><a class="js-action-click actionItem_' + i + '_' + a0 +  '" href="javascript:void(0)" data-count="'+i+'" data-parameter-type="'+parameterType+'" data-item-action-count="'+a0+'"  data-parameter=\''+callBackParameter+'\'>';
									if (typeof actions[a0].icon !== "undefined") {
										rowHtml += '<i class="'+actions[a0].icon+'"></i>';
									}
									 
									rowHtml += '<span class="text75 actionspan' + a0 + '" >'+actions[a0].title+'</span>'+ 
									'</a></div>';
								}
								
								_this.actions.storage.push(itemActions);
								rowHtml += '</div>'+
								'<a href="javascript:void(0)" onclick="KIN.table.actions.toggle(' + i + ',this)" class="btn dropdown-toggle small"><i class="caret"></i>Actions</a>'+
								'</div>'+
								'</div>';
							} else if(columns[i0].type == "4") {
								//rowHtml += '<div style="float:left;margin-right:10px;"><p><a href="javascript:void(0)" class="KIN_table_info_slide_toggle KIN_js-view-row-data" data-row="row_'+i+'"></a></p></div>'  
							}
						}   
						//data[tableObject.dataOffset][j][tableObject.columns[i].datafield]
						rowHtml += '</div>'+
						'<div class="hidden KIN_table_info_slide KIN_table_panel_wrapper_row_'+i+'"></div>';
						if (typeof(_this.config.rowformatter) === 'function')
							_this.config.rowformatter($.parseHTML(rowHtml),item);
						
						
						htmlBody += rowHtml;
					});
					
					return htmlBody;
				},
				
				// GET HTML HITS PER PAGE
				getHtmlHitsPerPage : function(){
					var _this = this;
					_this.$wrapper.on("change", ".KIN_table_hitsperpage", function(){
						_this.hitsperpage = $(this).val();
						_this.update();
					});
					
					return '<div class="hitsPerPageWrapper"><span>Hits per page</span><select name="KIN_table_hitsperpage' + this.uniqid + '" class="KIN_table_hitsperpage no-print" style="margin-left:1ex">'+
								'<option value="10">10</option>'+
								'<option value="20">20</option>'+
								'<option value="50">50</option>'+
								'<option value="100">100</option>'+
								'<option value="250">250</option>'+
							'</select>'+
							'</div>';
				},
				
				// GET HTML PAGINATOR
				getHtmlPaginator : function(){
					return '<div class="simple-pagination no-print"></div>';
				},
				
				// INIT PAGINATOR
				initPaginator : function(data){
					var _this = this;
					_this.$wrapper.find(".simple-pagination").pagination({ 
					    items: data.hits,
					    itemsOnPage: _this.hitsperpage,
					    cssStyle: 'light-theme',
					    currentPage : data.currentPage,
					    ellipsePageSet:true,
					    hrefTextPrefix:'',
					    onPageClick : function(pagenumber,event) {
							if(typeof event !== "undefined")
					    		event.preventDefault();
							_this.pagenumber = pagenumber;
							_this.update();
					    }
					});	
				},
				
				// GET PROMISE
				getPromise : function(uri){
					return $.ajax({
				        type: 'GET',
				        dataType: 'json',
				        data: {},
				    	url : uri,
				        error: function (jqXHR, textStatus, errorThrown) {
				            console.log(jqXHR);
				            console.log(errorThrown);
				        }
				    });
				},
				
				// ACTIONS
				actions : {
					previous : "",
					storage : [],
					toggle : function(id,elem){
						var _this = this; // TODO - wrong this?
						var id2 = id.toString().trim();
						
						if(this.previous == id2 ){
							_this.$wrapper.find('.actions__row.actions_'+id2).toggleClass('open');
							_this.$wrapper.find('.js-wrapper__actions_'+id2).toggleClass('open');
							return;
						}
						
						_this.$wrapper.find(".actions__row").removeClass("open");
						_this.$wrapper.find(".wrapper__actions").removeClass("open");
							
						_this.$wrapper.find('.actions__row.actions_'+id2).css("right",(elem.offsetWidth + 44)); 
						_this.$wrapper.find('.actions__row.actions_'+id2).toggleClass('open');
						_this.$wrapper.find('.js-wrapper__actions_'+id2).toggleClass('open');
						
						this.previous = id2;
					},
					execute : function(elem, url){
						console.log(elem)
						//window.location.href = url;
					},
					hide : function(){
						var _this = this; // TODO - wrong this?
						_this.$wrapper.find(".actions__row").removeClass("open");
						_this.$wrapper.find(".wrapper__actions").removeClass("open");
					}
				},
				addurlparameter : function(key,value){
					this.urlparameters[key] = value;
				},
				removeurlparameter : function(key){
					delete this.urlparameters[key];
				},
				addstatevalue : function(key,value){
					this.statevalues[key] = value;
				},
				removestatevalue : function(key){
					delete this.statevalues[key];
				},
				
				portletNamespace : "",
				currentUrl:"",
				dataurl : "",					 	//Original url
				parameterurl : "",					//Temp url for appending pagination and other stuff as parameters
				config : {},
				hitsperpage : 25,
				pagenumber : 1,
				urlparameters : {}, 					//Object with extra parameters to append to url when doing an update of table
				statevalues : {},
				loader : true,
				loadermsg:'',
				density : 'medium',
				savestate : true,
				tablestate : {},
				uniqid : "",
			} // $elt.KIN.table
			
			$elt.KIN.table.init(config);
		}); // this.each()
		
		return this;
	}; // $.fn.KIN_table
})(jQuery);

// Compatibility wrapper
KIN.table = {
	init : function(config){
		var $element = $(config.wrapperelement);
		$element.KIN_table(config);
		KIN.table = $element[0].KIN.table;
	},
};

function _parseParameter(str){
	var regex = /\$\[([^]+)\]/
	var sFind = str; 
	str = regex.exec(sFind)
	return str;
}