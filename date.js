
module.exports.getDate = function (){
let today = new Date();

    var options ={
        weekday: "long",
        day:"numeric",
        month: "long"
    }
    let day = today.toLocaleDateString("en-US",options);
    
    return day;
}

exports.getDay = getDay;
function getDay(){
    let today = new Date();
    
        var options ={
            weekday: "long"
        }
        let day = today.toLocaleDateString("en-US",options);
        
        return day;
    }
    