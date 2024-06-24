/* 二、會員修改頁面 */
const userAccount = document.querySelector("#userAccount");
const modifyName = document.querySelector("#modifyName");
const modifyCountry = document.querySelector("#modifyCountry");
const modifyCity = document.querySelector("#modifyCity");
const modifyGender = document.querySelector("#modifyGender");
const modifySkill = document.querySelector("#modifySkill");
const modifyRemark = document.querySelector("#modifyRemark");
const modifyAddSkill = document.querySelector("#modifyAddSkill");
const modifyDelSkill = document.querySelector("#modifyDelSkill");
const loadUserData = document.querySelector("#loadUserData");
const updateBtn = document.querySelector("#updateBtn");

const data = [];

//從localStorage中取值，需要做json解析
let userData = JSON.parse(localStorage.getItem("userData"))  || []; //當"userData"為 false、null、undefined、0、NaN 或空字符串時，使用空陣列[]作為默認值

// 將陣列資料庫儲存到瀏覽器 localStorage
function storageData() {
    let userData = JSON.stringify(data);
    localStorage.setItem("userData", userData);
}

// 驗證表單格式
function validateForm() {
    const name = document.getElementById("modifyName").value.trim();
    const selectCountry = document.getElementById("modifyCountry").value;
    const skill = skillData;
  
    if (name === "") {
        alert("請輸入姓名");
        console.log("請輸入姓名");
        return false;
    }
    else if (selectCountry === "請選擇") {
        alert("請選擇國家");
        console.log("請選擇國家");
        return false;
    }
    else if (skill.length === 0) {
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
    document.getElementById("modifyCountry").selectedIndex = 0;
    document.getElementById("modifyCity").selectedIndex = 0;
  
    // 清空或重置其他表單元素的值
    document.getElementById("modifyName").value = "";
    document.getElementById("userAccount").value = "";
    document.getElementById("modifyRemark").value = "";
  
    // 清空或重置其他特定的操作，比如清空列表或陣列
    list.innerHTML = ""; // 清空專長列表
    skillData = []; // 重置專長資料陣列
    userAccount.disabled = false;
}

//暫存user專長
let skillData = [];
const list = document.querySelector("#list");

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
    }
    else {
        alert("查無此帳號資料");
    }

});

//新增專長事件監聽
const addSkillBtn = document.querySelector("#modifyAddSkill");
modifyAddSkill.addEventListener("click", getUserSkill);

//刪除專長事件監聽
const delSkillBtn = document.querySelector("#modifyDelSkill");
modifyDelSkill.addEventListener("click", deleteUserSkill);

//修改資料事件監聽
updateBtn.addEventListener("click", function(e) {
    e.preventDefault();
    let isValid = validateForm();
    if (isValid) {
        // 提交表單成功的處理
        let modifyGender = document.querySelector('input[name="modifyGender"]:checked');
        let checkboxValues = getCheckboxValue();
        
        // 取得選擇的國家和城市文字內容
        let modifyCountry = $("#modifyCountry option:selected").text();
        let modifyCity = $("#modifyCity option:selected").text();
        
        let userData = {
            Account: userAccount.value.trim(),
            Name: modifyName.value.trim(),
            Country: modifyCountry,
            City: modifyCity,
            Gender: modifyGender ? modifyGender.value : "",
            Skill: skillData,
            Interest: checkboxValues,
            Remark: modifyRemark.value.trim()
        };
        data.push(userData);
        storageData();
        resetForm(); // 重置表單
        console.log("表單提交成功:", userData);
  
        // 重置城市選單到初始狀態
        $('#modifyCity').val('請選擇');
    } else {
        console.log("表單驗證未通過");
    }
});

// 加載城市選單
$(document).ready(function() {
    // 選國家
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
  
    // 選城市
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