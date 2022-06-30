const classInfo = require("./Freezed/class/getClassInfo")
const generateFile = require("./Freezed/freezed")

const editer= `
import "name.g.dart";
import "../person/person.dart";
class $MyName {
    const $MyName({required List<$Person> name,required int age});
}
class $Person {
    const $Person({required List<String> name,required int age});
}
`

classInfo(editer)
.then((res)=>{

     generateFile(res)
    // console.log(res.class[0].parameters)
    // console.log(res.class[1].parameters)
}).catch((err)=>{
    console.log(err);
})