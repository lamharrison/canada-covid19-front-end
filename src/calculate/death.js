export function deathCal (history, today) {
    return new Promise(resolve => {
        let res = {
            inc: [],
            rate: []
        }

        // Loop
        history.forEach((el, index) => {

            let increse
            let rate

            if(index == 0){
                increse = el.death-0
                rate = 0
            }
            else{
                // Inc
                let last = history[index-1].death
                increse = el.death-last

                // Rate
                rate = parseFloat((el.death)/el.confirmed).toFixed(4)*100
            }

            res.inc.push(increse)
            res.rate.push(rate.toFixed(4))

        })

        // The Last One
        res.inc.push(today.death - history[history.length-1].death)

        let tod = parseFloat((today.death)/today.confirmed).toFixed(4)*100
        res.rate.push(tod.toFixed(4))
        
        
        resolve(res)
    })
}
