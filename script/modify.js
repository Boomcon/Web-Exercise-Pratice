/* 二、會員修改頁面 */
const userAccount = document.querySelector("#userAccount");
const modifyName = document.querySelector("#modifyName");
const modifyCountry = document.querySelector("#modifyCountry");
const modifyCity = document.querySelector("#modifyCity");
const modifyRemark = document.querySelector("#modifyRemark");
const modifyAddSkill = document.querySelector("#modifyAddSkill");
const modifyDelSkill = document.querySelector("#modifyDelSkill");
const loadUserData = document.querySelector("#loadUserData");
const updateBtn = document.querySelector("#updateBtn");
const modifyDate = document.querySelector("#modifyDate");
const modifySerialNumber = document.querySelector("#modifySerialNumber");
const list = document.querySelector("#list");

//暫存user專長
let skillData = [];

//從localStorage中取值，需要做json解析
let userData = JSON.parse(localStorage.getItem("userData"))  || []; //當"userData"為 false、null、undefined、0、NaN 或空字符串時，使用空陣列[]作為默認值

// 將陣列資料庫儲存到瀏覽器 localStorage
function storageData() {
    localStorage.setItem("userData", JSON.stringify(userData));
}

// 驗證表單格式
function validateForm() {
    let name = modifyName.value.trim();
    let selectCountry = modifyCountry.value;
  
    if (name === "") {
        alert("請輸入姓名");
        console.log("請輸入姓名");
        return false;
    } else if (selectCountry === "請選擇") {
        alert("請選擇國家");
        console.log("請選擇國家");
        return false;
    } else if (skillData.length === 0) {
        alert("請輸入專長");
        console.log("請輸入專長");
        return false;
    }
    return true;
}

// 重置表單
function resetForm() {
    document.getElementById("modifyForm").reset(); // 使用原生 reset() 方法重置表單
  
    // 重置下拉選單到初始狀態
    modifyCountry.selectedIndex = 0;
    modifyCity.innerHTML = `<option value="請選擇">請選擇</option>`;
  
    // 清空或重置其他表單元素的值
    modifyName.value = "";
    userAccount.value = "";
    modifyRemark.value = "";
  
    // 清空或重置其他特定的操作，比如清空列表或陣列
    list.innerHTML = ""; // 清空專長列表
    skillData = []; // 重置專長資料陣列
    userAccount.disabled = false;
}

//取得user專長
function getUserSkill() {
    let userSkillInput = document.querySelector("#modifySkill");
    let getskillValue = userSkillInput.value.trim();
  
    if (getskillValue === "") {
        alert("請輸入要新增的專長");
        return;
    }
  
    skillData.push(getskillValue);
    upDateSkillList();
    userSkillInput.value = "";
}

// 刪除user暫存專長input值
function deleteUserSkill() {
    let userSkillInput = document.querySelector("#modifySkill");
    let delskillValue = userSkillInput.value.trim();
  
    if (delskillValue === "") {
        alert("請輸入要刪除的專長");
        return;
    }
  
    let index = skillData.indexOf(delskillValue);
    if (index !== -1) {
        skillData.splice(index, 1);
        upDateSkillList();
    } else {
        console.log("找不到要刪除的專長");
    }
    userSkillInput.value = "";
}

//更新專長列表
function upDateSkillList() {
    let str = "";
    skillData.forEach(function(skill) {
        str += `<li>${skill}</li>`;
    });
    list.innerHTML = str;
}

// 取得興趣主題checkbox值
function getCheckboxValue() {
    let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
    let values = [];
    checkboxes.forEach(function(checkbox) {
        values.push(checkbox.value);
    });
    return values;
}

//載入會員資料事件監聽
loadUserData.addEventListener("click", function() {
    let account = userAccount.value.trim();
    let user = userData.find(user => user.Account === account);

    if(user) {
        userAccount.disabled = true;
        modifyName.value = user.Name;
        document.querySelector(`input[name="modifyGender"][value="${user.Gender}"]`).checked = true;

        //填充專長
        skillData = user.Skill;
        upDateSkillList();

        //填充興趣主題
        let interests = user.Interest;
        document.querySelectorAll('input[type=checkbox]').forEach(function(checkbox) {
            checkbox.checked = interests.includes(checkbox.value);
        });

        modifyRemark.value = user.Remark;
        modifyDate.value = user.RegisterDate; // 顯示註冊日期
        modifySerialNumber.value = user.SerialNumber; // 顯示流水號
    } else {
        alert("查無此帳號資料");
    }

});

//新增專長事件監聽
modifyAddSkill.addEventListener("click", getUserSkill);

//刪除專長事件監聽
modifyDelSkill.addEventListener("click", deleteUserSkill);

//修改資料事件監聽
updateBtn.addEventListener("click", function(e) {
    e.preventDefault();
    if (validateForm()) {
        // 提交表單成功的處理
        let modifyGender = document.querySelector('input[name="modifyGender"]:checked').value;
        let checkboxValues = getCheckboxValue();
        
        // 取得選擇的國家和城市文字內容
        let selectedCountry = $("#modifyCountry option:selected").text();
        let selectedCity = $("#modifyCity option:selected").text();
        
        let user = {
            Account: userAccount.value.trim(),
            Name: modifyName.value.trim(),
            Country: selectedCountry,
            City: selectedCity,
            Gender: modifyGender,
            Skill: skillData,
            Interest: checkboxValues,
            Remark: modifyRemark.value.trim(),
            // 保留註冊日期和流水號
            RegisterDate: modifyDate.value,
            SerialNumber: modifySerialNumber.value
        };

        let userIndex = userData.findIndex(u => u.Account === user.Account);
        if (userIndex !== -1) {
            userData[userIndex] = user;
        } else {
            userData.push(user);
        }
        storageData();
        resetForm();
        console.log("表單提交成功:", user);
    } else {
        console.log("表單驗證未通過");
    }
});

// 加載城市選單
$(document).ready(function() {
    $.ajax({
        url: 'https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json',
        type: "get",
        dataType: "json",
        success: function(data) {
            $.each(data, function(key, value) {
                $('#modifyCountry').append(`<option value="${key}">${value.CityName}</option>`);
            });
        },
        error: function() {
            alert("無法獲取資料");
        }
    });
  
    $("#modifyCountry").change(function() {
        let cityvalue = $(this).val();
        $("#modifyCity").empty();
        $.ajax({
            url: 'https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json',
            type: "get",
            dataType: "json",
            success: function(data) {
                let eachval = data[cityvalue].AreaList;
                $.each(eachval, function(key, value) {
                    $("#modifyCity").append(`<option value="${key}">${value.AreaName}</option>`);
                });
            },
            error: function() {
                alert("無法獲取城市資料");
            }
        });
    });
});