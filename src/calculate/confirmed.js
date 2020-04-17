import { getDateFromTs } from '../utils'

export function confirmCal(history, today){
    return new Promise(resolve => {

        let res = {
            cates: [],
            co: [],
            death: [],
            coDaily: [],
            coInc: [],
        }

        // Loop
        history.forEach((el, index)=>{
            el.date = getDateFromTs(el.date, "datesimple")
            res.cates.push(el.date)
            res.co.push(el.confirmed)
            res.death.push(el.death)

            let increse

            // Daily and Inc
            if(index == 0){
                // Daily
                res.coDaily.push(el.confirmed - 0)
                
                // Inc
                increse = parseFloat((el.confirmed-0)/10).toFixed(4)
            } 
            
            else {
                // Daily
                res.coDaily.push(el.confirmed - history[index-1].confirmed)

                // Inc
                let last = history[index-1].confirmed
                if(last == 0){
                    increse = el.confirmed
                } else{
                    increse = parseFloat((el.confirmed-last)/last).toFixed(4)
                }
            }

            res.coInc.push((increse*100).toFixed(4))
            
        })

        // The last one
        res.cates.push(getDateFromTs(Date.parse( new Date()), "datesimple"))
        res.co.push(today.confirmed)
        res.death.push(today.death)


        res.coDaily.push(today.confirmed - history[history.length-1].confirmed )
        res.coDaily.unshift(0)

        // Push latest data as its not belong to the history
        let todayLast = history[history.length-1].confirmed
        let todayInc = (Number.parseFloat((today.confirmed - todayLast) / todayLast).toFixed(4))
        res.coInc.push((todayInc*100).toFixed(4))

        resolve(res)
    })
}
