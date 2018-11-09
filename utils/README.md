# KIN.utils

[KIN.utils.slidepanel](#kinutilsslide_panel)<br />
[KIN.utils.confirm_custom](#kinutilsconfirm_custom)<br />
[KIN.utils.initGallery](#kinutilsinitgallery)<br />
[KIN.utils.getParameterByName](#kinutilsgetparameterbynameparameternameurl)

## KIN.utils.slidepanel
Slides in a panel

#### Parameters
* `element` : Wrapper element for the slider (required)
* `direction` : 0 = Slide in from top, 1 = right (default), 2 = bottom, 3 = left (optional)
* `width` : Width of panel
* `onafterclose` : Callback function after panel is closed

#### Methods
* `toggle` : Toggles the slider to animate in or out
* `display` : Displays the slider
* `hide` : Hides the slider
* `destroy` : Removes the slider from the DOM
* `settitle(string)` : Sets the title in the panel
* `setcontent(string)` : Sets the content in the panel
* `isvisible` : Returns true or false

#### Example
```javascript
<div class="mypanelwrapper"></div> <!-- You can also have predefined content inside your wrapper -->
<script>
var slider = KIN.utils.slidepanel({
	element:".mypanelwrapper",
	direction:3  
});

slider.settitle("Slider title");
slider.setcontent("This is my content");

$(".someClass").on("click",function(){
	slider.destroy();
});

$(".someClass").on("click",function(){   
	slider.display()
})
</script>
```

## KIN.utils.confirm_custom

Displays a standardised popup modal that can be used for informational message och to confirm an actions, fully responsive.

#### Parameters
* `theme` : Color of the popup - lemon-yellow,flamingo-pink,chili-red default value is spring-green
* `closeOnOk` : boolean, should the popup close if user pushes the ok button
* `onOk` : required callback function to trigger on ok
* `onCancel` : optional callback function to trigger on cancel, if parameter is omitted no cancel button will be added to the popup

#### Example
```javascript
KIN.utils.confirm_custom({
	content : {
		title : 'My title',
		message : 'My message to be displayed',
		buttonCancel : 'Cancel',
		buttonOk : 'Submit'
	},
	theme : 'chili-red',
	closeOnOk : boolean,
	onOk:function(params from parameters object){},
	onCancel:function(params from parameters object){}, /*if not present no cancel button will be displayed*/
	parameters:{
		paramOne:myParamOneValue,
		paramTwo:myParamTwoValue
	}
});
```

## KIN.utils.initGallery
Creates a simple gallery browser from element selector

#### Example
```HTML
<a href="image01.jpg" class="js-gallery"><img src="thumb_image01.jpg" ></a>
<a href="image02.jpg" class="js-gallery">View image</a>

<script>
$(document).ready(function{
	KIN.utils.initGallery(".js-gallery");
})
</script>
```

## KIN.utils.getParameterByName(parametername,url)
Extracts parameter value from url
#### Example
```HTML
<script>
var parametervalue = KIN.utils.getParameterByName(parametername,url);
</script>
```
