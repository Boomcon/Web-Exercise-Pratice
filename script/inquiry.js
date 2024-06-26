/*三、會員查詢頁面*/

//會員查詢事件監聽

//會員刪除資料事件監聽

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