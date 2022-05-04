const FEP = document.createElement("div");
let sc = document.createElement("script");

FEP.id = "foreground"
sc.src = 'foreground.bundle.js'

FEP.appendChild(sc)

document.querySelector("body").appendChild(FEP)


