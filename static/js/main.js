function close_window() {
    document.querySelector('.my_modal').style.display = "none";
    document.querySelector('.my_modal').style.overflowY = "unset";
}

function alert_msg(error, text) {
    document.querySelector('.my_modal').style.display = "block";
    document.querySelector('.my_modal').style.overflowY = "auto";
    document.querySelector('.my_modal-title').textContent = error;
    document.querySelector('.my_modal-body').childNodes[1].textContent = text;
}

let min_pages = 1;
let max_pages;
let offset = 0;
let limit = 5;
let filter_name = "";
let condition = "";
let value = "";
let sort_by = "";
let sort_type = "";

request();

function request() {
    var url = new URL("http://127.0.0.1:8000/api/table/"),
    params = {limit:limit, offset:offset}
    if(filter_name != "") {
        params['filter_name'] = filter_name
    }
    if(condition != "") {
        params['condition'] = condition
    }
    if(value != "") {
        params['value'] = encodeURIComponent(value)
    }
    if(sort_by != "") {
        params['sort_by'] = sort_by
    }
    if(sort_type != "") {
        params['sort_type'] = sort_type
    }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => {
        return response.json();
    })
        .then(responseJson => {
            if (typeof responseJson['table'] !== "undefined") {
                document.querySelector("tbody").innerHTML = "";
                let counter = offset * limit
                responseJson['table'].forEach(el => {
                    let template = document.querySelector("#table");
                    let tmp = template.content.cloneNode(true);
                    tmp.querySelector("th:nth-child(1)").innerHTML = ++counter;
                    tmp.querySelector("td:nth-child(2)").innerHTML = el.date;
                    tmp.querySelector("td:nth-child(3)").innerHTML = el.name;
                    tmp.querySelector("td:nth-child(4)").innerHTML = el.amount;
                    tmp.querySelector("td:nth-child(5)").innerHTML = el.distance;
                    document.querySelector("tbody").appendChild(tmp);
                })
                max_pages = responseJson['amount'];
                document.querySelector(".pages").innerHTML = "";
                if (max_pages !== 0) {
                    let max = max_pages
                    max = Math.min(max, 5)
                    let min = min_pages
                    min = Math.max(min, max_pages - 4)
                    let template = document.querySelector("#pages");
                    let tmp = template.content.cloneNode(true);
                    let minimum = Math.min(offset - 1, min)
                    minimum = Math.max(minimum, min_pages)
                    let maximum = Math.max(offset + 3, max)
                    maximum = Math.min(maximum, max_pages)
                    document.querySelector(".pages").appendChild(tmp.childNodes[1]);
                    for (let i = minimum; i <= maximum; i++) {
                        template = document.querySelector("#pages");
                        tmp = template.content.cloneNode(true);
                        tmp.querySelector("button:nth-child(2)").innerHTML = i.toString();
                        if (i - 1 === offset) {
                            tmp.querySelector("button:nth-child(2)").style.color = 'red';
                        }
                        document.querySelector(".pages").appendChild(tmp.childNodes[3]);
                    }
                    template = document.querySelector("#pages");
                    tmp = template.content.cloneNode(true);
                    document.querySelector(".pages").appendChild(tmp.childNodes[5]);
                }
            } else {
                alert_msg("Ошибка", responseJson["error"] || responseJson["detail"] || responseJson["non_field_errors"]);
            }
        })
        .catch(error => {
            alert_msg("Ошибка", "Обновите страницу");
        });
}

function changeFunc() {
    const selectBox = document.querySelector("#filter_limit");
    limit = selectBox.options[selectBox.selectedIndex].value;
    offset = 0;
    request();
}

function changeOffset(value) {
    offset += value;
    if (offset < min_pages - 1) {
        offset = min_pages - 1;
    }
    if (offset > max_pages - 1) {
        offset = max_pages - 1;
    }
    request();
}

function makeOffset(value) {
    offset = value - 1;
    request();
}

function filter() {
    const selectBoxCondition = document.querySelector("#filter_condition");
    condition = selectBoxCondition.options[selectBoxCondition.selectedIndex].value;
    const selectBoxFilterName = document.querySelector("#filter_name");
    filter_name = selectBoxFilterName.options[selectBoxFilterName.selectedIndex].value;
    const selectBoxInput = document.querySelector("#filter_input");
    value = selectBoxInput.value;
    offset = 0;
    request();
}

function orderBy(el) {
    let child = el.childNodes[1].classList;
    if (child.contains('fa-arrows-up-down')) {
        child.remove('fa-arrows-up-down');
        child.add('fa-arrow-down-1-9');
        sort_type = "asc";
        document.querySelectorAll(".fa-solid").forEach(elem => {
            if (elem.parentNode !== el) {
                elem.classList.remove('fa-arrows-down-1-9');
                elem.classList.remove('fa-arrow-up-9-1');
                elem.classList.add('fa-arrows-up-down');
            }
        })
    } else if (child.contains('fa-arrow-down-1-9')) {
        child.remove('fa-arrow-down-1-9');
        child.add('fa-arrow-up-9-1');
        sort_type = "desc";
        document.querySelectorAll(".fa-solid").forEach(elem => {
            if (elem.parentNode !== el) {
                elem.classList.remove('fa-arrows-down-1-9');
                elem.classList.remove('fa-arrow-up-9-1');
                elem.classList.add('fa-arrows-up-down');
            }
        })
    } else if (child.contains('fa-arrow-up-9-1')) {
        child.remove('fa-arrow-up-9-1');
        child.add('fa-arrows-up-down');
        sort_type = "";
    }
    sort_by = el.textContent;
    offset = 0;
    request();
}
