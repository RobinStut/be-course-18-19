console.log("working on it");

function socket() {
    var socket = io();
    socket.on('festivalData', function (data) {
        // console.log(data);
        festivalOverview(data)
    });
}
socket()



function festivalOverview(data) {
    console.log(data);
}


(function () {
    let input, toUpper, festivalSection, festivalName, i, textValue;
    input = document.getElementById("festivalSearchField");
    input.addEventListener("keyup", (e) => {
        toUpper = input.value.toUpperCase();
        festivalSection = document.getElementsByTagName("label");
        for (i = 0; i < festivalSection.length; i++) {
            festivalName = festivalSection[i].getElementsByTagName("H3")[0];
            textValue = festivalName.textContent || festivalName.innerText;
            if (textValue.toUpperCase().indexOf(toUpper) > -1) {
                festivalSection[i].style.display = "";
            } else {
                festivalSection[i].style.display = "none";
            }
        }
    }, false);

    const festivalSelectionForm = document.getElementById('festivalSelectionForm')
    festivalSelectionForm.addEventListener('submit', async function (e) {
        e.preventDefault()
        let i;
        let selectedFestivalArray = []
        for (i = 0; i < e.target.length; i++) {
            if (e.target[i].checked) {
                const idOfSelectedFestival = e.target[i].id;
                selectedFestivalArray.push(idOfSelectedFestival)
            }
        }
        console.log(selectedFestivalArray);
        const clientId = 'fakeName'
        const data = await fetch(`/updateFestivalPreferences/${clientId}/${selectedFestivalArray}`)


    })


})()