document.addEventListener("DOMContentLoaded", function() {
    const startDateInput = document.querySelector("#startDate");
    const endDateInput = document.querySelector("#endDate");
    const memberSelect = document.querySelector("#memberSelect");
    const queryButton = document.querySelector("#queryButton");
    const orderTable = document.querySelector("#orderTable");

    // 從localStorage中取得帳號
    const userData = JSON.parse(localStorage.getItem("userData")) || [];
    userData.forEach(user => {
        const option = document.createElement("option");
        option.value = user.Account;
        option.textContent = user.Account;
        memberSelect.appendChild(option);
    });

    // 查詢按鈕點擊事件監聽
    queryButton.addEventListener("click", function() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const selectedAccount = memberSelect.value;

        const orderData = JSON.parse(localStorage.getItem("orderData")) || [];
        const filteredOrders = orderData.filter(order => {
            return order.Account === selectedAccount &&
                   order.OrderDate >= startDate &&
                   order.OrderDate <= endDate;
        });

        // 清空表格内容
        orderTable.innerHTML = `
            <tr class="tr_style1">
                <td>訂購日期</td>
                <td>訂單編號</td>
                <td>帳號</td>
                <td>商品名稱</td>
                <td>商品數量</td>
                <td>總採購金額</td>
            </tr>
        `;

        // 動態生成表格
        filteredOrders.forEach(order => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.OrderDate}</td>
                <td>${order.OrderNumber}</td>
                <td><a href="#">${order.Account}</a></td>
                <td>${order.ProductName}</td>
                <td>${order.Quantity}</td>
                <td>${order.TotalPrice}</td>
            `;
            orderTable.appendChild(row);
        });
    });
});