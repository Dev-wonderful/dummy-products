//First style, using symbol.replace, got this from docs and 
//modified it using the second style
class CustomReplacer {
    constructor(value) {
      this.value = value;
    }
    [Symbol.replace](string) {
    for (var regex in this.value){
        console.log('again')
      string = string.replace(regex, this.value[regex]);
     }
     return string
    }
}
const obj = {
      '\[DATE\]': 'today',
    '\[NUMBER_OF\]': 'Five'
  }
var txt = "[NUMBER_OF] football matches [DATE]"
console.log(txt.replace(new CustomReplacer(obj))); // "#!@?tball"



//Second style, using a custom function that has been chained to the String.prototype object
//Got this from stackOverflow
String.prototype.inputUserDetails = function(obj) {
    var retStr = this;
    for (var x in obj) {
        retStr = retStr.replace(new RegExp(x, 'gi'), obj[x]);
    }
    return retStr;
};
const sample = { 
    "\\[WEBSITE_CONTACT_EMAIL\\]": "ade@gmail.com", 
    "\\[WEBSITE_CONTACT_PAGE_URL]": "ade.com.ng"
}
console.log(file.inputUserDetails(sample))