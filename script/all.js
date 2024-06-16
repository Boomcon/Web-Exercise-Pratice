/* 一、會員新增頁面 */
const userAccount = document.querySelector("#userAccount");
const userName = document.querySelector("#userName");
const userCountry = document.querySelector("#userCountry");
const userCity = document.querySelector("#userCity");
const userRemark = document.querySelector("#userRemark");
const signUpBtn = document.querySelector("#signUpBtn");

//建立一個陣列資料庫用來儲存會員資料
let data = [
    {
        Account: "mmorpg176@gmail.com",
        Name: "李文志",
        Country: "台灣",
        City: "台北",
        Gender: "男",
        Skill: ["寫程式", "睡覺"],
        Interest: ["電腦/組件", "手機/相機"],
        Remark: "寫程式好難"
    }
];

//將陣列資料庫儲存到瀏覽器localStorage
function storageData() {
  let userData = JSON.stringify(data);
  localStorage.setItem("userData", userData);
};

//驗證表單格式
function validateForm() {
    const email = document.getElementById("userAccount").value;
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const name = document.getElementById("userName").value;
    const selectCountry = document.getElementById("userCountry").value;
    const skill = skillData;

    if (!re.test(email)) {
        alert("無效的Email格式");
        console.log("無效的Email格式");
        return false;
    }
    else if (name === "") {
        alert("請輸入姓名");
        console.log("請輸入姓名");
        return false;
    }
    else if (selectCountry === "請選擇") {
        alert("請選擇國家");
        console.log("請選國家");
        return false;
    }
    else if (skill.length === 0) {
        alert("請輸入專長");
        console.log("請輸入專長");
        return false;
    }
    return true;
};

//重置表單
function restForm() {
  document.getElementById("dataForm").reset();

  var options = document.querySelectorAll('#userCity option');
  for (var i = 0, l = options.length; i < l; i++) {
    options[i].selected = options[i].defaultSelected;
  }
  list.innerHTML = "";
  skillData = [];
};

//暫存user專長input值
let skillData = [];
const list = document.querySelector("#list");

function getUserSkill() {
    let getskillValue = document.querySelector("#userSkill").value;
    skillData.push(getskillValue);

    let str = "";
    let skill = skillData.length;

    for (var i = 0; i < skill; i++) {
        let content = '<li>' + skillData[i] + '</li>'
        str += content;
    }

    list.innerHTML = str;
};

// //刪除user暫存專長input值 (還在修改中)
function delUserSkill() {
    let delskillValue = document.querySelector("#userSkill").value;
    let indexDel = "查無此資料";
    skillData.forEach(function(item, index) {
      if (delskillValue === item) {
        indexDel = index;
      }
    })
    if (indexDel != "查無此資料") {
      skillData.splice(indexDel, 1);
    }
    else {
      console.log(indexDel);
    }

}


//取得興趣主題checkbox值
function getCheckboxValue() {
	let array = [];
	let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

	for (var i = 0; i < checkboxes.length; i++) {
        array.push(checkboxes[i].value);
        console.log(checkboxes[i].value);
	}
  return array
};

//使用ajax + jquery建立非同步互動式下拉選單 (還在修改中)
$(document).ready(function(){
    //選國家
    $.ajax({
        url: 'https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json',
        type: "get",
		dataType: "json",
        success: function (data) {
			$.each(data,function(key,value){
				$('#userCountry').append('<option value="'+ key +'">'+ data[key].CityName +'</option>')
			})
		},
        error: function (data) {
            alert("fail");
        }
    });
    //選城市
    $("#userCountry").change(function(){
        cityvalue = $("#userCountry").val();  //取值
		$("#userCity").empty(); //清空上次的值
        $.ajax({
            url: 'https://raw.githubusercontent.com/donma/TaiwanAddressCityAreaRoadChineseEnglishJSON/master/CityCountyData.json',
            type: "get",
            dataType: "json",
            success:function(data){
				eachval = data[cityvalue].AreaList; //鄉鎮
				$.each(eachval,function(key,value){
					$("#userCity").append('<option value="'+key+'">'+eachval[key].AreaName+'</option>')
				});
			},
			error:function(){
				alert("fail");
			}
        });
    });
});

//新增專長事件監聽
const addSkill = document.querySelector("#addSkill");

addSkill.addEventListener("click", function(e) {
    if (!userSkill.value.trim()) {
        alert("請輸入要新增的專長");
        return;
    }

    getUserSkill();

    userSkill.value = "";
});

//刪除專長事件監聽
const delSkill = document.querySelector("#delSkill");

delSkill.addEventListener("click", function(e) {
    if (!userSkill.value.trim()) {
        alert("請輸入要刪除的專長");
        return;
    }

    let delskillValue = document.querySelector("#userSkill").value;
    let indexDel = "查無此資料";
    skillData.forEach(function(item, index) {
      if (delskillValue === item) {
        indexDel = index;
      }
    })
    if (indexDel != "查無此資料") {
      skillData.splice(indexDel, 1);
    }
    else {
      console.log(indexDel);
    }

});


//點擊送出表單事件監聽
signUpBtn.addEventListener("click", function(e) {
    let validate = validateForm();
    if (validate === true) {
      let obj = {};
      const userGender = document.querySelector('input[name="userGender"]:checked');
      let checkbox = getCheckboxValue();
      obj.Account = userAccount.value.trim();
      obj.Name = userName.value.trim();
      obj.Country = userCountry.value;
      obj.City = userCity.value;
      obj.Gender = userGender.value;
      obj.Skill = skillData;
      obj.Interest = checkbox;
      obj.Remark = userRemark.value.trim();
      data.push(obj);
      storageData();
      restForm();
    };
});



/* 二、會員修改頁面 */



/* 三、會員查詢頁面 */



/* 四、購物車系統頁面 */



/* 五、購物車查詢   頁面 */