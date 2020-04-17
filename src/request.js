/* REQUEST FUNCTIONS */

const axios = require('axios')
const qs = require('qs')
let api_pos = "https://api.postcodes.io/postcodes/"

export function genGet (api, param, noBase, callback) {


    axios.get(contParam(api, param)).then((response) => {

        callback({status: true, data: response.data})

    }).catch((err) => {

        callback({status: false, error: err})

    })
}

export function genPost(api, data, noBase, callback){



    const postData = qs.stringify(data)

    //console.log(postData)

    axios.post(api, postData)
      .then(function (response) {
          if(response){
            callback({status: true, data: response.data}, false)
            return
          }else{
            callback({status: false, data: response.data})
            return
          }
      })
      .catch(function (error) {
        callback({status: false, data: null, err: error})
        return
      })
}

export function getLocByPO(po, callback){
    genGet(api_pos + po, [], true, (res)=>{
        if(res.status){
            callback({status: true, data: res.data})
        } else {
            callback({status: false, error: "not postcode"})
        }
    })
}

// Construct url with paramaters
function contParam (api, param) {

    // Assumble get url paramaters
    if(param.length > 0){
        api = api + "?"


        for(var i=0;i<param.length;i++){

            if(i == param.length - 1){

                api = api + param[i].name + "=" + param[i].val
            } else {
                api = api + param[i].name + "=" + param[i].val + "&"
            }
        }
    }

    return api
}
