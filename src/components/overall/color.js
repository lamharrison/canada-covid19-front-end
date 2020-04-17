const colors = [
    {
        txt: "confirmed",
        color: "#FF5151"
    },
    {
        txt: "death",
        color: "#FFCE1F"
    },
    {
        txt: "cured",
        color: "#31DA93"
    },
    {
        txt: "tested",
        color: "#46DEFF"
    },
    {
        txt: "negative",
        color: "#56FFB8"
    },
    {
        txt: "serious",
        color: "#D21414"
    },
    {
        txt: "D. Posi.",
        color: "#9289FF"
    },
    {
        txt: "Posi. Rate",
        color: "#9289FF"
    },
    {
        txt: "suspected",
        color: "#A98AFF"
    },
]

export function putColor(str){
      
    for(let i=0;i<colors.length;i++){
        if(str == colors[i].txt){
        return colors[i].color
        }
    }

    return ""
      
}
