# KIN.ui

[KIN.ui.page_loader](#kinuipage_loader)<br />
[KIN.ui.button_loader](#kinuibutton_loader)

## KIN.ui.page_loader
Displays a standardised loader <br />
![Image of page loader](https://raw.githubusercontent.com/kinnarps/KIN/master/ui/resources/KIN_ui_page_loader.gif)

#### Methods
* `show` : Displays the loader
* `destroy` : Removs the loader

#### Example
```javascript
  KIN.ui.page_loader.show({text:"Your loading text"})
  
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
