/* 一、會員新增頁面 */
// 暫存user專長input值
let skillData = [];
const list = document.querySelector("#list");

// 將陣列資料庫儲存到瀏覽器 localStorage
function storageData(data) {
    let userData = JSON.stringify(data);
    localStorage.setItem("userData", userData);
}

// 驗證表單格式
function validateForm() {
    const email = document.getElementById("userAccount").value.trim();
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const name = document.getElementById("userName").value.trim();
    const selectCountry = document.getElementById("userCountry").value;
    const skill = skillData;

    if (!re.test(email)) {
        alert("無效的Email格式");
        console.log("無效的Email格式");
        return false;
    } else if (name === "") {
        alert("請輸入姓名");
        console.log("請輸入姓名");
        return false;
    } else if (selectCountry === "請選擇") {
        alert("請選擇國家");
        console.log("請選擇國家");
        return false;
    } else if (skill.length === 0) {
        alert("請輸入專長");
        console.log("請輸入專長");
        return false;
    }
    return true;
}

// 重置表單
function resetForm() {
    document.getElementById("dataForm").reset(); // 使用原生 reset() 方法重置表單

    // 重置下拉選單到初始狀態
    document.getElementById("userCountry").selectedIndex = 0;
    document.getElementById("userCity").selectedIndex = 0;

    // 清空或重置其他表單元素的值
    document.getElementById("userName").value = "";
    document.getElementById("userAccount").value = "";
    userCity.innerHTML = `<option value="請選擇">請選擇</option>`;
    document.getElementById("userRemark").value = "";

    // 清空或重置其他特定的操作，比如清空列表或陣列
    list.innerHTML = ""; // 清空專長列表
    skillData = []; // 重置專長資料陣列
}

//取得user專長值
function getUserSkill() {
    let userSkillInput = document.querySelector("#userSkill");
    let getskillValue = userSkillInput.value.trim();

    if (getskillValue === "") {
        alert("請輸入要新增的專長");
        return;
    }

    skillData.push(getskillValue);
    renderSkillList();
    userSkillInput.value = "";
}

//刪除user專長值
function deleteUserSkill() {
    let userSkillInput = document.querySelector("#userSkill");
    let delskillValue = userSkillInput.value.trim();

    if (delskillValue === "") {
        alert("請輸入要刪除的專長");
        return;
    }

    let index = skillData.indexOf(delskillValue);
    if (index !== -1) {
        skillData.splice(index, 1);
        renderSkillList();
    } else {
        console.log("找不到要刪除的專長");
    }
    userSkillInput.value = "";
}

//user專長新增渲染
function renderSkillList() {
    let str = "";
    skillData.forEach(function (skill) {
        str += `<li>${skill}</li>`;
    });
    list.innerHTML = str;
}

//取得user興趣
function getCheckboxValue() {
    let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    let values = [];
    checkboxes.forEach(function (checkbox) {
        values.push(checkbox.value);
    });
    return values;
}

// 監聽新增專長按鈕
const addSkillBtn = document.querySelector("#addSkill");
addSkillBtn.addEventListener("click", getUserSkill);

// 監聽刪除專長按鈕
const delSkillBtn = document.querySelector("#delSkill");
delSkillBtn.addEventListener("click", deleteUserSkill);

// 點擊送出表單事件監聽
const signUpBtn = document.querySelector("#signUpBtn");
signUpBtn.addEventListener("click", function (e) {
    e.preventDefault();
    let isValid = validateForm();
    if (isValid) {
        // 提交表單成功的處理
        let userGender = document.querySelector('input[name="userGender"]:checked');
        let checkboxValues = getCheckboxValue();

        // 取得選擇的國家和城市文字內容
        let selectedCountry = $("#userCountry option:selected").text();
        let selectedCity = $("#userCity option:selected").text();

        // 獲取當前日期
        let currentDate = new Date();
        let formattedDate = currentDate.toISOString().split('T')[0];

        // 獲取當前儲存的資料
        let userData = JSON.parse(localStorage.getItem("userData")) || [];

        // 生成會員編號
        let serialNumber = (userData.length + 1).toString().padStart(8, '0');

        let newUser = {
            Account: document.getElementById("userAccount").value.trim(),
            Name: document.getElementById("userName").value.trim(),
            Country: selectedCountry,
            City: selectedCity,
            Gender: userGender ? userGender.value : "",
            Skill: skillData,
            Interest: checkboxValues,
            Remark: document.getElementById("userRemark").value.trim(),
            RegisterDate: formattedDate,
            SerialNumber: serialNumber
        };

        userData.push(newUser);
        storageData(userData);
        resetForm(); // 重置表單
        alert("您的會員編號為:" + serialNumber);
        console.log("表單提交成功:", newUser);
    } else {
        console.log("表單驗證未通過");
    }
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