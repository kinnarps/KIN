# KIN.utils

[KIN.utils.slide_panel](#kinutilsslide_panel)<br />
[KIN.utils.confirm_custom](#kinutilsconfirm_custom)<br />
[KIN.utils.initGallery](#kinutilsinitgallery)

## KIN.utils.slide_panel
Slides in a panel

#### Parameters
* `element` : Wrapper element for the slider (required)
* `direction` : 0 = Slide in from top, 1 = right (default), 2 = bottom, 3 = left (optional)

#### Methods
* `toggle` : Toggles the slider to animate in or out
* `display` : Displays the slider
* `hide` : Hides the slider
* `destroy` : Removes the slider from the DOM
* `settitle` : Sets the title in the panel
* `setcontent` : Sets the content in the panel

#### Example
```javascript
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
