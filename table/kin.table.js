KIN.table = {

		init : function(config){
			_this = this;
			this.portletNamespace 			= config.portletNamespace;
			this.hitsperpage 				= config.hitsperpage;
			this.pagenumber 				= config.pagenumber;
			this.dataurl 					= config.dataurl;
			this.parameterurl 				= config.dataurl; 
			this.loader 					= (typeof config.loader !== "undefined" )?config.loader:this.loader;
			this.loadermsg 					= (typeof config.loadermsg !== "undefined" )?config.loadermsg:"";
			this.config 					= config;
			this.savestate					= (typeof config.savestate !== "undefined" )?config.savestate:this.savestate;
			
			//localStorage.setItem('tablestate', '{}'); måste ha en unik identifierare för sidan okcås
			var tablestate = sessionStorage.getItem('tablestate');
			
			if(tablestate){
				tablestate = JSON.parse(tablestate);
				KIN.table.tablestate = tablestate;
				this.hitsperpage = tablestate.hitsperpage
				this.pagenumber = tablestate.pagenumber
				this.tablestate = tablestate
			}
				
			
			var stylesize = ((config || {}).stylesize)?"small":"";
			var density = ((config || {}).density)?config.density:this.density;
						
			var wrapperHtml = '<div class="KIN_table_header"></div><div class="KIN_table_body '+stylesize+' density-'+density+'"></div><div class="KIN_table_footer"></div>';
			
			$(config.wrapperelement).html(wrapperHtml)
			
			var headerHtml = this.getHtmlHeaders(config.columns)
			$(".KIN_table_header").html(headerHtml);
			
			
			this.parameterurl = this.parameterurl + "&hitsPerPage="+this.hitsperpage+"&pagenumber="+this.pagenumber;
			
			if(tablestate){
				for (var member in tablestate) {
					_this.parameterurl = _this.parameterurl + "&"+member+"="+ tablestate[member]
				}
			}
			
			if(this.loader){
				KIN.ui.page_loader.show({text:this.loadermsg})
			}
			console.log(this.parameterurl)
			$.when(
					this.getPromise(this.parameterurl)
			).then(function(response){
					KIN.table.responsedata = response;
					if(typeof(_this.config.ondataloaded) === 'function'){
						returndata = _this.config.ondataloaded(KIN.table.responsedata);
						if(returndata){
							KIN.table.responsedata = returndata;
						}
					}
				
					var bodyHtml = _this.getHtmlTableBody(KIN.table.responsedata.items,config.columns,config.actions)	
					$(".KIN_table_body").html(bodyHtml)
					$(".KIN_table_footer").append(_this.getHtmlHitsPerPage());
					$(".KIN_table_footer").append(_this.getHtmlPaginator());
					$("#KIN_table_hitsperpage").val(_this.hitsperpage)
					_this.initPaginator(KIN.table.responsedata);
					if(_this.loader){
						KIN.ui.page_loader.destroy()
					}
					
					
			});
			
			$(document).on("click",".js-action-click",function(){
				var index = $(this).attr("data-count");
				var actionIndex = $(this).attr("data-item-action-count");
				var parameter = $(this).attr("data-parameter")
				var parameterType = $(this).attr("data-parameter-type")
				
				if(parameterType == "object"){
					parameter = JSON.parse(parameter);
				}
				
				var itemActions = KIN.table.actions.storage[index];
				itemActions[actionIndex](parameter);
				KIN.table.actions.hide();
			});
			$(document).on("click",".js-click-sort",function(){
				$(".js-click-sort").removeClass("current");
				$(this).addClass("current");
				KIN.table.urlparameters.sortdirection = $(this).data('direction');
				KIN.table.urlparameters.sortby = $(this).data('col'); 
				KIN.table.update();
			});
			
			return this;
		},
		update : function(config){
			_this = this;
					
			if ( (_this.config || {}).beforeupdate && typeof(_this.config.beforeupdate) === 'function') 
				_this.config.beforeupdate();
			
			if(this.loader){
				KIN.ui.page_loader.show({text:this.loadermsg})
			}
			
			if(this.savestate){
				var tablestate = {
						hitsperpage : _this.hitsperpage,
						pagenumber : _this.pagenumber
				}
				for (var member in KIN.table.statevalues) {
					tablestate[member] = KIN.table.statevalues[member] 
				}
				sessionStorage.setItem('tablestate',JSON.stringify(tablestate));
				/*var tablestate = sessionStorage.getItem('tablestate');
			
				if(tablestate){
					//tablestate = JSON.parse(tablestate);
					tablestate.hitsperpage = _this.hitsperpage
					tablestate.pagenumber = _this.pagenumber
					for (var member in KIN.table.statevalues) {
						tablestate[member] = KIN.table.statevalues[member] 
					}
					sessionStorage.setItem('tablestate',JSON.stringify(tablestate));
				}else{
					var tablestate = {
							hitsperpage : _this.hitsperpage,
							pagenumber : _this.pagenumber
					}
					for (var member in KIN.table.statevalues) {
						tablestate[member] = KIN.table.statevalues[member] 
					}
					sessionStorage.setItem('tablestate',JSON.stringify(tablestate));
				}*/
			}
	
			this.parameterurl = this.dataurl + "&hitsPerPage="+this.hitsperpage+"&pagenumber="+this.pagenumber;

			
			for (var member in KIN.table.urlparameters) {
					this.parameterurl = this.parameterurl + "&"+member+"="+KIN.table.urlparameters[member]
			}
			
			
						
			$.when(
					this.getPromise(_this.parameterurl)
			).then(function(response){
					var bodyHtml = _this.getHtmlTableBody(response.items,_this.config.columns,_this.config.actions)	
					$(".KIN_table_body").html(bodyHtml) 
					_this.initPaginator(response);
					if(_this.loader){
						KIN.ui.page_loader.destroy()
					}
					if ( (_this.config || {}).afterupdate && typeof(_this.config.afterupdate) === 'function') 
						_this.config.afterupdate(response);
			});
		},
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
		getHtmlTableBody : function(data,columns,actions){
			var _this = this;
			var htmlBody = '';
			
			$.each(data,function(i,item){
				var rowHtml = '';
				rowHtml += '<div class="row table-row">';
				for (i0 = 0; i0 < columns.length; i0++) {
					if(columns[i0].type == "1" || columns[i0].type == "2"){ 
						if(columns[i0].formatter && typeof(columns[i0].formatter) === 'function'){
							var formattedColumn = columns[i0].formatter({item:item,columnvalue:item[columns[i0].datafield]});
							rowHtml += '<div class="col-md-'+columns[i0].columnwidth+'"><p>'+formattedColumn+'</p></div>';
						}else{
							rowHtml += '<div class="col-md-'+columns[i0].columnwidth+'"><p>'+item[columns[i0].datafield]+'</p></div>';
						}
					}else if(columns[i0].type == "3"){
						var className = 'js-wrapper__actions_' + i + ' wrapper__actions  lfr-icon-menu'
						rowHtml += '<div class="col-md-'+columns[i0].columnwidth+'"><div class="' + className + '">'+
						'<div class="actions__row actions_' + i + '">';
						var itemActions = [];
						var itemParameters = [];
						for(a0 = 0 ; a0 < actions.length ; a0++){
							
							itemActions.push(actions[a0].callback);
							
							var callBackParameter;
							var parameterType = "";
							 
							if(typeof actions[a0].parameter === "object"){
								//If parameter is an object with $[text] we want to replace with data from json as parameters to the callback function
								var tempObject = {};
								for (var member in actions[a0].parameter) {

									var sFind = actions[a0].parameter[member];
									var test = _parseParameter(sFind)
									
									if(test == null){
										tempObject[member] = sFind; 
									}else{
										tempObject[member] = item[test[1]];
									}
									
									
							    }  		
																
								//callBackParameter = JSON.stringify(actions[a0].parameter);
								callBackParameter = JSON.stringify(tempObject);
								parameterType = "object"
							} else{
								var sFind = actions[a0].parameter;
								
								var test = _parseParameter(sFind)
								if(test == null){
									callBackParameter = sFind;
								}else{
									callBackParameter = item[test[1]];
								}
								
								parameterType = "string"
							}
							
							rowHtml += '<div><a class="js-action-click" id="actionItem_' + i + '_' + a0 +  '" href="javascript:void(0)" data-count="'+i+'" data-parameter-type="'+parameterType+'" data-item-action-count="'+a0+'"  data-parameter=\''+callBackParameter+'\'>';
							if(typeof actions[a0].icon !== "undefined"){
								rowHtml += '<i class="'+actions[a0].icon+'"></i>';
							}
							 
							rowHtml += '<span class="text75" id="actionspan' + a0 + '" >'+actions[a0].title+'</span>'+
							'</a></div>';
						}
						KIN.table.actions.storage.push(itemActions);
						rowHtml += '</div>'+
						'<a href="javascript:void(0)" onclick="KIN.table.actions.toggle(' + i + ',this)" class="btn dropdown-toggle small"><i class="caret"></i>Actions</a>'+
						'</div>'+
						'</div>';
					}
				}   
				//data[tableObject.dataOffset][j][tableObject.columns[i].datafield]
				rowHtml += '</div>';
				if(typeof(_this.config.rowformatter) === 'function')
					_this.config.rowformatter($.parseHTML(rowHtml),item);
				
				htmlBody += rowHtml;
			});
			
			return htmlBody;
		},
		getHtmlHitsPerPage : function(){
			
			$(document).on("change","#KIN_table_hitsperpage",function(){
				KIN.table.hitsperpage = $(this).val();
				KIN.table.update();
			})
			
			return '<div class="hitsPerPageWrapper"><span>Hits per page</span><select name="KIN_table_hitsperpage" id="KIN_table_hitsperpage" class="no-print">'+
						'<option value="10">10</option>'+
						'<option value="20">20</option>'+
						'<option value="50">50</option>'+
						'<option value="100">100</option>'+
						'<option value="250">250</option>'+
					'</select>'+
					'</div>';
			
		},
		getHtmlPaginator : function(){
			return '<div class="simple-pagination no-print"></div>';
		},
		initPaginator : function(data){
			$(".simple-pagination").pagination({ 
			    items: data.hits,
			    itemsOnPage: KIN.table.hitsperpage,
			    cssStyle: 'light-theme',
			    currentPage : data.currentPage,
			    ellipsePageSet:true,
			    hrefTextPrefix:'',
			    onPageClick : function(pagenumber,event)
			    {
					if(typeof event !== "undefined")
			    		event.preventDefault();
					KIN.table.pagenumber = pagenumber;
					KIN.table.update();
			    }
			});	
		},
		getPromise : function(uri){
			return $.ajax({
		        type: 'GET',
		        dataType: 'json',
		        data: {},
		    	url : uri,
		        error: function (jqXHR, textStatus, errorThrown) {
		            console.log(jqXHR)
		            console.log(errorThrown)
		        }
		    });
		},
		actions : {
			previous : "",
			storage : [],
			toggle : function(id,elem){
				var id2 = id.toString().trim();
				
				if(this.previous == id2 ){
					$('.actions__row.actions_'+id2).toggleClass('open');
					$('.js-wrapper__actions_'+id2).toggleClass('open');
					return;
				}
				
				$(".actions__row").removeClass("open");
				$(".wrapper__actions").removeClass("open");
					
				$('.actions__row.actions_'+id2).css("right",(elem.offsetWidth + 44)); 
				$('.actions__row.actions_'+id2).toggleClass('open');
				$('.js-wrapper__actions_'+id2).toggleClass('open');
				
				this.previous = id2;
			},
			execute : function(elem, url){
				console.log(elem)
				//window.location.href = url;
			},
			hide : function(){
				$(".actions__row").removeClass("open");
				$(".wrapper__actions").removeClass("open");
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
		tablestate : {} 
		
}

function _parseParameter(str){
	var regex = /\$\[([^]+)\]/
	var sFind = str; 
	str = regex.exec(sFind)
	return str;
}
