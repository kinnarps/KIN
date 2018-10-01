# KIN.ui

[KIN.ui.page_loader](#kinuipage_loader)<br />
[KIN.ui.button_loader](#kinuibutton_loader)<br />
[KIN.ui.snackbar](#kinuisnackbar)

## KIN.ui.page_loader
Displays a standardised loader <br />
![Image of page loader](https://raw.githubusercontent.com/kinnarps/KIN/master/ui/resources/KIN_ui_page_loader.gif)

#### Methods
* `show` : Displays the loader
* `destroy` : Removs the loader

#### Configuration
* `text` : Text to display 
* `width` : Width of loader box, default 100% (needs unit %, px etc)

#### Example
```javascript
  KIN.ui.page_loader.show({text:"Your loading text",width:"10%"})
  
  /* Do your stuff */ 
  
  KIN.ui.page_loader.destroy()  
```

## KIN.ui.button_loader
Displays a loader inside a button<br />
![Image of button loader](https://raw.githubusercontent.com/kinnarps/KIN/master/ui/resources/KIN_ui_button_loader.gif)

#### Methods
* `display` : Displays the loader
* `destroy` : Removs the loader

#### Configuration
* `element` : Button element that should display the loader
* `theme` : Default white, valid options is lemon-yellow, flamingo-pink, chili-red, spring-green and kin-black

#### Example
Note that the button should contain a span element with the class button__text containing the text.
```html
<a href="javascript:void(0)" class="btn btn-default"><span class="button__text">My button text</span></a>

<script>
$(document).ready(function(){
	$(".btn-default").on("click",function(){
		KIN.ui.button_loader.display({
			element:this,
			theme:"kin-black"
		});
		
		/* Do something */
		KIN.ui.button_loader.destroy({  
			element:'.button-element'
		});
	});
});
</script>

```

## KIN.ui.snackbar
Provide a brief messages about app processes at the bottom of the screen <br />
![Image of page loader](https://raw.githubusercontent.com/kinnarps/KIN/master/ui/resources/snackbar1.png)
