/* 三、會員查詢頁面 */
const startDate = document.querySelector("#startDate");
const endDate = document.querySelector("#endDate");
const userRegistered = document.querySelector("#userRegistered");
const serialNumber = document.querySelector("#serialNumber");
const userCountry = document.querySelector("#userCountry");
const userCity = document.querySelector("#userCity");
const inquiryButton = document.querySelector("#inquiry input[type='button']");
const membersheet = document.querySelector(".membersheet");
const memberTableBody = document.querySelector("#memberTableBody");

// 會員查詢驗證
function validateForm() {
    let account = userRegistered.value.trim();
    let re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let number = serialNumber.value.trim();
    let selectCountry = userCountry.value;
    let selectCity = userCity.value;

    if (account !== "" && !re.test(account)) {
        alert("無效的Email格式");
        console.log("無效的Email格式");
        return false;
    } else if (!startDate.value && !endDate.value && account === "" && number === "" && selectCountry === "請選擇" && selectCity === "請選擇") {
        alert("至少輸入一項查詢條件");
        console.log("至少輸入一項查詢條件");
        return false;
    }
    return true;
}

// 顯示查詢結果
function displayMembers(members) {
    memberTableBody.innerHTML = "";

    if (members.length === 0) {
        alert("查無資料");
        console.log("查無資料");
        return;
    }

    members.forEach(member => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="checkbox" class="checkbox"></td>
            <td>${member.RegisterDate}</td>
            <td>${member.SerialNumber}</td>
            <td>${member.Account}</td>
            <td>${member.Country}</td>
            <td>${member.City}</td>
            <td>${member.Name}</td>
            <td>${member.Gender}</td>
            <td><a href="modify.html"><input type="button" value="修改" class="fix"></a></td>
        `;
        memberTableBody.appendChild(row);
    });

    membersheet.style.display = "block"; // 顯示表格
}

// 清空查詢輸入資料
function resetSearchForm() {
    startDate.value = "";
    endDate.value = "";
    userRegistered.value = "";
    serialNumber.value = "";
    userCountry.selectedIndex = 0;
    userCity.innerHTML = `<option value="請選擇">請選擇</option>`;
}

// 根據查詢條件過濾資料
function filterMembers(userData) {
    return userData.filter(member => {
        let matches = true;
        if (userRegistered.value && member.Account !== userRegistered.value.trim()) matches = false;
        if (serialNumber.value && member.SerialNumber !== serialNumber.value.trim()) matches = false;
        if (userCountry.value !== "請選擇" && member.Country !== userCountry.options[userCountry.selectedIndex].text) matches = false;
        if (userCity.value !== "請選擇" && member.City !== userCity.options[userCity.selectedIndex].text) matches = false;
        if (startDate.value && new Date(member.RegisterDate) < new Date(startDate.value)) matches = false;
        if (endDate.value && new Date(member.RegisterDate) > new Date(endDate.value)) matches = false;
        return matches;
    });
}

// 會員查詢事件監聽
inquiryButton.addEventListener("click", function() {
    if (validateForm()) {
        let userData = JSON.parse(localStorage.getItem("userData")) || [];
        let filteredData = filterMembers(userData);
        displayMembers(filteredData);
        resetSearchForm(); // 清空查詢輸入資料
    }
});

// 會員刪除資料事件監聽
const delUser = document.querySelector("#delUser");
delUser.addEventListener("click", function() {
    let userData = JSON.parse(localStorage.getItem("userData")) || [];
    const checkboxes = document.querySelectorAll(".membersheet table .checkbox:checked");
    checkboxes.forEach(checkbox => {
        const row = checkbox.closest("tr");
        const serialNumber = row.querySelector("td:nth-child(3)").textContent;
        userData = userData.filter(member => member.SerialNumber !== serialNumber);
    });
    localStorage.setItem("userData", JSON.stringify(userData));

    // 重新過濾資料並顯示
    let filteredData = filterMembers(userData);
    displayMembers(filteredData);
});

// 使用ajax + jquery建立非同步互動式下拉選單
$(document).ready(function () {
    // 選國家
    $.ajax({
        url: 'https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json',
        type: "get",
        dataType: "json",
        success: function (data) {
            $.each(data, function (key, value) {
                $('#userCountry').append(`<option value="${key}">${value.CityName}</option>`);
            });
        },
        error: function () {
            alert("無法獲取資料");
        }
    });

    // 選城市
    $("#userCountry").change(function () {
        let cityvalue = $(this).val();
        $("#userCity").empty();
        $.ajax({
            url: 'https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json',
            type: "get",
            dataType: "json",
            success: function (data) {
                let eachval = data[cityvalue].AreaList;
                $.each(eachval, function (key, value) {
                    $("#userCity").append(`<option value="${key}">${value.AreaName}</option>`);
                });
            },
            error: function () {
                alert("無法獲取城市資料");
            }
        });
    });
});