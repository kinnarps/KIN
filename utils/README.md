# KIN.utils
Displays a standardised popup modal that can be used for informational message och to confirm an actions, fully responsive.

## KIN.utils.confirm_custom

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
		})
```
