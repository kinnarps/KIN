# KIN.ui

[KIN.ui.page_loader](#kinuipage_loader)<br />
[KIN.ui.button_loader](#kinuibutton_loader)

## KIN.ui.page_loader
Displays a standardised loader

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
![Image of loader](https://raw.githubusercontent.com/kinnarps/KIN/master/ui/resources/KIN_ui_button_loader.gif)

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
