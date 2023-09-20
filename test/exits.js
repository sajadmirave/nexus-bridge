// const cookie = []
// cookie.push({mew:"cat"})
// cookie.push({lang:"py"})

// cookie.map((i) => {
//     if(i['lang']) return console.log("hasttt")

//     return "nisttt"
// })

let session = new Map()

session.set('cat', '123')

if(session.get('mew') == undefined){
    console.log('nabod')
}else{
    
    console.log('kiri')
}