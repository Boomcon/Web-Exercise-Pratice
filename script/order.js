/* 五、訂單查詢頁面 */
const startDateInput = document.querySelector("#startDate");
const endDateInput = document.querySelector("#endDate");
const memberSelect = document.querySelector("#memberSelect");
const queryButton = document.querySelector("#queryButton");
const orderTable = document.querySelector("#orderTable");
const ordersheet = document.querySelector(".ordersheet");

// 從localStorage中取得帳號
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const uniqueAccounts = [...new Set(orders.map(order => order.account))];
uniqueAccounts.forEach(account => {
    const option = document.createElement("option");
    option.value = account;
    option.textContent = account;
    memberSelect.appendChild(option);
});

// 查詢按鈕點擊事件監聽
queryButton.addEventListener("click", function() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const selectedAccount = memberSelect.value;

    if (!startDate || !endDate) {
        alert("請輸入日期範圍");
        return;
    }

    if (selectedAccount === "請選擇") {
        alert("請選擇帳號");
        return;
    }

    const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return order.account === selectedAccount &&
               orderDate >= start && orderDate <= end;
    });

    // 清空表格内容
    orderTable.innerHTML = `
        <tr class="tr_style1">
            <td>訂購日期</td>
            <td>訂單編號</td>
            <td>商品名稱</td>
            <td>商品數量</td>
            <td>總訂單金額</td>
        </tr>
    `;

    let grandTotal = 0;

    // 動態生成表格
    if (filteredOrders.length > 0) {
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${order.date}</td>
                    <td>${order.orderNumber}</td>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.totalPrice}</td>
                `;
                orderTable.appendChild(row);
                grandTotal += item.totalPrice;
            });
        });

        // 添加總金額行
        const totalRow = document.createElement("tr");
        totalRow.innerHTML = `
            <td colspan="4" style="text-align:center;">全部總訂單總金額</td>
            <td>${grandTotal}</td>
        `;
        orderTable.appendChild(totalRow);

        ordersheet.style.display = "block";
    } else {
        alert("無符合條件的訂單");
        ordersheet.style.display = "none";
    }
});